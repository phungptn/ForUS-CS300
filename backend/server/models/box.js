const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoxSchema = new Schema({
    name: { type: String, required: true, unique: true, maxLength: 128, minLength: 1},
    description: { type: String, maxLength: 512, minLength: 32},
    moderators: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    bannedUsers: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    threads: [{ type: Schema.Types.ObjectId, ref: 'Thread'}],
}, {timestamps: true});

module.exports = mongoose.model('Box', BoxSchema, 'boxes');