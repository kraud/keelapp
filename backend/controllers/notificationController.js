const asyncHandler = require('express-async-handler')

const Notification = require('../models/notificationModel')
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Word = require("../models/wordModel");

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

    // const request = {
    //     query: {
    //         user: req.user.id
    //     }
    // }
    //
    // await getNotificationDataByRequest(request)
    //     .then((data => {
    //         if(data){
    //             let dismissedNotifications = [];
    //             let unreadNotifications = [];
    //             (data).map((notification) => {
    //                 if(notification.dismissed){
    //                     dismissedNotifications.push(notification)
    //                 } else {
    //                     unreadNotifications.push(notification)
    //                 }
    //             })
    //             dismissedNotifications.sort((a,b) => Date.parse(b) - Date.parse(a))
    //             unreadNotifications.sort((a,b) => Date.parse(b) - Date.parse(a))
    //             // TODO: new notifications on top, dismissed notifications at the bottom of all new notifications
    //             const results = unreadNotifications.concat(dismissedNotifications)
    //             res.status(200).json(results)
    //         }
    //     }))
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


const getNotificationDataByRequest = async (req) => {
    const getMatchQuery = (queryData) => {
        let matchQuery = []
        if(queryData.user !== undefined){
            matchQuery.push({
                "user": mongoose.Types.ObjectId(queryData.user)
            })
        }
        if(queryData.variant !== undefined){
            matchQuery.push({
                "variant": queryData.variant
            })
        }
        if(queryData.dismissed !== undefined){
            matchQuery.push({
                "dismissed": queryData.dismissed
            })
        }
        return(matchQuery)
    }

    // since 'getNotificationDataByRequest' is not wrapped with asyncHandler, we have to manage/catch errors manually.
    try {
        const allNotificationData = await Notification.aggregate([
            // filtering related to data present in word => apply here
            {
                $match: {
                    $and: getMatchQuery(req.query)
                }
            },
            // filtering related to data present in tagWord => apply here
            { '$lookup': {
                'from': User.collection.name,
                // TODO: this is not working. content.requesterId is probably not correctly used.
                'let': {'notificationSenderId': '$content.requesterId' }, // from Notification
                'pipeline': [
                    {'$match': {
                        '$expr': {
                            '$eq': ['$$notificationSenderId', '$_id']}  // _id from User
                    }},
                ],
                'as': 'notificationSender'
            }}
        ])
        return(allNotificationData)
    } catch (error){
        throw new Error("Notification auxiliary function 'getTagDataByRequest' failed")
    }
}

module.exports = {
    getNotificationsByUserId,
    createNotification,
    deleteNotification,
    updateNotification
}