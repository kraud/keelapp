const express = require('express')
const router = express.Router()
const { createNotification, updateNotification, deleteNotification, getNotificationsByUserId} = require('../controllers/notificationController')
const {protect} = require('../middleware/authMiddleware')

router.get('/getNotifications', protect, getNotificationsByUserId)
router.post('/', protect, createNotification)
router.delete('/:id', protect, deleteNotification)

// router.put('/:id', protect, updateNotification) // TODO: will we ever need to update a notification?

module.exports = router