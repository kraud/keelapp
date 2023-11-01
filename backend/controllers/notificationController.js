const asyncHandler = require('express-async-handler')

const Notification = require('../models/notificationModel')

// @desc    Get Notifications
// @route   GET /api/getNotifications
// @access  Private
const getNotificationsByUserId = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user.id})
    res.status(200).json(notifications)
})

// @desc    Set Notification
// @route   POST /api/
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
    const notification = await Notification.create({
        user: req.body.user,
        variant: req.body.variant,
        dismissed: false, // all notifications are not dismissed by default
        content: req.body.content, // Might be empty?
    })
    res.status(200).json(notification)
})

// @desc    Delete Notification
// @route   DELETE /api/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id)

    if(!notification){
        res.status(400)
        throw new Error("Notification not found")
    }

    // Check for user
    if(!req.user){
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged-in user matches the word user
    if(notification.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

    await notification.deleteOne()
    res.status(200).json(notification)
})


module.exports = {
    getNotificationsByUserId,
    createNotification,
    deleteNotification
}