const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    title: { type: String, required: true, maxLength: 128, minLength: 1},
    body: { type: String, required: true,  maxLength: 512, minLength: 1},
    thread: { type: Schema.Types.ObjectId, ref: 'Thread', default: null},
    comment: { type: Schema.Types.ObjectId, ref: 'Comment', default: null},
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null},
    reporter: { type: Schema.Types.ObjectId, ref: 'User', default: null},
    isReport: { type: Boolean, default: false},
    from: {
        type: String,
        enum: ['reply', 'thread', 'admin', 'report'],
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Notification', NotificationSchema);