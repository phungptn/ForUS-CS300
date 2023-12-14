const Group = require('../models/group');

module.exports = {
    readGroup: async (req, res) => {
        try {
            const groups = await Group.find({}).populate('boxes', 'name description').exec();
            res.status(200).json(groups);
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    },
    createGroup: async (req, res) => {
        let { name } = req.body;
        if (name == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            let group = new Group({ name: name });
            try {
                await group.save();
                res.status(201).json({ message: "Group created." });
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    },
    updateGroup: async (req, res) => {
        let group_id = req.params.group_id;
        let { name } = req.body;
        if (name == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            try {
                await Group.updateOne({ _id: group_id }, { name: name });
                res.status(200).json({ message: "Group updated." });
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    },
    deleteGroup: async (req, res) => {
        res.status(501).json({ error: "Not implemented." });    
    }
}