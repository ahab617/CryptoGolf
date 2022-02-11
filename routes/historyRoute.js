const express = require('express');
const History = require('../models/History');
const ListToken = require('../models/ListToken')
const Offer = require('../models/Offer')
const router = express.Router();

router.post('/', async (req, res) => {
    const newHistory = new History({
        tokenId: req.body.tokenId,
        event: req.body.event,
        price: req.body.price,
        from: req.body.from,
        to: req.body.to,
        network: req.body.network,
        currency: req.body.currency,
        date: new Date()
    })
    await newHistory.save()

    const hist = await History.find({
        tokenId: req.body.tokenId,
        network: req.body.network
    }).sort({ date: -1 });

    return res.json(hist)
})

router.post('/mint', async (req, res) => {
    let newHistory;
    for (let i = 0; i < req.body.mintCount; i++) {
        newHistory = new History({
            tokenId: parseInt(req.body.totalSupply) + i + 1,
            event: req.body.event,
            price: req.body.price,
            from: req.body.from,
            to: req.body.to,
            network: req.body.network,
            currency: req.body.currency
        })
        await newHistory.save()
    }
    return res.json({ success: true })
})

router.get('/:tokenId/:network', async (req, res) => {
    const hist = await History.find({
        tokenId: req.params.tokenId,
        network: req.params.network
    }).sort({ date: -1 });

    const lists = await ListToken.find({
        tokenId: req.params.tokenId,
        network: req.params.network
    }).sort({ date: -1 })

    return res.json({
        allHistory: hist,
        list: lists
    })
})

router.post('/getListed', async (req, res) => {
    const lists = await History.find({
        event: { $regex: 'List', $options: 'i' },
        tokenId: req.body.id,
        network: req.body.network
    })
    return res.json(lists)
})

router.post('/canceloffers', async (req, res) => {
    try {
        const { tokenId, from, network, offers, buyer } = req.body
        let data;
        let offer;
        for (let i = 0; i < offers.length; i++) {
            if (String(offers[i].buyer).toLowerCase() !== String(buyer).toLowerCase()) {
                data = new History({
                    tokenId: tokenId,
                    event: 'Offer Cancelled',
                    price: offers[i].price,
                    from: from,
                    to: offers[i].buyer,
                    network: network,
                    currency: offers[i].currency
                })
                await data.save()

            }
        }
        const hist = await History.find({
            tokenId: req.body.tokenId,
            network: req.body.network
        }).sort({ date: -1 });
        return res.json(hist)
    } catch (err) {
        return res.status(500).json({ message: "Server error occurs" })
    }

})

router.post('/activity', async (req, res) => {
    const activities = await History.find({
        $or: [
            { from: req.body.address },
            { to: req.body.address }
        ]
    }).sort({ date: -1 })

    return res.json(activities)
})

router.post('/listings', async (req, res) => {
    const listings = await ListToken.find({ owner: req.body.address })
    return res.json(listings)
})

module.exports = router;