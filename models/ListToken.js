const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const listTokenSchema = new Schema({
    tokenId: {
        type: Number,
        require: true
    },
    owner: {
        type: String,
    },
    price: {
        type: Number
    },
    currency: {
        type: Number
    },
    status: {
        type: Number,
        default: 0
    },
    network: {
        type: String,
        default: 'ether'
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = ListToken = mongoose.model("lists", listTokenSchema);