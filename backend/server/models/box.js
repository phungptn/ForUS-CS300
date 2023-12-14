const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Thread = require('./thread');

const BoxSchema = new Schema({
    name: { type: String, required: true, unique: true, maxLength: 128, minLength: 1},
    description: { type: String, maxLength: 512, minLength: 32},
    moderators: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User'}],
        default: [],
    },
    bannedUsers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User'}],
        default: [],
    },
    threads: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Thread'}],
        default: [],
    },
}, {timestamps: true});

const deleteChildThreads = async function(next) {
    try {
        await Thread.deleteMany({ _id: { $in: this.threads } });
        next();
    }
    catch (err) {
        next(err);
    }
};

BoxSchema.pre('deleteMany', deleteChildThreads);
BoxSchema.pre('deleteOne', deleteChildThreads);

module.exports = mongoose.model('Box', BoxSchema, 'boxes');