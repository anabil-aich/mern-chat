require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.once('open', () => {
    console.log(`Database connected successfully`)
})

mongoose.connection.on('error', (err) => {
    console.log(`Error while connecting to DB`)
})

module.exports = mongoose
