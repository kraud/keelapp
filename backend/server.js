const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/words', require('./routes/wordRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/notifications', require('./routes/notificationRoutes'))
app.use('/api/friendships', require('./routes/friendshipRoutes'))
app.use('/api/tags', require('./routes/tagRoutes'))

app.use(errorHandler)


app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})