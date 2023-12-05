const Thread = require('../models/thread');
const PageLimit = 10;

module.exports = {
    create: (req, res) => {
        res.status(501).json({ error: "Not implemented." });
    },
    read: (req, res) => {
        let thread_id = req.params.thread_id;
        let page = req.params.page;
        if (page == null) {
            page = 1;
        }
        if (thread_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            Thread.aggregate([
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
        res.status(501).json({ error: "Not implemented." });
    },
    delete: (req, res) => {
        res.status(501).json({ error: "Not implemented." });
    },
    upvote: (req, res) => {
        res.status(501).json({ error: "Not implemented." });
    },
    downvote: (req, res) => {
        res.status(501).json({ error: "Not implemented." });
    }
}