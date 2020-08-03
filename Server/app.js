const express = require('express')
const { urlencoded } = require('express')
const { compareSync } = require('bcrypt')
const cors = require('cors')
const socketIO = require("socket.io")
const http = require('http')
const jwt = require('jwt-then')
require('dotenv').config()
require('./DB/connection')
const User = require('./Model/userModel')
const ChatRoom = require('./Model/chatRoomModel')
const Message = require('./Model/messageModel')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
app.use(express.json())
app.use(cors())
app.use(urlencoded({ extended: true }))

app.use('/', require('./Routes/default'))
app.use('/user', require('./Routes/userRoute'))
app.use('/chatroom', require('./Routes/chatRoom'))

const port = process.env.PORT || 5000


io.use(async (socket, next) => {
    const token = socket.handshake.query.token
    const payload = await jwt.verify(token, process.env.SECRET)
    socket.userId = payload.id
    next()
})

io.on('connection', (socket) => {
    console.log(`Connected ${socket.userId}`)
    let user = ''
    let userchatRoomId = ''

    socket.on('joinChatRoom', async ({ chatRoomId }) => {
        user = await User.findOne({ _id: socket.userId })
        userchatRoomId = chatRoomId
        socket.join(chatRoomId)
        console.log(`User name ${user.name} joined ${chatRoomId}`)
        socket.broadcast.to(chatRoomId).emit("newMessage", {
            message: `${user.name} has joined`,
            name: `Admin`,
            userId: `admin`
        })
        socket.emit("newMessage", {
            message: `Welcome ${user.name}`,
            name: `Admin`,
            userId: `admin`
        })
    })

    socket.on('leaveChatRoom', ({ chatRoomId }) => {
        socket.leave(chatRoomId)
        socket.broadcast.to(chatRoomId).emit("newMessage", {
            message: `${user.name} left!`,
            name: `Admin`,
            userId: `admin`
        })
    })

    socket.on('chatRoomMessage', async ({ chatRoomId, message }) => {

        const messagedet = new Message({
            chatroom: chatRoomId,
            message,
            user: user
        })
        io.to(chatRoomId).emit("newMessage", {
            message,
            name: user.name,
            userId: socket.userId
        })

        await messagedet.save()
    })

    socket.on(`disconnect`, () => {
        io.to(userchatRoomId).emit("newMessage", {
            message: `${user.name} left!`,
            name: `Admin`,
            userId: `admin`
        })
    })
})

server.listen(port, () => {
    console.log(`App is running on port ${port}`)
})

