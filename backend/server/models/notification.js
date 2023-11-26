const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    title: { type: String, required: true, maxLength: 128, minLength: 1},
    body: { type: String, required: true,  maxLength: 512, minLength: 1},
}, {timestamps: true});

module.exports = mongoose.model('Notification', NotificationSchema);