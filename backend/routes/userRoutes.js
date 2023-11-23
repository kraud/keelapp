const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMe, getUsersBy, updateUser, getUsernamesBy} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.put('/updateUser', protect, updateUser)
router.get('/me', protect, getMe)
router.get('/searchUser', protect, getUsersBy)
router.get('/getUsernames', protect, getUsernamesBy)

module.exports = router