const express = require('express')
const path = require('path')
const fs = require('fs')
const User = require('../models/User')
const keys = require('../config/keys')
const router = express.Router()

// Connect Wallet
router.post('/', async (req, res) => {
    const users = await User.find({})
    if (users) {
        const user = await User.findOne({ address: req.body.address })
        if (!user) {
            const newUser = new User({
                address: req.body.address
            })
            await newUser.save()
            return res.json(newUser)
        }
        return res.json(user)
    } else {
        const newUser = new User({
            address: req.body.address
        })
        await newUser.save()
        return res.json(newUser)
    }
})

router.get('/:address', async (req, res) => {
    const user = await User.findOne({
        address: req.params.address
    })
    return res.json(user)
})

router.put('/', async (req, res) => {

    const uploadPath = path.join(__dirname, `../upload`);

    if (!fs.existsSync(uploadPath)) {
        fs.mkdir(uploadPath, (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Upload directory created successfully!');
        });
    }
    const user = await User.findOne({ address: req.body.address })

    let filename = user._id + "_";
    if (req.files !== null && req.files !== undefined) {
        const file = req.files.images;
        filename += file.name;
        await file.mv(`${uploadPath}/${filename}`);
    }

    if (req.body.name !== "") {
        user.name = req.body.name
    }
    user.email = ''; // req.body.email
    user.recvUpdates = req.body.recvUpdates ? 1 : 0
    user.recvPromotions = req.body.recvPromotions ? 1 : 0

    if (req.files !== null && req.files !== undefined) {
        user.avatar = filename
    }
    await user.save()

    return res.json(user)
})

module.exports = router;