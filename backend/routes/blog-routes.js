const express = require('express')
const { getAllBlogs, addNewBlog, updateBlog, getBlogById, deleteBlog, getbyUserId } = require('../controllers/blog-controller')
const blogRouter = express.Router()

blogRouter.get('/', getAllBlogs)
blogRouter.post('/add', addNewBlog)
blogRouter.put('/update/:id', updateBlog)
blogRouter.get('/:id', getBlogById)
blogRouter.delete('/delete/:id', deleteBlog)
blogRouter.get('/user/:id', getbyUserId)


module.exports = blogRouter