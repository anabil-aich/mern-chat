const route = require('express').Router()

const userController = require('../Controller/userController')

route.post('/register', userController.Register)
route.post('/login', userController.Login)

module.exports = route