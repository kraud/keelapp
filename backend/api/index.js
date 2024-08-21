const express = require('express')
const cors = require('cors')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('../middleware/errorMiddleware')
const connectDB = require('../config/db')
const port = process.env.PORT || 5000
const SSE = require('express-sse')

connectDB()

const app = express()
const sse = new SSE()

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

let clients = [];
app.get("/SSE/:userId", (req, res) => {
    const userId = req.params.userId
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");
    //For this example, lets allow access to all the origins, since we;re not sending any credentials
    res.setHeader("Access-Control-Allow-Origin", "*");
    // By default, browsers compress the contents with `gzip` and we either have to gzip our content
    // ourselves or not do any encoding at all. I chose the latter, our payload is light anyway.
    res.setHeader("Content-Encoding", "none");
    res.flushHeaders();
    // console.log('clientsOG', clients)
    if(
        (clients.find((potentialClient) => {
            return(potentialClient.userId === userId)
        })) === undefined
    ) {
        clients = [...clients, {userId: userId, res: res}]
        res.write(`event: connection!\n\n`);
    } else {
        clients = [
            ...(clients.filter((existingClients) => {
                return(existingClients.userId !== userId)
            })),
            {userId: userId, res: res}
        ]
        res.write(`event: re-connection!\n\n`);
    }
    // console.log('clientsAFTER', clients)


    // Here we see the specific data format, that supports passing in the data and some connection options.
    // The message must end with \n\n, each property is separated by \n
    // const getData = () => `retry: 5000\ndata: Current date is ${Date.now()}\n\n`
    // let timer
    // res.write(getData())
    // timer = setInterval(() => res.write(getData()), 3000)

    // let counter = 0;
    // // res.write(`event: interval\n`);
    // res.write(`id: interval${counter} \n`);
    // res.write(`data: ${JSON.stringify({ num: counter })}\n\n`);
    //
    // res.on("close", () => {
    //
    //     res.end();
    // });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

const sendNotification = (userId, data) => {
    const client = clients.find((potentialClient) => {
        return(potentialClient.userId === userId)
    })
    // if no client found => that user is not online now, so no need to notify them
    if (client !== undefined) {
        // console.log('client.res', client.res)
        console.log('WRITE')
        // client.res.write(`data: ${JSON.stringify(data)}\n\n`);
        client.res.write(`event: newNotification\n`);
        client.res.write(`data: ${JSON.stringify(data)}\n\n`)
        // client.res.write(`MESSAGE\n\n`);
    }
};

// const server = app.listen(port, () => {
//     console.log(`Server started on port ${port}`)
// })
// const io = require('socket.io')(server, {
//     pingTimeout: 60000,
//     cors: {
//         // origin: 'http://localhost:3000'
//         origin: process.env.BASE_URL
//     },
// })
//
// io.on('connection', (socket) => {
//     // console.log('Connected to socket.io')
//
//     socket.on('setup', (userId) => {
//         socket.join(userId)
//         // console.log('Connected on FE', userId)
//     })
//
//     socket.on('new notification', (newNotificationReceived) => {
//         if(
//             newNotificationReceived.every((notificationToBeSent) => {
//                 return(notificationToBeSent.user !== undefined)
//             }))
//         {
//             newNotificationReceived.forEach((notificationToBeSent) => {
//                 socket.in(notificationToBeSent.user).emit('notification received', notificationToBeSent)
//             })
//         } else {
//             console.log('Missing user in at least 1 notification.')
//         }
//     })
// })
exports.sendNotification = sendNotification
// module.exports = {
//     sendNotification
// }