const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    tokenId: {
        type: Number,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    buyer: {
        type: String,
        required: true
    },
    network: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: Number,
        default: 1
    },
    status: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = Offer = mongoose.model('offers', offerSchema)