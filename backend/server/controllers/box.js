const Box = require('../models/box');
const Group = require('../models/group');

module.exports = {
    create: (req, res) => {
        let group_id = req.params.group_id;
        let { name, description } = req.body;
        if (group_id == null || name == null || description == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            let box = new Box({ name: name, description: description });
            box.save((err) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    Group.findByIdAndUpdate(group_id, { $push: { boxes: box._id } }, (err) => {
                        if (err) {
                            res.status(500).json({ error: err });
                        } else {
                            res.status(200).json(box);
                        }
                    });
                }
            });
        }
    },
    read: (req, res) => {
        let box_id = req.params.box_id;
        if (box_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            Box.aggregate([
                { $match: { _id: box_id } },
                {
                $lookup: {
                    from: "Thread",
                    localField: "threads",
                    foreignField: "_id",
                    as: "threads",
                },
                },
                { $unwind: "$threads" },
                {
                $addFields: {
                    name: "$threads.title",
                    score: { $subtract: [{ $size: "$threads.upvoted" }, { $size: "$threads.downvoted" }] },
                    replies: { $size: "$threads.comments" },
                },
                },
                { $project: { _id: 0, name: 1, score: 1, replies: 1 } },
            ]).exec((err, threads) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    res.status(200).json(threads);
                }
            });
        }
    },
    update: (req, res) => {
        let box_id = req.params.box_id;
        let { name, description } = req.body;
        if (box_id == null || name == null || description == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            Box.findOneAndUpdate({ _id: box_id }, { name: name, description: description }, (err) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    res.status(200).json({ message: "Box updated." });
                }
            });
        }
    },
    delete: (req, res) => {
        res.status(501).json({ error: "Not implemented." });
    }
}