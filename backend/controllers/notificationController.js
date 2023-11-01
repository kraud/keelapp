const asyncHandler = require('express-async-handler')

const Notification = require('../models/notificationModel')

// @desc    Get Notifications
// @route   GET /api/getNotifications
// @access  Private
const getNotificationsByUserId = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user.id})
    res.status(200).json(notifications)
})

// @desc    Set Word
// @route   POST /api/words
// @access  Private
const createNotification = asyncHandler(async (req, res) => {
    if(!req.body.user){
        res.status(400)
        throw new Error("Please specify a user to be notified.")
    }
    if(!req.body.variant){
        res.status(400)
        throw new Error("Please specify the type (variant) of notification.")
    }
    const word = await Notification.create({
        user: req.body.user,
        variant: req.body.variant,
        dismissed: false, // all notifications are not dismissed by default
        content: req.body.content, // Might be empty?
    })
    res.status(200).json(word)
})

module.exports = {
    getNotificationsByUserId,
    createNotification
}