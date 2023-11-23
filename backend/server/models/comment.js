const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    body: { type: String, required: true, maxLength: 4096, minLength: 1},
    upvoted: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    downvoted: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    author: { type: Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true});

module.exports = mongoose.model('Comment', CommentSchema);