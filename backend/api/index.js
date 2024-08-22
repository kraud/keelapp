const express = require('express')
const cors = require('cors')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('../middleware/errorMiddleware')
const connectDB = require('../config/db')
const port = process.env.PORT || 5000

connectDB()
let clients = [];

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

const sendNotification = (userId, data) => {
    console.log('userId', userId)
    console.log('data', data)
    const client = clients.find((potentialClient) => {
        return(potentialClient.userId === userId)
    })
    // if no client found => that user is not online now, so no need to notify them
    if (client !== undefined) {
        // console.log('client.res', client.res)
        console.log('Sending notification from BE')
        // client.res.write(`data: ${JSON.stringify(data)}\n\n`)
        client.res.write(`event: newNotification\n`)
        client.res.write(`retry: 5000\ndata: ${JSON.stringify(data)}\n\n`)
        // client.res.write(`MESSAGE\n\n`)
    }
}
// Named export for other modules
module.exports.sendNotification = sendNotification;

app.get('/', (req, res) => res.status(200).json({ message: 'Hello world!' }))
app.use('/api/words', require('../routes/wordRoutes'))
app.use('/api/users', require('../routes/userRoutes'))
app.use('/api/notifications', require('../routes/notificationRoutes'))
app.use('/api/friendships', require('../routes/friendshipRoutes'))
app.use('/api/tags', require('../routes/tagRoutes'))
app.use('/api/autocompleteTranslations', require('../routes/autocompleteTranslationRoutes'))

app.use(errorHandler)
app.get("/SSE/:userId", (req, res) => {
    const userId = req.params.userId
    res.setHeader("Cache-Control", "no-store")
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Connection", "keep-alive")
    //For this example, lets allow access to all the origins, since we're not sending any credentials
    // res.setHeader("Access-Control-Allow-Origin", "*") //  should work if '{withCredentials: false}' is set on sourceEvent (client)
    res.setHeader("Access-Control-Allow-Origin", process.env.BASE_URL)
    // By default, browsers compress the contents with `gzip` and we either have to gzip our content
    // ourselves or not do any encoding at all. I chose the latter, our payload is light anyway.
    res.setHeader("Content-Encoding", "none")
    res.flushHeaders()
    if(
        (clients.find((potentialClient) => {
            return(potentialClient.userId === userId)
        })) === undefined
    ) {
        clients = [...clients, {userId: userId, res: res}]
        res.write(`event: connection!\n\n`)
    } else {
        clients = [
            ...(clients.filter((existingClients) => {
                return(existingClients.userId !== userId)
            })),
            {userId: userId, res: res}
        ]
        res.write(`event: re-connection!\n\n`)
    }
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

// Default export for Vercel
module.exports = app;

// exports.app = app
// exports.sendNotification = sendNotification
// module.exports = {
//     app,
//     sendNotification
// }