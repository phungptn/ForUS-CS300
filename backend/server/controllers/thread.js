const mongoose = require('mongoose');
const userUtil = require('../utils/users');
const User = require('../models/user');
const Thread = require('../models/thread');
const Box = require('../models/box');
const sanitizeHtml = require('sanitize-html');
const COMMENTS_PER_PAGE = 2;

module.exports = {
    createThread: async (req, res) => {
        let { title, body } = req.body;
        body = sanitizeHtml(body);
        console.log(title, body);
        let box_id = req.params.box_id;
        if (box_id == null || !Boolean(title) || !Boolean(body)) {
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
                        res.status(201).json({ message: "Thread created.", thread_id: thread._id });
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
                const user = await userUtil.findUserById(req);
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
                                { $project: { _id: 1, fullname: 1, avatarUrl: 1 } }
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
                            from: 'comments',
                            let: { "replyTo": "$comments.replyTo" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$_id", "$$replyTo"] } } },
                                { $project: { body: 1, author: 1 } }
                            ],
                            as: 'comments.replyTo'
                        }
                    },
                    {
                        $unwind: {
                            path: "$comments.replyTo",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: { "id": "$comments.replyTo.author" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
                                { $project: { fullname: 1 } }
                            ],
                            as: "comments.replyTo.author",
                        },
                    },
                    {
                        $unwind: {
                            path: "$comments.replyTo.author",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: { "id": "$author" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
                                { $project: { fullname: 1, avatarUrl: 1 } }
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
                            upvoted: { $first: '$upvoted' },
                            downvoted: { $first: '$downvoted' },
                            voteStatus: { $first: '$voteStatus' },
                            comments: { 
                                $push: {
                                    $cond: {
                                        if: { $ne: ['$comments', {}] },
                                        then: {
                                            $mergeObjects: [
                                                '$comments',
                                                {
                                                    score: {
                                                        $subtract: [
                                                            { $size: '$comments.upvoted' },
                                                            { $size: '$comments.downvoted' }
                                                        ]
                                                    },
                                                    voteStatus: {
                                                        $cond: {
                                                            if: { $in: [user._id, '$comments.upvoted'] },
                                                            then: 1,
                                                            else: {
                                                                $cond: {
                                                                    if: { $in: [user._id, '$comments.downvoted'] },
                                                                    then: -1,
                                                                    else: 0
                                                                }
                                                            }
                                                        }
                                                    },
                                                }
                                            ]
                                        },
                                        else: '$$REMOVE'
                                    }
                                }
                            }
                        }
                    },              
                    {
                        $addFields: {
                            createdAt: "$createdAt",
                            updatedAt: "$updatedAt",
                            score: {
                                $subtract: [
                                    { $size: '$upvoted' },
                                    { $size: '$downvoted'}
                                ]
                            },
                            voteStatus: {
                                $cond: {
                                    if: { $in: [user._id, '$upvoted'] },
                                    then: 1,
                                    else: {
                                        $cond: {
                                            if: { $in: [user._id, '$downvoted'] },
                                            then: -1,
                                            else: 0
                                        }
                                    }
                                }
                            },
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
                            score: 1,
                            voteStatus: 1,
                            pageCount: 1,
                            Author: 1,  
                            comments: {
                                $slice: [
                                    {
                                        $sortArray: {
                                            input: "$comments",
                                            sortBy: { createdAt: -1}
                                        }
                                    },
                                    (page - 1) * COMMENTS_PER_PAGE,
                                    COMMENTS_PER_PAGE
                                ],
                            }
                        }
                    }
                ]).exec();
                thread[0].body = thread[0].body.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
                if (thread[0].pageCount === 0) {
                    thread[0].pageCount = 1;
                    res.status(200).json({ thread: thread[0] });
                }
                else if (thread[0].pageCount < page) {
                    res.status(404).json({ error: "Page not found." });
                }
                else {
                    for (let i = 0; i < thread[0].comments.length; i++) {
                        thread[0].comments[i].body = thread[0].comments[i].body.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
                    }
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
    },
    isDeleter:
    /**
    * Internal middleware to check if the user is the author of the thread or a moderator of the box.
    * 
    * @param {string} thread_id the id of the thread.
    * @throws {400} - Invalid request.
    * @throws {403} - Invalid session.
    * @throws {403} - Unauthorized.
    * @throws {404} - Thread not found.
    * @throws {500} - Internal server error.
    */
    async (req, res, next) => {    
        let thread_id = req.params.thread_id;
        if (thread_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            try {
                const user = await userUtil.findUserById(req);
                if (user == null) {
                    res.status(403).json({ error: "Invalid session." });
                }
                else if (user.role === 'admin') {
                    next();
                }
                else {
                    const thread = await Thread.findOne({ _id: thread_id }).populate('box', 'moderators banned');
                    if (thread == null) {
                        res.status(404).json({ error: "Thread not found." });
                    }
                    else {
                        if (thread.box.moderators.includes(user._id) || (thread.author.equals(user._id) && !thread.box.banned.includes(user._id))) {
                            next();
                        }
                        else {
                            res.status(403).json({ error: "Unauthorized." });
                        }
                    }
                }
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    },
    getDeleterStatus:
    /**
    * Endpoint to check if the user is the author of the thread or a moderator of the box.
    * @param {string} thread_id the id of the thread.
    * @throws {400} - Invalid request.
    * @throws {403} - Invalid session.
    * @throws {404} - Thread not found.
    * @throws {500} - Internal server error.
    */
    async (req, res) => {
        let thread_id = req.params.thread_id;
        if (thread_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            try {
                const user = await userUtil.findUserById(req);
                if (user == null) {
                    res.status(403).json({ error: "Invalid session." });
                }
                else if (user.role === 'admin') {
                    res.status(200).json({ deleterStatus: 'admin' });
                }
                else {
                    const thread = await Thread.findOne({ _id: thread_id }).populate('box', 'moderators');
                    if (thread == null) {
                        res.status(404).json({ error: "Thread not found." });
                    }
                    else {
                        if (thread.box.moderators.includes(user._id)) {
                            res.status(200).json({ deleterStatus: 'moderator' });
                        }
                        else if (thread.author.equals(user._id) && !thread.box.banned.includes(user._id)) {
                            res.status(200).json({ deleterStatus: 'author' });
                        }
                        else {
                            res.status(200).json({ deleterStatus: 'user' });
                        }
                    }
                }
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    },
    isUpdater:
    /**
     * Internal middleware to check if the user is the author of the thread.
     * @param {string} thread_id the id of the thread.
     * @throws {400} - Invalid request.
     * @throws {403} - Invalid session.
     * @throws {403} - Unauthorized.
     * @throws {404} - Thread not found.
     * @throws {500} - Internal server error.
     */
    async (req, res, next) => {
        let thread_id = req.params.thread_id;
        if (thread_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            try {
                const user = await userUtil.findUserById(req);
                if (user == null) {
                    res.status(403).json({ error: "Invalid session." });
                }
                else {
                    const thread = await Thread.findOne({ _id: thread_id }.populate('box', 'banned'));
                    if (thread == null) {
                        res.status(404).json({ error: "Thread not found." });
                    }
                    else {
                        if (thread.author.equals(user._id) && !thread.box.banned.includes(user._id)) {
                            next();
                        }
                        else {
                            res.status(403).json({ error: "Unauthorized." });
                        }
                    }
                }
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    },
    getUpdaterStatus:
    /**
     * Endpoint to check if the user is the author of the thread.
     * @param {string} thread_id the id of the thread.
     * @throws {400} - Invalid request.
     * @throws {403} - Invalid session.
     * @throws {404} - Thread not found.
     * @throws {500} - Internal server error.
    */
    async (req, res) => {
        let thread_id = req.params.thread_id;
        if (thread_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
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
                        if (thread.author.equals(user._id)) {
                            res.status(200).json({ updaterStatus: 'author' });
                        }
                        else {
                            res.status(200).json({ updaterStatus: 'user' });
                        }
                    }
                }
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    },
    isBanned:
    /**
     * Internal middleware to check if the user is banned from the box of the thread.
     * @param {string} thread_id the id of the thread.
     * @throws {400} - Invalid request.
     * @throws {403} - Invalid session.
     * @throws {403} - Unauthorized.
     * @throws {404} - Thread not found.
     * @throws {500} - Internal server error.
     */
    async (req, res, next) => {
        let thread_id = req.params.thread_id;
        if (thread_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            try {
                const user = await userUtil.findUserById(req);
                if (user == null) {
                    res.status(403).json({ error: "Invalid session." });
                }
                else {
                    const thread = await Thread.findOne({ _id: thread_id }).populate('box', 'banned');
                    if (thread == null) {
                        res.status(404).json({ error: "Thread not found." });
                    }
                    else {
                        if (thread.box.banned.includes(user._id)) {
                            res.status(403).json({ error: "Unauthorized." });
                        }
                        else {
                            next();
                        }
                    }
                }
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    }
}