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

GroupSchema.post('findOneAndDelete', async (doc, next) => {
    if (doc != null) {
        try {
            const boxes = doc.boxes;
            for (var box of boxes) {
                await Box.findOneAndDelete({ _id: box });
            }
            next();
        }
        catch (err) {
            next(err);
        }
    }
});

module.exports = mongoose.model('Group', GroupSchema);