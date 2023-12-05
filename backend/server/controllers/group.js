const Group = require('../models/group');

module.exports = {
    read: (req, res) => {
        Group.find({}).populate('boxes', 'name description').exec((err, group) => {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                res.status(200).json(group);
            }
        });
    },
    create: (req, res) => {
        let { name } = req.body;
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
    },
    update: (req, res) => {
        let group_id = req.params.group_id;
        let { name } = req.body;
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
    },
    delete: (req, res) => {
        res.status(501).json({ error: "Not implemented." });    
    }
}