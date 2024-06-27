const express = require('express')
const cors = require('cors')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('../middleware/errorMiddleware')
const connectDB = require('../config/db')
const port = process.env.PORT || 5000

connectDB()

const app = express()

const corsOptions = {
    // origin: 'https://keelapp-frontend-git-d-cc4519-proyecto-finals-projects-0e9f4d32.vercel.app', // we should have this follow a .env variable
    origin: '*', // this allows request from any URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => res.status(200).json({ message: 'Hello world!' }))
app.use('/api/words', require('../routes/wordRoutes'))
app.use('/api/users', require('../routes/userRoutes'))
app.use('/api/notifications', require('../routes/notificationRoutes'))
app.use('/api/friendships', require('../routes/friendshipRoutes'))
app.use('/api/tags', require('../routes/tagRoutes'))

app.use(errorHandler)


app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})