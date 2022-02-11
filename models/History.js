const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
    tokenId: {
        type: Number,
        require: true
    },
    event: {
        type: String,
        require: true
    },
    price: {
        type: String,
        default: ''
    },
    currency: {
        type: Number,
        default: 1
    },
    from: {
        type: String,
        default: ''
    },
    to: {
        type: String,
        default: ''
    },
    network: {
        type: String,
        default: 'ether'
    },
    status: {
        type: Number,
        default: 0          //0 => initial, 1 => success, 2 => cancel
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = History = mongoose.model('histories', historySchema)