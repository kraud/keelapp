const asyncHandler = require('express-async-handler')

// @desc    Get Words
// @route   GET /api/words
// @access  Private
const getWords = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "Get words!"
    })
})

// @desc    Set Word
// @route   POST /api/words
// @access  Private
const setWord = asyncHandler(async (req, res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error("Please add text field")
    }
    console.log(req.body)
    res.status(200).json({
        message: "Set word!"
    })
})

// @desc    Update Word
// @route   PUT /api/words/:id
// @access  Private
const updateWord = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: `Update word ${req.params.id}`
    })
})

// @desc    Get Words
// @route   DELETE /api/words/:id
// @access  Private
const deleteWords = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: `Delete word ${req.params.id}`
    })
})
module.exports = {
    getWords,
    setWord,
    updateWord,
    deleteWords,
}