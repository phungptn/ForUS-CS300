const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
    title: { type: String, required: true, maxLength: 128, minLength: 1},
    body: { type: String, required: true, maxLength: 4096, minLength: 1},
    upvoted: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    downvoted: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
    author: { type: Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true});

module.exports = mongoose.model('Thread', ThreadSchema);