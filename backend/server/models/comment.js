const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    body: { type: String, required: true, maxLength: 4096, minLength: 1},
    upvoted: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User'}],
        default: [],
    },
    downvoted: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User'}],
        default: [],
    },
    author: { type: Schema.Types.ObjectId, ref: 'User'},
    replyTo: { type: Schema.Types.ObjectId, ref: 'Comment'},
    box: { type: Schema.Types.ObjectId, ref: 'Box'},
    thread: { type: Schema.Types.ObjectId, ref: 'Thread'},
}, {timestamps: true});

module.exports = mongoose.model('Comment', CommentSchema);