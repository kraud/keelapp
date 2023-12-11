
const asyncHandler = require("express-async-handler");
const Tag = require("../models/tagModel");
const Word = require("../models/wordModel");
// getTagsByUserId
// getTagById
// createTag
// deleteTag
// updateTag


// @desc    Search for tags regex matching a request query (string)
// @route   GET /api/tags
// @access  Private
// TODO: add flag in request to allow search results to include other user tags
const searchTags = asyncHandler(async (req, res) => {
    // first we get all tag arrays from stored words, where at least 1 matches the query
    const tags = await Tag.find(
        {
            "label": {$regex: `${req.query.query}`, $options: "i"},
            author: req.user.id
        },
    )
    // TODO: should we return this in the "FilterItem" format for tag?
    res.status(200).json(tags)
})

// @desc    Get all tags where user id matches author
// @route   GET /api/tags
// @access  Private
const getUserTags = asyncHandler(async (req, res) => {
    const word = await Word.findById(req.params.id)
    // first we get all tag arrays from stored words, where at least 1 matches the query
    const tags = await Tag.find(
        {
            author: req.params.id
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