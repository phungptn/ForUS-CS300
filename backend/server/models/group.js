const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    name: { type: String, required: true, unique: true, maxLength: 128, minLength: 1},
    boxes: [{ type: Schema.Types.ObjectId, ref: 'Box'}],
}, {timestamps: true});

module.exports = mongoose.model('Group', GroupSchema);