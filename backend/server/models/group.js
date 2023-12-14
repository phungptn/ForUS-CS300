const mongoose = require('mongoose');
const Box = require('./box');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    name: { type: String, required: true, unique: true, maxLength: 128, minLength: 1},
    boxes: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Box'}],
        default: [],
    },
}, {timestamps: true});

GroupSchema.pre('deleteOne', async function(next) {
    try {
        await Box.deleteMany({ _id: { $in: this.boxes } });
        next();
    }
    catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Group', GroupSchema);