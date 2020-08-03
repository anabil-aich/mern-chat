require('dotenv').config()

const mongoose = require('mongoose')
const { compareSync } = require('bcrypt')
const User = mongoose.model(process.env.USERMODEL)

const formatError = (e) => {
    const error = {}
    let formattedError = e.substring(e.indexOf(':') + 1).trim().split(',')

    formattedError = formattedError.map(value => value.trim())

    formattedError.forEach(err => {
        const [key, value] = err.split(': ')
        error[key] = value
    })

    return error
}

exports.Register = async (req, res) => {
    try {
        const user = new User(req.body)
        const userExists = await User.CheckUserExists(req.body.email)

        if (userExists) throw new Error('Email Validation failed: email: Email id is already taken. Please use a different one')
        await user.save()

        res.status(200).send({
            Success: `User Registered`,
            user
        })
    }
    catch (e) {
        const errors = formatError(e.message)
        res.status(500).send(errors)
    }

}

exports.Login = async (req, res) => {
    try {
        let error = 'User Input Validation: '
        if (!req.body.email) {
            error += 'email: Please enter an email'
        }

        if (!req.body.password) {
            error += ', password: Please enter a password'
        }
        if (error != 'User Input Validation: ') {
            throw new Error(error)
        }
        const user = await User.getbyCredential(req.body.email, req.body.password)
        if (user === false) {
            throw new Error('User Validation failed: error: Invalid Credential')
        }
        const token = await user.generateToken();

        res.status(200).send({
            token
        })
    }
    catch (e) {
        const errors = formatError(e.message)
        res.status(401).send(errors)
    }

}