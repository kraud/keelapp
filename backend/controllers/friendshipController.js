const asyncHandler = require('express-async-handler')

const Friendship = require('../models/friendshipModel')

// @desc    Get Notifications
// @route   GET /api/getNotifications
// @access  Private
const getFriendshipsByUserId = asyncHandler(async (req, res) => {

})

// @desc    Set Friendship
// @route   POST /api/
// @access  Private
const createFriendship = asyncHandler(async (req, res) => {

})

// @desc    Delete Friendship
// @route   DELETE /api/:id
// @access  Private
const deleteFriendship = asyncHandler(async (req, res) => {

})

// @desc    Update Friendship
// @route   PUT /api/:id
// @access  Private
const updateFriendship = asyncHandler(async (req, res) => {

})

module.exports = {
    getFriendshipsByUserId,
    createFriendship,
    deleteFriendship,
    updateFriendship
}