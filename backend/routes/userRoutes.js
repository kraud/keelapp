const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMe, getUsersBy, updateUser} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.put('/updateUser', protect, updateUser)
router.get('/me', protect, getMe)
router.get('/searchUser', protect, getUsersBy)

module.exports = router