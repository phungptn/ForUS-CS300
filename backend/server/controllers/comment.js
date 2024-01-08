const mongoose = require('mongoose');
const userUtil = require('../utils/users');
const Comment = require('../models/comment');
const Thread = require('../models/thread');
const Box = require('../models/box');
const User = require('../models/user');
const sanitizeHtml = require('sanitize-html');
const ERROR = require('./error');
const PAGE_SIZE = 10;

module.exports = {
    createComment: async (req, res) => {
        let { body, replyTo, box_id } = req.body;
        body = sanitizeHtml(body);
        console.log('Submitting comment:', body);
        let thread_id = req.params.thread_id;
        if (body == null || thread_id == null ) {
            res.status(400).json({ error: ERROR.INVALID_REQUEST });
        } else {
            const session = await mongoose.startSession();
            try {
                const user = await userUtil.findUserById(req);
                if (user == null) {
                    res.status(403).json({ error: ERROR.INVALID_SESSION });
                } else {
                    const comment = new Comment({
                        body: body,
                        author: user._id,
                        thread: thread_id,
                        replyTo: replyTo,
                        box: box_id
                    });
                    await session.withTransaction(async () => {
                        await comment.save();
                        await Thread.updateOne(
                            { _id: thread_id },
                            { $push: { comments: comment._id } }
                        );
                        await User.updateOne(
                            { _id: user._id },
                            { $push: { comments: comment._id } }
                        );
                    });
                    res.status(201).json({ message: "Comment created." , comment_id: comment._id});
                }
            } catch (err) {
                res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
            } finally {
                session.endSession();
            }
        }
    },
    readComment: async (req, res) => {
        let comment_id = req.params.comment_id;
        if (comment_id == null) {
            res.status(400).json({ error: ERROR.INVALID_REQUEST });
        } else {
            try {
                const comment = await Comment.aggregate([
                    { $match: { _id: new mongoose.Types.ObjectId(comment_id) } },
                    { 
                        $lookup: {
                            from: 'threads',
                            let: { 'thread_id': '$thread' },
                            pipeline: [
                                { $match: { $expr: { $eq: [ '$_id', '$$thread_id' ] } } },
                                {
                                    $lookup: {
                                        from: 'comments',
                                        let: { 'comment_id': '$comments' },
                                        pipeline: [
                                            { $match: { $expr: { $in: [ '$_id', '$$comment_id' ] } } },
                                            { $sort: { createdAt: 1 } },
                                            { $project: { _id: 1 } }
                                        ],
                                        as: 'comments'
                                    },
                                },
                                { $project: { _id: 1, comments: 1 } },
                            ],
                            as: 'thread'
                        }
                    },
                    { $unwind: '$thread' },
                    { 
                        $addFields: {
                            page: {
                                $ceil: {
                                    $divide: [
                                        { $indexOfArray: [ '$thread.comments._id', '$_id' ] },
                                        PAGE_SIZE
                                    ]
                                }
                            }
                        }
                    },
                    { $project: { _id: 1, thread: { _id: 1 }, page: 1 } }
                ]);
                res.status(200).json({ comment: comment[0] });
            }
            catch (err) {
                res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
            }
        }
    },
    updateComment: async (req, res) => {
        let { body } = req.body;
        let comment_id = req.params.comment_id;
        if (body == null || comment_id == null) {
            res.status(400).json({ error: ERROR.INVALID_REQUEST });
        } else {
            try {
                const user = await userUtil.findUserById(req);
                if (user == null) {
                    res.status(403).json({ error: ERROR.INVALID_SESSION });
                } else {
                    const comment = await Comment.findOne({ _id: comment_id });
                    if (comment == null) {
                        res.status(404).json({ error: ERROR.NOT_FOUND });
                    } else {
                        const isBanned = await Box.exists({ _id: comment.thread.box, banned: user._id });
                        if (comment.author.equals(user._id) && !isBanned) {
                            comment.body = body;
                            await comment.save();
                            res.status(200).json({ message: "Comment updated." });
                        } else {
                            res.status(403).json({ error: ERROR.UNAUTHORIZED });
                        }
                    }
                }
            } catch (err) {
                res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
            }
        }
    },
    deleteComment: async (req, res) => {
        const comment_id = req.params.comment_id;
        if (comment_id == null) {
            res.status(400).json({ error: ERROR.INVALID_REQUEST });
        } else {
            const session = await mongoose.startSession();
            try {
                const user = await userUtil.findUserById(req);
                if (user == null) {
                    res.status(403).json({ error: ERROR.INVALID_SESSION });
                } else {
                    const comment = await Comment.findOne({ _id: comment_id });
                    if (comment == null) {
                        res.status(404).json({ error: ERROR.NOT_FOUND });
                    } else {
                        const isBanned = await Box.exists({ _id: comment.thread.box, banned: user._id });
                        console.log('isBanned:', isBanned);
                        if ((user.role == 'admin' || comment.author._id.equals(user._id)) && !isBanned) {
                            await session.withTransaction(async () => {
                                await Comment.findOneAndDelete({ _id: comment_id });
                                await Thread.updateOne({ _id: comment.thread }, { $pull: { comments: comment_id } });
                                await User.updateOne({ _id: comment.author }, { $pull: { comments: comment_id } });
                                // await Comment.updateMany({ replyTo: comment_id }, { $set: { replyTo: null } });
                            });
                            res.status(200).json({ message: "Comment deleted." });
                            
                        } else {
                            res.status(403).json({ error: ERROR.UNAUTHORIZED });
                        }
                    }
                }
            } catch (err) {
                res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
            } finally {
                session.endSession();
            }
        }
    },
    upvoteComment: async (req, res) => {
        let comment_id = req.params.comment_id;
        if (comment_id == null) {
            res.status(400).json({ error: ERROR.INVALID_REQUEST });
        } else {
            const session = await mongoose.startSession();
            try {
                const user = await userUtil.findUserById(req);
                const isUpvoted = await Comment.exists({ _id: comment_id, upvoted: user._id });
                let voteStatus = isUpvoted ? 0 : 1;
                await session.withTransaction(async () => { 
                    if (isUpvoted) {
                        await Comment.updateOne({ _id: comment_id }, { $pull: { upvoted: user._id } });
                    } else {
                        await Comment.updateOne({ _id: comment_id }, { $pull: { downvoted: user._id } });
                        await Comment.updateOne({ _id: comment_id }, { $push: { upvoted: user._id } });
                    }
                });
                res.status(200).json({ message: "Comment upvoted.",  voteStatus: voteStatus });
            } catch (err) {
                res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
            } finally {
                session.endSession();
            }
        }
    },
    downvoteComment: async (req, res) => {
        let comment_id = req.params.comment_id;
        if (comment_id == null) {
            res.status(400).json({ error: ERROR.INVALID_REQUEST });
        } else {
            const session = await mongoose.startSession();
            try {
                const user = await userUtil.findUserById(req);
                const isDownvoted = await Comment.exists({ _id: comment_id, downvoted: user._id });
                let voteStatus = isDownvoted ? 0 : -1;
                await session.withTransaction(async () => {
                    if (isDownvoted) {
                        await Comment.updateOne({ _id: comment_id }, { $pull: { downvoted: user._id } });
                    } else {
                        await Comment.updateOne({ _id: comment_id }, { $pull: { upvoted: user._id } });
                        await Comment.updateOne({ _id: comment_id }, { $push: { downvoted: user._id } });
                    }
                });
                res.status(200).json({ message: "Comment downvoted.",  voteStatus: voteStatus });
            } catch (err) {
                res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
            } finally {
                session.endSession();
            }
        }
    }
};
