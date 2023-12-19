const mongoose = require('mongoose');
const Box = require('../models/box');
const Group = require('../models/group');

module.exports = {
    createBox: async (req, res) => {
        let group_id = req.params.group_id;
        let { name, description } = req.body;
        if (group_id == null || name == null || description == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            let box = new Box({ name: name, description: description });
            const session = await mongoose.startSession();
            try {
                await session.withTransaction(async () => {
                    await box.save({ session: session });
                    await Group.updateOne({ _id: group_id }, { $push: { boxes: box._id } }, {session: session });
                });
                let jsonBox = box.toJSON();
                jsonBox.threadCount = 0;
                res.status(200).json({ message: "Box created.", box: jsonBox});
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
            finally {
                session.endSession();
            }
        }
    },
    readBox: async (req, res) => {
        let box_id = req.params.box_id;
        if (box_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            try {   
                const box = await Box.aggregate([
                    { $match: { _id: new mongoose.Types.ObjectId(box_id) } },
                    {
                        $lookup: {
                            from: "threads",
                            localField: "threads",
                            foreignField: "_id",
                            as: "threads",
                        },
                    },
                    { 
                        $unwind: {
                            path: "$threads",
                            preserveNullAndEmptyArrays: true,
                        }
                    },
                    {
                        $addFields: {
                            score: { 
                                $subtract: [
                                    { 
                                        $cond: {
                                            if: { $isArray: "$threads.upvoted" },
                                            then: { $size: "$threads.upvoted" },
                                            else: 0
                                        }
                                    },
                                    {
                                        $cond: {
                                            if: { $isArray: "$threads.downvoted" },
                                            then: { $size: "$threads.downvoted" },
                                            else: 0
                                        }
                                    }
                                ] 
                            },
                            replies: {
                                $cond: {
                                    if: { $isArray: "$threads.replies" },
                                    then: { $size: "$threads.replies" },
                                    else: 0
                                }
                            }
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            name: { $first: "$name" },
                            description: { $first: "$description" },
                            threads: { $push: "$threads" }
                        }
                    },
                    { 
                        $project: {
                            _id: 1,
                            name: 1,
                            description: 1,
                            threads: {
                                _id: 1,
                                title: 1,
                                body: 1,
                                score: 1,
                                replies: 1,
                            }
                        } 
                    },
                ]).exec();
                res.status(200).json({ box: box[0] });
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    },
    updateBox: async (req, res) => {
        let box_id = req.params.box_id;
        let { name, description } = req.body;
        if (box_id == null || name == null || description == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            try {
                await Box.updateOne({ _id: box_id }, { name: name, description: description });
                res.status(200).json({ message: "Box updated." });
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    },
    deleteBox: async (req, res) => {
        let box_id = req.params.box_id;
        if (box_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            const session = await mongoose.startSession();
            try {
                await session.withTransaction(async () => {
                    await Box.findOneAndDelete({ _id: box_id }, { session: session });
                });
                res.status(200).json({ message: "Box deleted." });
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
            finally {
                session.endSession();
            }
        }
    }
}