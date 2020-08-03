const mongoose = require('mongoose')
require('dotenv').config()
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jwt-then')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: 'Please enter a name'
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Please enter a valid email')
            }
        }
    },
    password: {
        type: String,
        required: 'Password is required',
        minlength: [6, 'Please enter more than six characters']
    },
    tokens: [
        {
            token: {
                type: String
            }
        }
    ]
}, {
    timeStamp: true
})

userSchema.statics.CheckUserExists = async function (email) {
    const user = await this.model(process.env.USERMODEL).findOne({
        email
    })

    if (user) {
        return true
    }

    return false
}

userSchema.methods.generateToken = async function () {
    const user = this

    const token = await jwt.sign({
        id: user.id,
        email: user.email
    },
        process.env.SECRET,
        {
            expiresIn: '1 day'
        })

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token

}

userSchema.statics.getbyCredential = async function (email, password) {

    const user = await this.model(process.env.USERMODEL).findOne({
        email
    })

    if (!user) {
        return false
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return false
    }

    return user
}


userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }

    next()
})

const userModel = mongoose.model(process.env.USERMODEL, userSchema)

module.exports = userModel