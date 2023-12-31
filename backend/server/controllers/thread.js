const mongoose = require('mongoose');
const userUtil = require('../utils/users');
const User = require('../models/user');
const Thread = require('../models/thread');
const Box = require('../models/box');
const COMMENTS_PER_PAGE = 2;
const SEARCH_RESULTS_PER_PAGE = 5;

module.exports = {
    createThread: async (req, res) => {
        let { title, body } = req.body;
        console.log(title, body);
        let box_id = req.params.box_id;
        if (title == null || body == null || box_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            const session = await mongoose.startSession();
            try {
                const user = await userUtil.findUserById(req);
                if (user == null) {
                    res.status(403).json({ error: "Invalid session." });
                }
                else {
                    const isBanned = await Box.exists({ _id: box_id, banned: user._id });
                    if (isBanned) {
                        res.status(403).json({ error: "You are banned." });
                    }
                    else {
                        console.log("Creating thread...");
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
                        res.status(201).json({ message: "Thread created." });
                    }
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
        if (thread_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            if (page == null) {
                page = 1;
            }
            else {
                page = parseInt(page);
            }
            try {
                const thread = await Thread.aggregate([
                    { $match: { _id: new mongoose.Types.ObjectId(thread_id)}},
                    {
                        $lookup: {
                            from: 'comments',
                            localField: '_id',
                            foreignField: 'thread',
                            as: 'comments'
                        }
                    },
                    {
                        $unwind: {
                            path: "$comments",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: { "id": "$comments.author" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
                                { $project: { _id: 1, fullname: 1 } }
                            ],
                            as: "comments.author",
                        },
                    },
                    {
                        $unwind: {
                            path: "$comments.author",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: { "id": "$author" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
                                { $project: { fullname: 1 } }
                            ],
                            as: "author",
                        },
                    },    
                    {
                        $group: {
                            _id: '$_id',
                            title: { $first: '$title' },
                            body: { $first: '$body' },
                            author: { $first: '$author' },
                            createdAt: { $first: '$createdAt' },
                            updatedAt: { $first: '$updatedAt' },
                            comments: { $push: '$comments'}
                        }
                    },              
                    {
                        $addFields: {
                            createdAt: "$createdAt",
                            updatedAt: "$updatedAt",
                            pageCount: {
                                $ceil: {
                                    $divide: [
                                        { $size: '$comments' },
                                        COMMENTS_PER_PAGE
                                    ]
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            author: { $arrayElemAt: ['$author', 0] },
                            body: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            pageCount: 1,
                            Author: 1,  
                            comments: {
                                $slice: [
                                    {
                                        $sortArray: {
                                            input: "$comments",
                                            sortBy: { updatedAt: -1}
                                        }
                                    },
                                    (page - 1) * COMMENTS_PER_PAGE,
                                    COMMENTS_PER_PAGE
                                ],
                            }
                        }
                    }
                ]).exec();
                if (thread[0].pageCount === 0) {
                    thread[0].pageCount = 1;
                    res.status(200).json({ thread: thread[0] });
                }
                else if (thread[0].pageCount < page) {
                    res.status(404).json({ error: "Page not found." });
                }
                else {
                    res.status(200).json({ thread: thread[0] });
                }
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
                    else {
                        const isBanned = await Box.exists({ _id: thread.box, banned: user._id });
                        if (thread.author != user._id || isBanned) {
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
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    },
    deleteThread: async (req, res) => {
        const thread_id = req.params.thread_id;
        if (thread_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            const session = await mongoose.startSession();
            try {
                const user = await userUtil.findUserById(req);
                if (user == null) {
                    res.status(403).json({ error: "Invalid session." });
                }
                else {
                    const thread = await Thread.findOne({ _id: thread_id });
                    if (thread == null) {
                        res.status(404).json({ error: "Thread not found." });
                    }
                    else {
                        const isBanned = await Box.exists({ _id: thread.box, banned: user._id });
                        if ((user.role == 'user' && thread.author != user._id) || isBanned) {
                            res.status(403).json({ error: "Unauthorized." });
                        }
                        else {
                            session.withTransaction(async () => {
                                // Do not use thread.delete() because it does not trigger the post hook.
                                await Box.updateOne({ _id: thread.box }, { $pull: { threads: thread_id } });
                                await Thread.findOneAndDelete({ _id: thread_id });
                            });
                            res.status(200).json({ message: "Thread deleted." });
                        }
                    }
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
    upvoteThread: async (req, res) => {
        let thread_id = req.params.thread_id;
        if (thread_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            const session = await mongoose.startSession();
            try {
                const user = await userUtil.findUserById(req);
                const isUpvoted = await Thread.exists({ _id: thread_id, upvoted: user._id });
                let voteStatus = isUpvoted ? 0 : 1;
                session.withTransaction(async () => {
                    if (isUpvoted) {
                        await Thread.updateOne({ _id: thread_id }, { $pull: { upvoted: user._id } });
                    }
                    else {
                        await Thread.updateOne({ _id: thread_id }, { $pull: { downvoted: user._id } });
                        await Thread.updateOne({ _id: thread_id }, { $push: { upvoted: user._id } });
                    }
                });
                res.status(200).json({ message: "Thread upvoted.",  voteStatus: voteStatus });
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
            finally {
                session.endSession();
            }
        }
    },
    downvoteThread: async (req, res) => {
        let thread_id = req.params.thread_id;
        if (thread_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            const session = await mongoose.startSession();
            try {
                const user = await userUtil.findUserById(req);
                const isDownvoted = await Thread.exists({ _id: thread_id, downvoted: user._id });
                let voteStatus = isDownvoted ? 0 : -1;
                session.withTransaction(async () => {    
                    if (isDownvoted) {
                        await Thread.updateOne({ _id: thread_id }, { $pull: { downvoted: user._id } });
                    }
                    else {
                        await Thread.updateOne({ _id: thread_id }, { $pull: { upvoted: user._id } });
                        await Thread.updateOne({ _id: thread_id }, { $push: { downvoted: user._id } });
                    }
                });
                res.status(200).json({ message: "Thread downvoted.", voteStatus: voteStatus });
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