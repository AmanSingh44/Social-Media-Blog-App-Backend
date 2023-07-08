const express = require('express')
const mongoose = require('mongoose')
const router = require('./routes/user-routes')
const blogRouter = require('./routes/blog-routes')
const app = express()

app.use(express.json())
app.use('/api/user', router)
app.use('/api/blog', blogRouter)

mongoose.connect('mongodb+srv://user:user@cluster0.cvwehnh.mongodb.net/?retryWrites=true&w=majority').
then(() => {
    console.log('db connected')
}).catch((err) => {
    console.log('db connection failed: ', err)
})



app.listen(5000, () => {
    console.log("Server started successfully on port 5000")
})