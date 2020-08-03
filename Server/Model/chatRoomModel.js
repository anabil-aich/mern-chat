const mongoose = require('mongoose')

const chatRoomSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a chat room name']
    }
})

const chatRoomModel = mongoose.model(process.env.CHATROOMMODEL, chatRoomSchema)

module.exports = chatRoomSchema