const Group = require('../models/group');
const mongoose = require('mongoose');

module.exports = {
    readGroup: async (req, res) => {
        try {
            // get all groups with name and the thread count of each box
            const groups = await Group.aggregate([
                {
                    $lookup: {
                        from: 'boxes',
                        localField: 'boxes',
                        foreignField: '_id',
                        as: 'boxes',
                    }
                },
                {
                    $unwind: {
                        path: '$boxes',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        name: { $first: '$name' },
                        boxes: { 
                            $push: {
                                $cond: {
                                    if: { $isArray: '$boxes.threads' },
                                    then: {
                                        _id: '$boxes._id',
                                        name: '$boxes.name',
                                        description: '$boxes.description',
                                        threadCount: { $size: '$boxes.threads' },
                                    },
                                    else: '$boxes'
                                }
                            }
                        },
                        createdAt: { $first: '$createdAt' }
                    }
                },
                {
                    $sort: { createdAt: 1 }
                }
            ]);
            res.status(200).json(groups);
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    },
    createGroup: async (req, res) => {
        let { name } = req.body;
        if (name == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            let group = new Group({ name: name });
            try {
                await group.save();
                res.status(201).json({ message: "Group created.", group: group });
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    },
    updateGroup: async (req, res) => {
        let group_id = req.params.group_id;
        let { name } = req.body;
        if (name == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            try {
                await Group.updateOne({ _id: group_id }, { name: name }).exec();
                res.status(200).json({ message: "Group updated." });
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    },
    deleteGroup: async (req, res) => {
        let group_id = req.params.group_id;
        
        if (group_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else{
            const session = await mongoose.startSession();
            try {
                await session.withTransaction(async () => {
                    await Group.findOneAndDelete({ _id: group_id }, { session: session });
                });
                res.status(200).json({ message: "Group deleted." });
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