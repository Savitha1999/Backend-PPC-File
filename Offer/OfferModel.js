

const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    ppcId: {
        type: Number,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the model from the schema
const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
