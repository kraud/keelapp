var mongoose = require('mongoose');
const asyncHandler = require("express-async-handler");

// @desc    Search for tags with a regex matching (partially or fully) a request query (string) with the tag label
// @route   GET /api/tags
// @access  Private
const getExercises = asyncHandler(async (req, res) => {

    res.status(200).json()
})


module.exports = {
    getExercises,
}