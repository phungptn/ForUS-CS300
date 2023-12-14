const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment');

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
    box: { type: Schema.Types.ObjectId, ref: 'Box'},
}, {timestamps: true});

const deleteChildComments = async function(next) {
    try {
        await Comment.deleteMany({ _id: { $in: this.comments } });
        next();
    }
    catch (err) {
        next(err);
    }
};

ThreadSchema.pre('deleteMany', deleteChildComments);
ThreadSchema.pre('deleteOne', deleteChildComments);

module.exports = mongoose.model('Thread', ThreadSchema);