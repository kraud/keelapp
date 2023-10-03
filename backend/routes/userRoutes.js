const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMe, getUsersBy } = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.get('/searchUser', protect, getUsersBy)

module.exports = router