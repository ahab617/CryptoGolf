const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    avatar: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    recvUpdates: {
        type: Number,
        default: 0
    },
    recvPromotions: {
        type: Number,
        default: 0
    }
})

module.exports = User = mongoose.model("users", userSchema)