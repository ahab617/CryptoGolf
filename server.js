const express = require('express')
require('dotenv').config()
const cors = require("cors")
const path = require('path')
const fileupload = require('express-fileupload')
const connectDB = require('./config/db')

const userRoute = require('./routes/userRoute')
const historyRoute = require('./routes/historyRoute')
const listRoute = require('./routes/listRoute')
const offerRoute = require('./routes/offerRoute')

const app = express()

app.use(cors())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(fileupload())

connectDB()

// const pinataSDK = require('@pinata/sdk');
// const { default: axios } = require('axios');
// const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);

// app.post('/api/mint', async (req, res) => {
//     const result = await axios.get("ipfs://QmWkRXXjfcpjfrcGB9V83Mg8Gcyh8mEitZWo7UuduzvMaA")
//     console.log(result)

//     res.json(req.body)
// })

app.use('/api/users', userRoute)
app.use('/api/history', historyRoute)
app.use('/api/lists', listRoute)
app.use('/api/offers', offerRoute)

app.get('/upload/:filename', async (req, res) => {
    var filename = req.params.filename;
    res.sendFile(path.join(__dirname, `./upload/${filename}`));
})

app.use(express.static("upload"));
if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
    console.log("running on production environment")
}

const PORT = 5000;

app.listen(PORT, console.log(`App is running on port ${PORT}`))