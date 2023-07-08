const blog = require('../model/blog')
const Blog = require('../model/blog')
const User = require('../model/user')
const mongoose = require('mongoose')

const getAllBlogs = async(req, res, next) => {
    let blogs
    try {
        blogs = await Blog.find()

    } catch (err) {
        return console.log("Error while getting blogs", err)
    }
    if (!blogs) {
        return res.status(404).json({ message: "No blogs found" })
    }
    return res.status(200).json({ blogs })
}

const addNewBlog = async(req, res, next) => {
    const { title, description, image, user } = req.body
    let oldUser
    try {
        oldUser = await User.findById(user)
    } catch (err) {
        return console.log(err)
    }
    if (!oldUser) {
        return res.status(400).json({ message: "unable to find user by this id" })
    }
    const blog = new Blog({
        title,
        description,
        image,
        user
    })
    try {
        const session = await mongoose.startSession()
        session.startTransaction()
        await blog.save({ session })
        oldUser.blogs.push(blog)
        await oldUser.save({ session })
        await session.commitTransaction()
    } catch (err) {
        return console.log({ message: err })
    }
    return res.status(200).json({ blog })
}

const updateBlog = async(req, res, next) => {
    const { title, description } = req.body
    const blogId = req.params.id
    let blog
    try {
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description
        })

    } catch (err) {
        return console.log('Error while updating blog', err)
    }
    if (!blog) {
        return res.status(500).json({ message: "Unable to update" })
    }
    return res.status(200).json({ blog })
}

const getBlogById = async(req, res, next) => {
    const blogId = req.params.id
    let blog
    try {
        blog = await Blog.findById(blogId)
    } catch (err) {
        return console.log('Error while getting user by id', err)
    }
    if (!blog) {
        return res.status(404).json({ message: "No blogs found" })
    }
    return res.status(200).json({ blog })
}

const deleteBlog = async(req, res, next) => {
    const blogId = req.params.id
    let blog
    try {
        blog = await Blog.findByIdAndRemove(blogId).populate('user')
        await blog.user.blogs.pull(blog)
        await blog.user.save()
    } catch (err) {
        return console.log('Error while getting user by id', err)
    }
    if (!blog) {
        return res.status(500).json({ message: "Unable to delete" })
    }
    return res.status(200).json({ message: "Deletion successful" })
}
const getbyUserId = async(req, res, next) => {
    const userId = req.params.id
    let userBlogs
    try {
        userBlogs = await User.findById(userId).populate("blogs")
    } catch (err) {
        return console.log(err)
    }
    if (!userBlogs) {
        return res.status(404).json({ message: "no blogs found" })
    }
    return res.status(200).json({ blogs: userBlogs })
}


module.exports = { getAllBlogs, addNewBlog, updateBlog, getBlogById, deleteBlog, getbyUserId }