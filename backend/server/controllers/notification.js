const Notification = require('../models/notification');
const User = require('../models/user');
const { findUserById } = require('../utils/users');
const mongoose = require('mongoose');

module.exports = {
    sendNotificationToUsers: async (req, res) => {
        let { title, body, user_ids } = req.body;
        if (title == null || body == null || user_ids == null || !Array.isArray(user_ids) || user_ids.length == 0) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            const session = await mongoose.startSession();
            let notification = new Notification({ title: title, body: body });
            try {
                await session.withTransaction(async () => {
                    await notification.save();
                    await User.updateMany({ _id: { $in: user_ids } }, { $push: { notifications: { notification: notification._id } } });
                });
                res.status(200).json({ message: "Notification sent." });
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
            finally {
                session.endSession();
            }
        }
    },
    readReports: async (req, res) => {
        let limit = req.params.limit;
        if (limit == null) {
            limit = -1;
        }
        try {
            let reports;
            if (limit == -1) {
                reports = await Notification.find({ isReport: true });
            }
            else {
                reports = await Notification.find({ isReport: true }).limit(parseInt(limit));
            }
            res.status(200).json({ reports: reports });
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    },
    sendReportToAdmins: async (req, res) => {
        let { body , thread, comment, user } = req.body;
        if (body == null || (thread == null && comment == null && user == null)) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            let notification = new Notification({ title: "Report", body: body, thread: thread, comment: comment, user: user, isReport: true });
            try {
                await notification.save();
                res.status(200).json({ message: "Report sent." });
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    },
    deleteInboxNotification: async (req, res) => {
        let notification_id = req.params.notification_id;
        let token = req.cookies.token;
        if (token == null || notification_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            try {
                const user = await findUserById(token);
                if (user == null) {
                    res.status(400).json({ error: "Invalid request." });
                }
                else {
                    await user.updateOne({ $pull: { notifications: { notification: notification_id } } });
                    res.status(200).json({ message: "Notification deleted." });
                }   
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
            
        }
    },
    deleteAllInboxNotifications: async (req, res) => {
        let token = req.cookies.token;
        if (token == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            const user = await findUserById(token);
            if (user == null) {
                res.status(400).json({ error: "Invalid request." });
            }
            else {
                try {
                    await user.updateOne({ notifications: [] });
                }
                catch (err) {
                    res.status(500).json({ error: err });
                }
            }
        }
    },
    resolveReport: async (req, res) => {
        let report_id = req.params.report_id;
        if (report_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            try {
                await Notification.deleteOne({ _id: report_id });
                res.status(200).json({ message: "Report resolved." });
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    },
    updateInboxNotificationStatus: async (req, res) => {
        let notification_id = req.params.notification_id;
        let token = req.cookies.token;
        if (token == null || notification_id == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            try {
                const user = await findUserById(token);
                if (user == null) {
                    res.status(400).json({ error: "Invalid request." });
                }
                else {
                    await user.updateOne({ notifications: { $elemMatch: { notification: notification_id } } }, { $set: { "notifications.$.isRead": true } });
                    res.status(200).json({ message: "Notification updated." });
                }   
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
    },
    updateAllInboxNotificationStatus: async (req, res) => {
        let token = req.cookies.token;
        if (token == null) {
            res.status(400).json({ error: "Invalid request." });
        }
        else {
            const user = await findUserById(token);
            if (user == null) {
                res.status(400).json({ error: "Invalid request." });
            }
            else {
                try {
                    await user.updateMany({ notifications: { $elemMatch: { isRead: false } } }, { $set: { "notifications.$.isRead": true } });
                    res.status(200).json({ message: "Notifications updated." });
                }
                catch (err) {
                    res.status(500).json({ error: err });
                }
            }
        }
    }
}