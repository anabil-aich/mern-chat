require('dotenv').config()
const mongoose = require('mongoose')
const ChatRoom = mongoose.model(process.env.CHATROOMMODEL)


exports.createRoom = async (req, res) => {
    try {
        const chatRoomExists = await ChatRoom.findOne({ name: req.body.name })
        if (chatRoomExists) {
            throw new Error('Chat Room exists')
        }
        const chatRoom = new ChatRoom({
            name: req.body.name
        })


        await chatRoom.save()

        res.status(200).send({
            id: chatRoom.id,
            message: `${chatRoom.name} created`
        })
    }
    catch (e) {
        res.status(500).send(e.message)
    }

}


exports.getAllRooms = async (req, res) => {
    try {
        const chatRooms = await ChatRoom.find({})
        res.status(200).send(chatRooms)
    }
    catch{
        res.status(500).send({
            error: `Something went wrong while creating chatroom`
        })
    }
}