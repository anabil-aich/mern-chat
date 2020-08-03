const route = require('express').Router()

route.get("/", (req, res) => {
    res.status(200).send({
        response: "Server is up and running"
    })
})

module.exports = route