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
app.use('/api/autocompleteTranslations', require('../routes/autocompleteTranslationRoutes'))

app.use(errorHandler)


const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        // origin: 'http://localhost:3000'
        origin: process.env.BASE_URL
    },
})

io.on('connection', (socket) => {
    // console.log('Connected to socket.io')

    socket.on('setup', (userId) => {
        socket.join(userId)
        // console.log('Connected on FE', userId)
    })

    socket.on('new notification', (newNotificationReceived) => {
        if(
            newNotificationReceived.every((notificationToBeSent) => {
                return(notificationToBeSent.user !== undefined)
            }))
        {
            newNotificationReceived.forEach((notificationToBeSent) => {
                socket.in(notificationToBeSent.user).emit('notification received', notificationToBeSent)
            })
        } else {
            console.log('Missing user in at least 1 notification.')
        }
    })
})