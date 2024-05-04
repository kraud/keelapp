const express = require('express')
const router = express.Router()
const { createFriendship, updateFriendship, deleteFriendship, getUserFriendshipsByParticipantId,
    deleteFriendshipRequest
} = require('../controllers/friendshipController')
const {protect} = require('../middleware/authMiddleware')

router.get('/getFriendships', protect, getUserFriendshipsByParticipantId)
router.post('/', protect, createFriendship)
// NB! delete-routes order matters. Should remain like this, to avoid going prematurely to 'deleteFriendship'
router.delete('/deleteRequestAndNotifications/:id', protect, deleteFriendshipRequest)
router.delete('/:id', protect, deleteFriendship)
router.put('/:id', protect, updateFriendship)


module.exports = router