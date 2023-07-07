const express = require("express")

const router = express.Router()

router.post('/pay', (req, res) => {
    console.log(req.body)
    res.status(200).json({
        message: "Login successful"
    })
})

router.get('/receipt', (req, res) => {
    console.log(req.body)
    res.status(200).json({
        message: "This is your receipt"
    })
})

module.exports = router