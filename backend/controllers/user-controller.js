const User = require('../model/user')
const bcrypt = require('bcrypt')

const getAllUser = async(req, res, next) => {
    let users
    try {
        users = await User.find()
    } catch (err) {
        console.log("Error while getting users ", err)
    }
    if (!users) {
        return res.status(404).json({ message: "No users found" })
    }
    return res.status(200).json({ users })
}

const signup = async(req, res, next) => {
    const { name, email, password } = req.body

    let oldUser
    try {
        oldUser = await User.findOne({ email })


    } catch (err) {
        console.log('error while adding user', err)
    }
    if (oldUser) {
        return res.status(400).json({ message: "User already exists! Login Instead" })
    }
    const hashedPassword = bcrypt.hashSync(password, 10)

    const user = new User({
        name,
        email,
        password: hashedPassword,
        blogs: []
    })
    try {
        await user.save()
    } catch (err) {
        console.log('Error while adding user', err)
    }
    return res.status(201).json({ user })
}

const login = async(req, res, next) => {
    const { email, password } = req.body
    let oldUser
    try {
        oldUser = await User.findOne({ email })


    } catch (err) {
        console.log('error while adding user', err)
    }
    if (!oldUser) {
        return res.status(404).json({ message: "User not found!" })
    }
    const isPasswordCorrect = bcrypt.compareSync(password, oldUser.password)
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect Password" })
    }
    return res.status(200).json({ message: "Login Successful" })
}

module.exports = { getAllUser, signup, login }