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

BoxSchema.post('findOneAndDelete', async (doc, next) => {
    if (doc != null) {
        try {
            const threads = doc.threads;
            for (var thread of threads) {
                await Thread.findOneAndDelete({ _id: thread });
            }
            next();
        }
        catch (err) {
            next(err);
        }
    }
});

module.exports = mongoose.model('Box', BoxSchema, 'boxes');