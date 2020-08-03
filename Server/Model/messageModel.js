const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    message: {
        type: String,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'Users'
    },
    chatroom: {
        type: mongoose.Types.ObjectId,
        ref: 'ChatRoom'
    }
})

const messageModel = mongoose.model('Messages', messageSchema)
module.exports = messageModel