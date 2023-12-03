const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
    title: { type: String, required: true, maxLength: 128, minLength: 1},
    body: { type: String, required: true, maxLength: 4096, minLength: 1},
    upvoted: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User'}],
        default: [],
    },
    downvoted: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User'}],
        default: [],
    },
    comments: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
        default: [],
    },
    author: { type: Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true});

module.exports = mongoose.model('Thread', ThreadSchema);