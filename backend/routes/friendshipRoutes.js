const express = require('express')
const router = express.Router()
const { createFriendship, updateFriendship, deleteFriendship, getFriendshipsByUserId} = require('../controllers/friendshipController')
const {protect} = require('../middleware/authMiddleware')

router.get('/getFriendships', protect, getFriendshipsByUserId)
router.post('/', protect, createFriendship)
router.delete('/:id', protect, deleteFriendship)
router.put('/:id', protect, updateFriendship)


module.exports = router