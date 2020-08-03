const jwt = require('jwt-then')
require('dotenv').config()
const mongoose = require('mongoose')
const User = mongoose.model(process.env.USERMODEL)

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = await jwt.verify(token, process.env.SECRET)
        const user = await User.findOne({
            _id: decode.id,
            email: decode.email,
            'tokens.token': token
        })

        if (!user) {
            throw new Error(' error: " Access Denied"')
        }

        next()
    }
    catch (e) {
        res.status(401).send(e.message)
    }
}

module.exports = auth