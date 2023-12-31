const User = require("../models/user");
const Box = require("../models/box");
const Thread = require("../models/thread");
const { findUserById } = require("../utils/users");

const RESULTS_PER_PAGE = 1;
const ALLOWED_TYPES = new Set(["user", "box", "thread"]);
const ALLOWED_DIRECTIONS = new Set(["asc", "desc"]);

module.exports = {
    searchQuery: async (req, res) => {
        let q = req.query.q;
        let type = req.query.type;
        let direction = req.query.direction;
        let order = req.query.order;
        let page = req.params.page;
        if (!Boolean(q) || !Boolean(type) || page == null || !Boolean(direction) || !Boolean(order)) {
            res.status(400).json({ error: "Invalid request." });
        }
        else if (!ALLOWED_TYPES.has(type) || !ALLOWED_DIRECTIONS.has(direction)) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            page = parseInt(page);
            try {
                if (direction === "asc") {
                    direction = 1;
                }
                else {
                    direction = -1;
                }
                if (type === "user") {
                    const ALLOWED_ORDERS = new Set(["username", "fullname"]);
                    if (!ALLOWED_ORDERS.has(order)) {
                        res.status(400).json({ error: "Invalid request." });
                    }
                    else {
                        let users = await User.find({ $text: { $search: q } }, { username: 1, fullname: 1, avatarUrl: 1 }).sort({ [order]: direction }).limit(RESULTS_LIMIT).skip((page - 1) * RESULTS_PER_PAGE).limit(RESULTS_PER_PAGE);
                        res.status(200).json({ users: users });
                    }
                }
                else if (type === "box") {
                    const ALLOWED_ORDERS = new Set(["name"]);
                    if (!ALLOWED_ORDERS.has(order)) {
                        res.status(400).json({ error: "Invalid request." });
                    }
                    else {
                        let boxes = await Box.find({ $text: { $search: q } }, { name: 1, description: 1, avatarUrl: 1 }).sort({ [order]: direction }).limit(RESULTS_LIMIT).skip((page - 1) * RESULTS_PER_PAGE).limit(RESULTS_PER_PAGE);
                        res.status(200).json({ boxes: boxes });
                    }
                }
                else if (type === "thread") {
                    const user = await findUserById(req);
                    const ALLOWED_ORDERS = new Set(["title", "createdAt", "updatedAt", "score", "commentCount"]);
                    if (!ALLOWED_ORDERS.has(order)) {
                        res.status(400).json({ error: "Invalid request." });
                    }
                    else {
                        const result = await Thread.aggregate([
                            {
                                $match: {
                                    $text: {
                                        $search: q
                                    }
                                }
                            },
                            {
                                $addFields: {
                                    score: {
                                        $subtract: [
                                            { $size: "$upvoted" },
                                            { $size: "$downvoted" }
                                        ]
                                    },
                                    commentCount: {
                                        $size: "$comments"
                                    },
                                    voteStatus: {
                                        $cond: {
                                            if: {
                                                $in: [user._id, "$upvoted"]
                                            },
                                            then: 1,
                                            else: {
                                                $cond: {
                                                    if: {
                                                        $in: [user._id, "$downvoted"]
                                                    },
                                                    then: -1,
                                                    else: 0
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                $lookup: {
                                    from: "users",
                                    let: { "id": "$author" },
                                    pipeline: [
                                        { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
                                        { $project: { _id: 1, username: 1, fullname: 1 } }
                                    ],
                                    as: "author"
                                }
                            },
                            {
                                $unwind: "$author"
                            },
                            {
                                $project: {
                                    _id: 1,
                                    title: 1,
                                    body: 1,
                                    author: 1,
                                    score: 1,
                                    commentCount: 1,
                                    voteStatus: 1,
                                    createdAt: 1,
                                    updatedAt: 1,
                                }
                            },
                            {
                                $sort: {
                                    [order]: direction
                                }
                            },
                            {
                                $facet: {
                                    metadata: [{ $count: "total" }, { $addFields: { pageCount: { $ceil: { $divide: ["$total", RESULTS_PER_PAGE] } } } }],
                                    threads: [{ $skip: (page - 1) * RESULTS_PER_PAGE }, { $limit: RESULTS_PER_PAGE }]
                                }
                            },
                            {
                                $unwind: "$metadata"
                            }
                        ]);
                        res.status(200).json({ result: result[0] });
                    }
                }
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    }
}