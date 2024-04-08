const asyncHandler = require('express-async-handler')

const Friendship = require('../models/friendshipModel')
const TagWord = require("../models/intermediary/tagWordModel");
const Word = require("../models/wordModel");
const mongoose = require("mongoose");
const Tag = require("../models/tagModel");
const WordTag = require("../models/intermediary/tagWordModel");

// @desc    Get all Friendships where the provided userId corresponds with one of the friendship paticipants' id
// @route   GET /api/getFriendships
// @access  Private
const getUserFriendshipsByParticipantId = asyncHandler(async (req, res) => {
    if (!(req.query)) {
        res.status(400)
        throw new Error("Missing search query text")
    }

    // Check for logged-in user ID - info added on authMiddleware
    if (!req.user) {
        res.status(401)
        throw new Error('Logged-in user not found')
    }
    // NB! user that made the get request does not necessarily need to be a participant of the friendship
    // all documents where userIds is an array that contains the string in "req.query.userId" as one of its elements:
    // const friendships = await Friendship.find({
    //     userIds: req.query.userId
    // })
    //
    // res.status(200).json(friendships)


    const request = {
        query: {
            userIds: req.query.userId // userId
        }
    }
    const friendshipData = await getFriendshipDataByRequest(request)
    res.status(200).json(friendshipData)

})

// TODO: friends-in-common endpoint

// @desc    Set Friendship
// @route   POST /api/
// @access  Private
const createFriendship = asyncHandler(async (req, res) => {
    if(!(req.body.userIds)){
        res.status(400)
        throw new Error("Please specify users to be part of the friendship.")
    } else {
        if(!(req.body.userIds.length === 2)){
            res.status(400)
            throw new Error("Only 2 users can be part of a friendship")
        }
        if(req.body.userIds[0] === req.body.userIds[1]){
            res.status(400)
            throw new Error("The participants of a friendship must be 2 different users")
        }
    }
    if(!(req.body.userIds.includes(req.user.id))){
        res.status(401)
        throw new Error('Not allowed to create: user is not part of the friendship')
    }

    if(!req.body.status){
        res.status(400)
        throw new Error("Please specify the status of the friendship.")
    }

    const friendship = await Friendship.create({
        userIds: req.body.userIds,
        status: req.body.status,
        partnerships: req.body.partnerships,
    })

    res.status(200).json(friendship)
})

// @desc    Delete Friendship
// @route   DELETE /api/:id
// @access  Private
const deleteFriendship = asyncHandler(async (req, res) => {
    const friendship = await Friendship.findById(req.params.id)

    if(!friendship){
        res.status(400)
        throw new Error("Notification not found")
    }

    // Check for user
    if(!req.user){
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the user trying to delete the friendship is part of the friendship
    if(!friendship.userIds.includes(req.user.id)){
        res.status(401)
        throw new Error('Not allowed to delete: user is not part of the friendship')
    }

    await friendship.deleteOne()
    res.status(200).json(friendship)
})

// @desc    Update Friendship
// @route   PUT /api/:id
// @access  Private
const updateFriendship = asyncHandler(async (req, res) => {
    const friendship = await Friendship.findById(req.params.id)

    if(!friendship){
        res.status(400)
        throw new Error("Friendship not found")
    }

    // Check for logged-in user ID - info added on authMiddleware
    if(!req.user){
        res.status(401)
        throw new Error('User not found')
    }

    if(!friendship.userIds.includes(req.user.id)){
        res.status(401)
        throw new Error('Not allowed to update: user is not part of the friendship')
    }

    const updatedFriendship = await Friendship.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json(updatedFriendship)
})


const getFriendshipDataByRequest = async (friendshipFilter) => {

    try {
        const allFriendshipData = await Friendship.aggregate([
            // filtering related to data present in Friendship => apply here
            {
                $match: {
                    $and: getMatchQuery(req.query)
                }
            },
            // filtering related to data present in tagWord => apply here
            { '$lookup': {
                'from': User.collection.name,
                'let': { 'userIds': '$userIds'}, // from Friendship
                'pipeline': [
                    {'$match': {
                        '$expr': {
                            '$_id': {$in: '$$userIds'} // _id from User
                            // '$and': [
                                // {'$eq': ['$$id', '$_id']},  // _id from User
                            // ]
                        }
                    }},
                    { '$lookup': {
                        'from': User.collection.name,
                        'let': { 'id': '$_id' }, // from Friendship
                        'pipeline': [
                            { '$match': {
                                    '$expr': { '$eq': [ '$_id', '$$id' ] }
                                }}
                        ],
                        'as': 'users'
                    }},
                    { '$unwind': '$users' },
                    { '$replaceRoot': { 'newRoot': '$users' } }
                ],
                'as': 'users'
            }}
        ])
        return(allFriendshipData)
    } catch (error){
        throw new Error("Friendship auxiliary function 'getTagDataByRequest' failed")
    }
}

// AUXILIARY FUNCTIONS:
// TODO: modify to match FriendshipModel
const getMatchQuery = (queryData) => {
    let matchQuery = []
    if(queryData.userIds !== undefined){
        matchQuery.push({
            // this way we check if the userIds arrays includes the value in 'queryData.userIds'
            "userIds": queryData.userIds
        })
    }
    // if(queryData.user !== undefined){
    //     matchQuery.push({
    //         "user": mongoose.Types.ObjectId(queryData.user)
    //     })
    // }
    // if(queryData.partOfSpeech !== undefined){
    //     matchQuery.push({
    //         "partOfSpeech": queryData.partOfSpeech
    //     })
    // }
    // if(queryData.clue !== undefined){
    //     matchQuery.push({
    //         "clue": {$regex: `${queryData.clue}`, $options: "i"},
    //     })
    // }
    // TODO: look into other query options, like tagId(s)?
    return(matchQuery)
}

module.exports = {
    getUserFriendshipsByParticipantId,
    createFriendship,
    deleteFriendship,
    updateFriendship
}