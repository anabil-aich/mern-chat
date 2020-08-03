const route = require('express').Router()
const auth = require('../Middileware/auth')

const chatRoomController = require('../Controller/chatRoomController')

route.post('/', auth, chatRoomController.createRoom)
route.get('/', auth, chatRoomController.getAllRooms)

module.exports = route