const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true, maxLength: 20, minLength: 8},
    passwordHash: { type: String, required: true, maxLength: 64, minLength: 8},
    fullname: { type: String, required: true, maxLength: 100, minLength: 1},
    email: { type: String },
    avatarUrl: { type: String },
    description: { type: String, maxLength: 512, minLength: 32},
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    threads: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Thread'}],
        default: [],
    },
    comments: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
        default: [],
    },
    notifications: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Notification'}],
        default: [],
    },
    lastAccessed: { type: Number, default: null},
    sessionStart: { type: Number, default: null},
    passwordResetExpires: { type: Number, default: null},
    passwordResetToken: { type: String, default: null},
}, {timestamps: true});

UserSchema.statics.isAdmin = function (user_id) {
    return new Promise((resolve, reject) => {
        this.findById(user_id, (err, user) => {
            if (err) {
                reject(err);
            } else {
                resolve(user.role === 'admin');
            }
        });
    });
};

UserSchema.methods.changePassword = function (){
    passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes from now to reset password
}


module.exports = mongoose.model('User', UserSchema);