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
            return([
                {"label": {$regex: `${req.query.query}`, $options: "i"}},
                {"author": mongoose.Types.ObjectId(req.user.id)}
            ])
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
    const tags = await getTagDataByRequest(undefined, getPrivateOrPublicQuery())
    res.status(200).json(tags)
})

// @desc    Get all tags where user id matches author
// @route   GET /api/tags
// @access  Private
// TODO: can be re-implemented using 'getTagDataByRequest'?
const getUserTags = asyncHandler(async (req, res) => {
    // const tags = await Tag.find(
    //     {
    //         author: req.user.id
    //     },
    // )
    // // TODO: should we return this in the "FilterItem" format for tag?
    // res.status(200).json(tags)

    const request = {
        query: {
            author: req.user.id
        }
    }

    const tagsData = await getTagDataByRequest(request)
    res.status(200).json(tagsData)
})

// @desc    Get all tags where user id matches the one in the request
// @route   GET /api/tags
// @access  Private
// TODO: can be re-implemented using 'getTagDataByRequest'?
const getOtherUserTags = asyncHandler(async (req, res) => {
    const tags = await Tag.find(
        {
            author: req.query.otherUserId,
            public: 'Public' // TODO: add 'Friends-Only' later on
        },
    )
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
            'as': 'words'
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
        .then((value) => {
            if(req.body.words.length >0){
                const tagWordsItems = req.body.words.map((wordData) => {
                    return ({
                        tagId: value._id,
                        wordId: wordData._id
                    })
                })
                TagWord.insertMany(tagWordsItems)
                    .then((returnData) => {
                        res.status(200).json({
                            ...value.toObject(),
                            words: req.body.words,
                        })
                    }).catch(function (error) {
                        res.status(400).json(value)
                        throw new Error("Tag-Word insertMany failed")
                    })
            } else {
                res.status(200).json({
                    ...value,
                    words: [],
                })
            }
        })
        .catch(function (error) {
            res.status(400)
            throw new Error("Tag create failed")
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

    tag.deleteOne()
        .then(async (tagDeletionData) => {
            const removeQuery = {tagId: req.params.id}
            TagWord.deleteMany(removeQuery)
                .then((tagWordDeletionData) => {
                    res.status(200).json(tag)
                })
                .catch(function (error) {
                    res.status(400).json(error)
                    throw new Error("Tag-Word (from tag) deleteMany failed")
                })
        })
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

    // once updating TagWord is done we update the info inside Tag
    const updatedDataToStore = {
        author: req.body.author,
        label: req.body.label,
        public: req.body.public,
        description: req.body.description,
    }
    // iterate over words and check for new tag-word relationships => create/remove tagWord documents accordingly
    // if in words there are words associated with this tag, we must check if they are the same as currently stored in TagWord
    // if words is empty we must check if there are words stored related to this tag and delete them
    const updatedWordsList = (req.body.words).map((wordFullData) => {
        return((wordFullData._id).toString()) // TODO: check if toString can be removed
    }) // all wordsIds. Some might be new, all might already be stored, or it could be missing some previously stored.
    // we retrieve the currently stored list of words related to this tag
    const request = {
        query: {
            id: req.params.id // id for the current Tag
        }
    }

    getTagDataByRequest(request) // req.query should have id (for the tag)
        // only 1 possible tag with the id inside query => tagWithWordData will be an array of 1 item
        .then(async (tagWithWordData) => {
            // inside tagWithWordData[0] there is property called 'words', with a list of Word elements (check interface in FE)
            const tagStoredWordsId = tagWithWordData[0].words.map((word) => {
                return((word._id).toString())
            })
            let wordsToBeRemoved = []
            tagStoredWordsId.forEach((storedWordId) => {
                if(!(updatedWordsList.includes(storedWordId))){
                    wordsToBeRemoved.push(storedWordId)
                }  // if updatedWordsList DOES include storedWordId => we don't need to save it again
            })
            let wordsToBeAdded = []
            updatedWordsList.forEach((updatedWordId) => {
                if(!(tagStoredWordsId.includes(updatedWordId))){
                    wordsToBeAdded.push(updatedWordId)
                }  // if tagStoredWordsId DOES include updatedWordId => we don't need to save it again
            })

            // FIRST ELEMENT ALWAYS IS THE WORDS TO BE DELETED
            // SECOND ELEMENT ALWAYS IS THE WORDS TO BE ADDED
            const rawModificationLIst = [wordsToBeRemoved, wordsToBeAdded] // some (or both) items in the array might still be an empty array itself
            const modificationsList = [] // we will store here only the modificationsArrays that have elements inside them
            rawModificationLIst.forEach((arrayWithModifications) => {
                if(arrayWithModifications.length > 0){
                    modificationsList.push(arrayWithModifications)
                } else {
                    modificationsList.push(null)
                }
            })
            // Promise.all should allow for parallel asynchronous request to be made and once all are done, it will continue
            if((modificationsList[0] !== null) || modificationsList[1] !== null){
                Promise.all(modificationsList.map(async (listOfChanges, index) => {
                    if(listOfChanges !== null) {
                        switch(index) {
                            // FIRST ELEMENT IN modificationsList IS ALWAYS THE WORDS TO BE DELETED
                            case 0: {
                                // we call TagWord to remove all items that match current TagId+(an item from wordsToBeRemoved)
                                const removeQuery = {
                                    $and: [
                                        {tagId: req.params.id},
                                        {wordId: {$in: listOfChanges}}
                                    ]
                                }
                                return TagWord.deleteMany(removeQuery)
                            }
                            // SECOND ELEMENT IN modificationsList IS ALWAYS THE WORDS TO BE ADDED
                            case 1: {
                                // we call TagWord to add all items from (wordsToBeRemoved)+TagId
                                const tagWordsItems = listOfChanges.map((wordId) => {
                                    return ({
                                        tagId: req.params.id,
                                        wordId: wordId,
                                    })
                                })
                                return TagWord.insertMany(tagWordsItems)
                            }
                            default: {
                                return // no possible case where array will be longer than 2 elements
                            }
                        }
                    }
                })).then(async (completeModificationsResponse) => {
                    Tag.findByIdAndUpdate(req.params.id, updatedDataToStore, {new: true})
                        .then((updatedTag) => {
                            const updatedDataWithWordsFullData = {
                                // updateTag returned by findByIdAndUpdate includes a lot of data used for debugging (?)
                                // Using toObject() we can access only the data we're interested in
                                ...updatedTag.toObject(),
                                // this is not stored alongside Tag data. So we add it here so return data matches what came in request body
                                words: req.body.words
                            }
                            res.status(200).json(updatedDataWithWordsFullData)
                    })
                })
            } else {
                // no changes needed for stored words related to this tag
                // NB! this needs to be repeated here because inside IF it runs inside 'then', after updating TagWord
                const updatedTag = await Tag.findByIdAndUpdate(req.params.id, updatedDataToStore, {new: true})
                res.status(200).json(updatedTag)
            }
        })
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


// @desc    Get tag data + words, and request can specify fields to filter Tag by
// @route   GET --
// @access  Private
// TODO: remove from tagRoutes? This is an internal-use function now
const getTagDataByRequest = async (req, tagForceRequest) => {
    // req.body might allow filtering tag by: id, author, label, description, public
    const getMatchQuery = (queryData) => {
        let matchQuery = []
        if(queryData.id !== undefined){
            matchQuery.push({
                "_id": mongoose.Types.ObjectId(queryData.id)
            })
        }
        if(queryData.author !== undefined){
            matchQuery.push({
                "author": mongoose.Types.ObjectId(queryData.author)
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
        // NB! this only applies for public === 'Public'
        // For public === 'Friends-Only' => create new type and force this case to include 'FriendsId' list
        // to also include it inside matchQuery item
        if(queryData.public !== undefined){
            matchQuery.push({
                "public": queryData.public
            })
        }
        // TODO: look into other query options, like wordId(s)?
        return(matchQuery)
    }

    // since 'getTagDataByRequest' is not wrapped with asyncHandler, we have to manage/catch errors manually.
    try {
        const allTagData = await Tag.aggregate([
            // filtering related to data present in word => apply here
            {
                $match: {
                    $and: (tagForceRequest !== undefined)
                        ? tagForceRequest // more complex request can be made to override the getMatchQuery process
                        : getMatchQuery(req.query)
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
    } catch (error){
        throw new Error("Tag auxiliary function 'getTagDataByRequest' failed")
    }
}

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