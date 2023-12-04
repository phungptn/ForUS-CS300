import decodeToken from '../../config/jwtToken'
const Thread = require('../models/thread');
const Box = require('../models/box');
const PageLimit = 10;

module.exports = {
    default: (req, res) => {
        let decoded = decodeToken(req.query.token);
        if (decoded == null) {
            res.status(401).json({ error: "Invalid token." });
        }
        else {
            let user_id = decoded.id;
            let box_id = req.query.box_id;
            let thread_id = req.query.thread_id;
            let page = req.query.page || 1;
            let { title, body } = req.body;
            if (req.method === 'GET') {
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
                                    $eq: [
                                      "$_id",
                                      "$$aid"
                                    ]
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
                                {
                                  $size: "$upvoted"
                                },
                                {
                                  $size: "$downvoted"
                                }
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
                                    $in: [
                                      "$_id",
                                      "$$cid"
                                    ]
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
                                          $eq: [
                                            "$_id",
                                            "$$aid"
                                          ]
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
                                      {
                                        $size: "$upvoted"
                                      },
                                      {
                                        $size: "$downvoted"
                                      }
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
            }
        }
    }
}