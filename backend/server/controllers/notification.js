const Notification = require('../models/notification');

module.exports = {
    sendNotification: async (req, res) => {
        res.status(501).json({ error: "Not implemented." });
    },
    sendReport: async (req, res) => {
        res.status(501).json({ error: "Not implemented." });
    }
}