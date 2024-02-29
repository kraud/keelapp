var mongoose = require('mongoose');
const asyncHandler = require("express-async-handler");
const Tag = require("../models/tagModel");
const Word = require("../models/wordModel");
const WordTag = require("../models/intermediary/tagWordModel");
const TagWord = require("../models/intermediary/tagWordModel");


// @desc    Search for tags with a regex matching (partially or fully) a request query (string) with the tag label
// @route   GET /api/tags
// @access  Private
const searchTags = asyncHandler(async (req, res) => {
    const getPrivateOrPublicQuery = () => {
        if(req.query.includeOtherUsersTags){
            return({
                "label": {$regex: `${req.query.query}`, $options: "i"},
                author: req.user.id
            })
        } else {
            return({
                $and: [
                    {"label": {$regex: `${req.query.query}`, $options: "i"}},
                    { $or: [
                        {public: {$in: ['Public']}}, // TODO: in the future add 'Friends-Only' to array, IF user is friends with tag author
                        {author: req.user.id}
                    ]}
                ]
            })
        }
    }

    // first we get all tag arrays from stored words, where at least 1 matches the query
    const tags = await Tag.find(getPrivateOrPublicQuery())
    // TODO: should we return this in the "FilterItem" format for tag?
    res.status(200).json(tags)
})

// @desc    Get all tags where user id matches author
// @route   GET /api/tags
// @access  Private
const getUserTags = asyncHandler(async (req, res) => {
    const tags = await Tag.find(
        {
            author: req.user.id
        },
    )
    // TODO: should we return this in the "FilterItem" format for tag?
    res.status(200).json(tags)
})

// @desc    Get all tags where user id matches author
// @route   GET /api/tags
// @access  Private
const getOtherUserTags = asyncHandler(async (req, res) => {
    const tags = await Tag.find(
        {
            author: req.query.otherUserId,
            public: 'Public' // TODO: add 'Friends-Only' later on
        },
    )
    // TODO: check if req.user.id is a friend of each tag where 'public' value is 'Friends-Only'
    // TODO: should we return this in the "FilterItem" format for tag?
    res.status(200).json(tags)
})

// @desc    Get tag by tagId
// @route   GET /api/tags
// @access  Private
const getTagById = asyncHandler(async (req, res) => {
    // TODO: should we return this in the "FilterItem" format for tag?
    // const tag = await Tag.findById(req.params.id)
    // res.status(200).json(tag)

    const singleTagData = await Tag.aggregate([
        // filtering related to data present in word => apply here
        {
            $match: {
                $and:[
                    {"_id": mongoose.Types.ObjectId(req.params.id)},
                ]
            }
        },
        // filtering related to data present in tagWord => apply here
        { '$lookup': {
            'from': WordTag.collection.name,
            'let': { 'id': '$_id', 'tagAuthor': '$author' }, // from Tag
            'pipeline': [
                {'$match': {
                        '$expr': {
                            '$and': [
                                {'$eq': ['$$id', '$tagId']},  // tagId from WordTag
                            ]
                        }
                    }},
                { '$lookup': {
                        'from': Word.collection.name,
                        'let': { 'wordId': '$wordId' }, // from WordTag
                        'pipeline': [
                            { '$match': {
                                    '$expr': { '$eq': [ '$_id', '$$wordId' ] }
                                }}
                        ],
                        'as': 'words'
                    }},
                { '$unwind': '$words' },
                { '$replaceRoot': { 'newRoot': '$words' } }
            ],
            'as': 'wordsFullData'
        }}
    ])
    res.status(200).json(singleTagData[0])
})

// @desc    Create Tag
// @route   POST /api/tags
// @access  Private
const createTag = asyncHandler(async (req, res) => {
    if(!req.body.label){
        res.status(400)
        throw new Error("Please specify label for tag")
    }
    if(!req.body.author){
        res.status(400)
        throw new Error("Missing tag author")
    }
    if(!(['Public', 'Private', 'Friends-Only'].includes(req.body.public))){
        res.status(400)
        throw new Error("Invalid public status")
    }
    Tag.create({
        author: req.body.author,
        label: req.body.label,
        public: req.body.public,
        description: req.body.description,
    })
        .then(value => {
            // TODO: tagWord logic should be properly implemented in a separate controller?
            //  how can we call it once we crated the tag?
            // NB! Testing to see if this works correctly. If so: we'll refactor this into a separate (async?) function
            if((req.body.wordsId !== undefined) && (req.body.wordsId.length >0)){
                const tagWordsItems = req.body.wordsId.map((wordId) => {
                    return ({
                        tagId: value._id,
                        wordId: wordId
                    })
                })
                TagWord.insertMany(tagWordsItems)
                    .then(function (returnData) {
                        console.log("Data inserted") // Success
                        console.log("returnData:", returnData) // Success
                        res.status(200).json({
                            ...value,
                            tagWords: returnData,
                        })
                    }).catch(function (error) {
                        console.log(error)     // Failure
                        console.log("Error when inserting TagWord")
                        res.status(400).json(value)
                        throw new Error("Tag-Word insertMany failed")
                    });
            }
        })
        .catch(function (error) {
            console.log(error)     // Failure
            console.log("Error when creating Tag")
            res.status(400)
            throw new Error("Tag-Word insertMany failed")
        })
})

// @desc    Delete Tag
// @route   DELETE /api/tags/:id
// @access  Private
const deleteTag = asyncHandler(async (req, res) => {
    const tag = await Tag.findById(req.params.id)

    if(!tag){
        res.status(400)
        throw new Error("Tag not found")
    }

    // Check for user
    if(!req.user){
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged-in user matches the word user
    if(tag.author.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized to delete this tag (does not match author).')
    }

    // TODO: we should remove the tag from the tag-array in all the words (for this user) where it is present

    await tag.deleteOne()
    // TODO: maybe add a flag to also trigger deletion of all words related to this tag?
    res.status(200).json(tag)
})

// @desc    Update Tag
// @route   PUT /api/tags/:id
// @access  Private
const updateTag = asyncHandler(async (req, res) => {
    const tag = await Tag.findById(req.params.id)

    if(!tag){
        res.status(400)
        throw new Error("Tag not found")
    }

    // Check for user
    if(!req.user){
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged-in user matches the goal user
    if(tag.author.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }
    //TODO: iterate over wordsFullData and check for new tag-word relationships => create tagWord documents accordingly
    if(req.body.wordsFullData.length > 0){ // if there are words associated with this tag, we must check if they are the same as currently stored in TagWord
        const updatedWordsList = req.body.wordsFullData // all wordsIds. Some might be new, some might already be stored or ir could be missing some previously stored.
        // we retrieve the currently stored list of words related to this tag
        const request = {
            query: {
                id: req.params.id
            }
        }
        getTagDataByRequest(request) // req.query should have id (for the tag)
            .then((tagWithWordData) => { // tagWithWordData will be an array of 1 item with the tag and property words, with a list of Word
                console.log('tagWithWordData', tagWithWordData)
                const tagStoredWordsId = tagWithWordData[0].words.map((word) => {
                    return(word._id)
                })
                let wordsToBeRemoved = []
                tagStoredWordsId.forEach((storedWordId) => {
                    if(!(updatedWordsList.includes(storedWordId))){
                        wordsToBeRemoved.push(storedWordId)
                    }  // if updatedWordList DOES include storedWordId => we don't need to save it again
                })
                let wordsToBeAdded = []
                updatedWordsList.forEach((updatedWordId) => {
                    if(!(tagStoredWordsId.includes(updatedWordId))){
                        wordsToBeAdded.push(updatedWordId)
                    }  // if tagStoredWordsId DOES include updatedWordId => we don't need to save it again
                })

                console.log('tagStoredWordsId', tagStoredWordsId)
                console.log('updatedWordsList', updatedWordsList)
                // we call TagWord to remove all items that match current TagId+ an item from wordsToBeRemoved
                // we call TagWord to add all items from wordsToBeRemoved+TagId

                // TODO: once that is done we update the info inside Tag
                const updatedDataToStore = {
                    author: req.body.author,
                    label: req.body.label,
                    public: req.body.public,
                    description: req.body.description,
                }

                // const updatedTag = await Tag.findByIdAndUpdate(req.params.id, updatedDataToStore, {new: true})
                // res.status(200).json(updatedTag)
            })
    }

    const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json(updatedTag)
})

// getAmountByTag
// @desc    Get Amount of items for a Tags
// @route   GET /api/tagsAmount
// @access  Private
const getAmountByTag = asyncHandler(async (req, res) => {
    const tag = await Tag.findById(req.params.id)

    if(!tag){
        res.status(400)
        throw new Error("Tag ID does not match any existing tag.")
    }
    if(!(tag.wordsId)){
        res.status(400)
        throw new Error("Tag ID does not have words associated to it.")
    }
    res.status(200).json(tag.wordsId.length)
})

// @desc    Get All word+tag data
// @route   GET --
// @access  Private
const getAllTagDataByUserId = asyncHandler(async (req, res) => {
    const allTagData = await Tag.aggregate([
        // filtering related to data present in word => apply here
        {
            $match: {
                $and:[
                    // Make sure the logged-in user matches the word user
                    {"author": mongoose.Types.ObjectId(req.params.id)},
                ]
            }
        },
        // filtering related to data present in tagWord => apply here
        { '$lookup': {
            'from': WordTag.collection.name,
            'let': { 'id': '$_id', 'tagAuthor': '$author' }, // from Tag
            'pipeline': [
                {'$match': {
                    '$expr': {
                        '$and': [
                            {'$eq': ['$$id', '$tagId']},  // tagId from WordTag
                        ]
                    }
                }},
                { '$lookup': {
                    'from': Word.collection.name,
                    'let': { 'wordId': '$wordId' }, // from WordTag
                    'pipeline': [
                        { '$match': {
                                '$expr': { '$eq': [ '$_id', '$$wordId' ] }
                            }}
                    ],
                    'as': 'words'
                }},
                { '$unwind': '$words' },
                { '$replaceRoot': { 'newRoot': '$words' } }
            ],
            'as': 'words'
        }}
    ])
    res.status(200).json(allTagData)
})


// TODO: test removing asyncHandler,
//  and simply make it async + accepting single parameter with request and calling that from filterTag?
// @desc    Get tag data + words, and request can specify fields to filter Tag by
// @route   GET --
// @access  Private
// const getTagDataByRequest = asyncHandler(async (req, res) => {
const getTagDataByRequest = async (req) => {
    // req.body might allow filtering tag by: id, author, label, description, public
    console.log('ACTIVE')
    const getMatchQuery = (queryData) => {
        let matchQuery = []
        if(queryData.id !== undefined){
            matchQuery.push({
                "_id": mongoose.Types.ObjectId(queryData.id) // works
            })
        }
        if(queryData.author !== undefined){
            matchQuery.push({
                "author": mongoose.Types.ObjectId(queryData.author) // works
            })
        }
        if(queryData.label !== undefined){
            matchQuery.push({
                "label": {$regex: `${queryData.label}`, $options: "i"},
            })
        }
        if(queryData.description !== undefined){
            matchQuery.push({
                "description": {$regex: `${queryData.description}`, $options: "i"},
            })
        }
        if(queryData.public !== undefined){
            matchQuery.push({
                "public": queryData.public
            })
        }
        return(matchQuery)
    }

    const allTagData = await Tag.aggregate([
        // filtering related to data present in word => apply here
        {
            $match: {
                $and: getMatchQuery(req.query)
            }
        },
        // filtering related to data present in tagWord => apply here
        { '$lookup': {
                'from': WordTag.collection.name,
                'let': { 'id': '$_id', 'tagAuthor': '$author' }, // from Tag
                'pipeline': [
                    {'$match': {
                            '$expr': {
                                '$and': [
                                    {'$eq': ['$$id', '$tagId']},  // tagId from WordTag
                                ]
                            }
                        }},
                    { '$lookup': {
                            'from': Word.collection.name,
                            'let': { 'wordId': '$wordId' }, // from WordTag
                            'pipeline': [
                                { '$match': {
                                        '$expr': { '$eq': [ '$_id', '$$wordId' ] }
                                    }}
                            ],
                            'as': 'words'
                        }},
                    { '$unwind': '$words' },
                    { '$replaceRoot': { 'newRoot': '$words' } }
                ],
                'as': 'words'
            }}
    ])
    return(allTagData)
    // res.status(200).json(allTagData)
}
// })

module.exports = {
    searchTags,
    getUserTags,
    getTagById,
    createTag,
    deleteTag,
    updateTag,
    getAmountByTag,
    getOtherUserTags,
    getAllTagDataByUserId,
    getTagDataByRequest
}