
const asyncHandler = require("express-async-handler");
const Tag = require("../models/tagModel");


// @desc    Search for tags with a regex matching (partially or fully) a request query (string) with the tag label
// @route   GET /api/tags
// @access  Private
const searchTags = asyncHandler(async (req, res) => {
    const getPrivateOrPublicQuery = () => {
        if(req.query.inlcudeOtherUsersTags){
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

// @desc    Get tag by tagId
// @route   GET /api/tags
// @access  Private
const getTagById = asyncHandler(async (req, res) => {
    const tag = await Tag.findById(req.params.id)
    // TODO: should we return this in the "FilterItem" format for tag?
    res.status(200).json(tag)
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
    const tag = await Tag.create({
        author: req.body.author,
        label: req.body.label,
        public: req.body.public,
        description: req.body.description,
        // TODO: wordsId?
    })
    res.status(200).json(tag)
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

module.exports = {
    searchTags,
    getUserTags,
    getTagById,
    createTag,
    deleteTag,
    updateTag,
    getAmountByTag
}