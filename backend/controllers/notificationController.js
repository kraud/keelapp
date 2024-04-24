const asyncHandler = require('express-async-handler')

const Notification = require('../models/notificationModel')

// @desc    Get Notifications
// @route   GET /api/getNotifications
// @access  Private
const getNotificationsByUserId = asyncHandler(async (req, res) => {
    await Notification.find({ user: req.user.id})
        .then((data => {
            if(data){
                let dismissedNotifications = [];
                let unreadNotifications = [];
                (data).map((notification) => {
                    if(notification.dismissed){
                        dismissedNotifications.push(notification)
                    } else {
                        unreadNotifications.push(notification)
                    }
                })
                dismissedNotifications.sort((a,b) => Date.parse(b) - Date.parse(a))
                unreadNotifications.sort((a,b) => Date.parse(b) - Date.parse(a))
                // TODO: new notifications on top, dismissed notifications at the bottom of all new notifications
                const results = unreadNotifications.concat(dismissedNotifications)
                res.status(200).json(results)
            }
    }))
})

// @desc    Set Notification
// @route   POST /api/
// @access  Private
const createNotification = asyncHandler(async (req, res) => {
    // NB! when posting, a NotificationData-user property will always be an array (of at least 1).
    if(!req.body.user){
        res.status(400)
        throw new Error("Please specify a user to be notified.")
    }
    if(!req.body.variant){
        res.status(400)
        throw new Error("Please specify the type (variant) of notification.")
    }

    // TODO: if it's friendRequest => should check if request already exists? also should check on frontend

    // the notification is added once for each item in user array.
    const notifications = req.body.user.map(userId => {
        return({
            user: userId,
            variant: req.body.variant,
            dismissed: false, // all notifications are not dismissed by default
            content: req.body.content, // Might be empty?
        })
    })

    const notificationResponse = await Notification.insertMany(notifications)
    res.status(200).json(notificationResponse)
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

// @desc    Update Notification
// @route   PUT /api/:id
// @access  Private
const updateNotification = asyncHandler(async (req, res) => {
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

    // Make sure the logged-in user matches the goal user
    if(notification.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedNotification = await Notification.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json(updatedNotification)
})


module.exports = {
    getNotificationsByUserId,
    createNotification,
    deleteNotification,
    updateNotification
}