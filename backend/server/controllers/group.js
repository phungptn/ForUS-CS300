const Group = require('../models/group');

module.exports = {
    default: (req, res) => {
        let group_id = req.query.group_id;
        let { name } = req.body;
        switch (req.method) {
            case 'GET':
                if (group_id == null) {
                    Group.find({}).populate('boxes', 'name description').exec((err, groups) => {
                        if (err) {
                            res.status(500).json({ error: err });
                        } else {
                            res.status(200).json(groups);
                        }
                    });
                }
                else {
                    Group.findById(group_id, (err, group) => {
                        if (err) {
                            res.status(500).json({ error: err });
                        } else {
                            res.status(200).json(group);
                        }
                    });
                }
                break;
            case 'POST':
                if (name == null) {
                    res.status(400).json({ error: "Invalid request." });
                }
                else {
                    let group = new Group({ name: name });
                    group.save((err) => {
                        if (err) {
                            res.status(500).json({ error: err });
                        } else {
                            res.status(200).json(group);
                        }
                    });
                }
                break;
            case 'PUT':
                if (name == null) {
                    res.status(400).json({ error: "Invalid request." });
                }
                else {
                    Group.findOneAndUpdate({ _id: group_id }, {name: name}, (err) => {
                        if (err) {
                            res.status(500).json({ error: err });
                        } else {
                            res.status(200).json({ message: "Group updated." });
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
}