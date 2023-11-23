const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true, maxLength: 20, minLength: 8},
    passwordHash: { type: String, required: true, maxLength: 32, minLength: 8},
    email: { type: String },
    avatarUrl: { type: String },
    description: { type: String, maxLength: 512, minLength: 32},
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    moderatorOf: [{ type: Schema.Types.ObjectId, ref: 'Box'}],
    bannedFrom: [{ type: Schema.Types.ObjectId, ref: 'Box'}],
    threads: [{ type: Schema.Types.ObjectId, ref: 'Thread'}],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);