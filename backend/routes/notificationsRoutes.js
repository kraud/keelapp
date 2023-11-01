const express = require('express')
const router = express.Router()
const { createNotification, updateNotification, deleteNotification, getNotificationsByUserId} = require('../controllers/notificationController')
const {protect} = require('../middleware/authMiddleware')

router.get('/getNotifications', protect, getNotificationsByUserId)
router.post('/', createNotification)
router.put('/:id', protect, updateNotification)
router.delete('/:id', protect, deleteNotification)

module.exports = router