const express = require('express')
const ListToken = require('../models/ListToken')
const History = require('../models/History')
const router = express.Router()

router.get('/:network/:tokenId', async (req, res) => {
    const listHistory = await ListToken.find({
        tokenId: req.params.tokenId,
        network: req.params.network
    }).sort({ date: -1 })
    return res.json(listHistory)
})

router.post('/', async (req, res) => {
    try {
        const data = new ListToken({
            tokenId: req.body.tokenId,
            owner: req.body.owner,
            price: req.body.price,
            currency: req.body.currency,
            network: req.body.network,
            status: req.body.status,
        })
        await data.save()

        const listHistory = await ListToken.find({
            tokenId: req.body.tokenId,
            network: req.body.network,
        }).sort({ date: -1 })

        const histories = await History.find({
            tokenId: req.body.tokenId,
            network: req.body.network
        }).sort({ date: -1 })
        return res.json({
            listHistory: listHistory,
            histories: histories
        })
    } catch (err) {
        return res.status(500).json({ success: false })
    }
})

router.post('/update', async (req, res) => {
    try {
        const listedToken = await ListToken.findOne({
            tokenId: req.body.tokenId,
            owner: req.body.owner,
            network: req.body.network,
            status: 0
        })
        if (listedToken) {
            listedToken.status = req.body.status
            listedToken.date = Date.now()
            await listedToken.save()
        }

        const listHistory = await ListToken.find({
            tokenId: req.body.tokenId,
            network: req.body.network,
        }).sort({ date: -1 })

        const histories = await History.find({
            tokenId: req.body.tokenId,
            network: req.body.network
        }).sort({ date: -1 })
        return res.json({
            listHistory: listHistory,
            histories: histories
        })
    } catch (err) {
        return res.status(500).json({ success: false })
    }
})

module.exports = router;