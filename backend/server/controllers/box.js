import decodeToken from '../../config/jwtToken'
const Box = require('../models/box');
const Group = require('../models/group');
const User = require('../models/user');

module.exports = {
    default: (req, res) => {
        let decoded = decodeToken(req.query.token);
        if (decoded == null) {
            res.status(401).json({ error: "Invalid token." });
        }
        else {
            let user_id = decoded.id;
            let group_id = req.query.group_id;
            let box_id = req.query.box_id;
            let mod_id = req.query.mod_id;
            let { name, description } = req.body;
            if (req.method === 'GET') {
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
            }
            else {
                User.isAdmin(user_id).then((isAdmin) => {
                    if (!isAdmin) {
                        res.status(403).json({ error: "Unauthorized." });
                    }
                    else {
                        switch(req.method) {
                            case 'POST':
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
                                break;
                            case 'PUT':
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
                                break;
                            case 'DELETE':
                                res.status(501).json({ error: "Not implemented." });
                            default:
                                res.status(400).json({ error: "Invalid request." });
                        }
                    }
                }).catch((err) => {
                    res.status(500).json({ error: err });
                });
            }
        }
    }
}