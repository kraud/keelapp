const colors = require('colors')
const dotenv = require('dotenv').config()
const connectDB = require('../config/db')
const app = require('../app')
const port = process.env.PORT || 5001

connectDB()

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
