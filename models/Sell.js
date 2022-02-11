const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const sellSchema = new Schema({
    owner: {
        type: String,
        require: true
    },
    tokenId: {
        type: Number,
        require: true
    },
    network: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    sellType: {
        type: Number,
        default: 0      //0 => sell, 1=> auction
    },
    status: {
        type: Number,
        default: 0      //0 => listed, 1 => selled, 2 => cancelled
    },
    regDate: {
        type: Date,
        default: Date.now()
    },
    sellDate: {
        type: Date,
        default: Date.now()
    }
})

module.exports = Sell = mongoose.model('sells', sellSchema)