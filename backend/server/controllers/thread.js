const mongoose = require('mongoose');
const userUtil = require('../utils/users');
const User = require('../models/user');
const Thread = require('../models/thread');
const Box = require('../models/box');
const PageLimit = 10;

module.exports = {
    createThread: async (req, res) => {
        let { title, body } = req.body;
        let box_id = req.params.box_id;
        let token = req.body.token;
        if (title == null || body == null || box_id == null || token == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            const session = await mongoose.startSession();
            try {
                const user = await userUtil.findUserById(req.body.token);
                if (user == null) {
                    res.status(403).json({ error: "Invalid session." });
                }
                else {
                    const thread = new Thread({
                        title: title,
                        body: body,
                        author: user._id,
                        box: box_id
                    });
                    session.withTransaction(async () => {
                        await thread.save();
                        await Box.updateOne(
                            { _id: box_id },
                            { $push: { threads: thread._id } }
                        );
                        await User.updateOne(
                            { _id: user._id },
                            { $push: { threads: thread._id } }
                        );
                    });
                }
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
            finally {
                session.endSession();
            }
        }
    },
    readThread: async (req, res) => {
        let thread_id = req.params.thread_id;
        let page = req.params.page;
        if (page == null) {
            page = 1;
        }
        if (thread_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            try {
                const threads = await Thread.aggregate([
                    {
                        $match: {
                            _id: thread_id
                        }
                    },
                    {
                        $lookup: {
                            from: "User",
                                let: {
                                    aid: "$author"
                                },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$_id", "$$aid"]
                                        }
                                    }
                                },
                                {
                                    $project: {
                                    _id: 0,
                                    username: 1
                                    }
                                }
                            ],
                            as: "author"
                        }
                    },
                    {
                        $unwind: "$author"
                    },
                    {
                        $addFields: {
                            score: {
                                $subtract: [
                                    { $size: "$upvoted" },
                                    { $size: "$downvoted" }
                                ]
                            },
                            comments: {
                                $slice: ["$comments", (page - 1) * PageLimit, PageLimit]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "Comment",
                            let: {
                                cid: "$comments"
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $in: ["$_id", "$$cid"]
                                        }
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "User",
                                        let: {
                                            aid: "$author"
                                        },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $eq: ["$_id","$$aid"]
                                                    }
                                                }
                                            },
                                            {
                                                $project: {
                                                    _id: 0,
                                                    username: 1
                                                }
                                            }
                                        ],
                                        as: "author"
                                    }
                                },
                                {
                                    $unwind: "$author"
                                },
                                {
                                    $addFields: {
                                    score: {
                                        $subtract: [
                                            { $size: "$upvoted" },
                                            { $size: "$downvoted" }
                                        ]
                                    }
                                    }
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        body: 1,
                                        score: 1,
                                        author: 1,
                                        replyTo: 1
                                    }
                                }
                            ],
                            as: "comments"
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            title: 1,
                            score: 1,
                            comments: 1,
                            author: 1
                        }
                    }
                ]).exec();
                res.status(200).json({ threads: threads });
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    },
    updateThread: async (req, res) => {
        let { title, body } = req.body;
        let thread_id = req.params.thread_id;
        let token = req.body.token;
        if (title == null || body == null || thread_id == null || token == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            try {
                const user = await userUtil.findUserById(req.body.token);
                if (user == null) {
                    res.status(403).json({ error: "Invalid session." });
                }
                else {
                    const thread = await Thread.findOne({ _id: thread_id });
                    if (thread == null) {
                        res.status(404).json({ error: "Thread not found." });
                    }
                    else if (thread.author != user._id) {
                        res.status(403).json({ error: "Unauthorized." });
                    }
                    else {
                        thread.title = title;
                        thread.body = body;
                        await thread.save();
                        res.status(200).json({ message: "Thread updated." });
                    }
                }
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    },
    deleteThread: async (req, res) => {
        res.status(501).json({ error: "Not implemented." });
    },
    upvoteThread: async (req, res) => {
        res.status(501).json({ error: "Not implemented." });
    },
    downvoteThread: async (req, res) => {
        res.status(501).json({ error: "Not implemented." });
    }
}