const express = require('express')
const History = require('../models/History')
const Offer = require('../models/Offer')
const router = express.Router()

router.get('/:network/:tokenId', async (req, res) => {
    const offers = await Offer.find({
        tokenId: req.params.tokenId,
        network: req.params.network
    })
    return res.json(offers)
})

router.post('/', async (req, res) => {
    const offer = new Offer({
        tokenId: req.body.tokenId,
        owner: req.body.owner,
        buyer: req.body.buyer,
        network: req.body.network,
        price: req.body.price,
        currency: req.body.currency,
        status: req.body.status
    })
    await offer.save()
    return res.json({ success: true })
    // const offers = await Offer.find({
    //     tokenId: req.body.tokenId,
    //     network: req.body.network
    // })
    // return res.json(offers)
})

router.post('/cancel', async (req, res) => {
    try {
        const offers = await Offer.find({
            tokenId: req.body.tokenId,
            owner: req.body.owner,
            network: req.body.network,
            status: 0
        })
        if (offers.length > 0) {
            for (let i = 0; i < offers.length; i++) {
                offers[i].status = 2;
                await offers[i].save()
            }
        }
        return res.json({ success: true })
    } catch (err) {
        return res.status(500).json({ success: false })
    }
})

router.post('/cancel_when_approve', async (req, res) => {
    try {
        let history;
        const { tokenId, owner, buyer, network } = req.body;
        const offers = await Offer.find({
            tokenId: tokenId,
            owner: owner,
            network: network,
            status: 0
        })
        if (offers) {
            for (let i = 0; i < offers.length; i++) {
                if (String(offers[i].buyer).toLowerCase() === String(buyer).toLowerCase()) {
                    offers[i].status = 1
                    await offers[i].save()
                } else {
                    history = new History({
                        tokenId: tokenId,
                        event: 'Offer Cancelled',
                        price: offers[i].price,
                        from: owner,
                        to: offers[i].buyer,
                        network: network,
                        currency: offers[i].currency
                    })
                    await history.save()

                    offers[i].status = 2
                    await offers[i].save()
                }
            }
        }
    } catch (err) {

    }
})

router.post('/made_offers', async (req, res) => {
    const offers = await Offer.find({
        buyer: req.body.address
    }).sort({ date: -1 })
    return res.json(offers)
})

router.post('/received_offers', async (req, res) => {

    const offers = await Offer.find({
        owner: req.body.address
    }).sort({ date: -1 })

    return res.json(offers)
})

router.post('/update_status', async (req, res) => {
    const offer = await Offer.findOne({
        tokenId: req.body.tokenId,
        network: req.body.network,
        owner: req.body.owner,
        buyer: req.body.buyer,
        status: 0
    })
    if (offer) {
        offer.status = req.body.status
        await offer.save()
    }
    const offers = await Offer.find({
        buyer: req.body.buyer
    }).sort({ date: -1 })
    return res.json(offers)
})

module.exports = router