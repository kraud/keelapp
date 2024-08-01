const asyncHandler = require("express-async-handler")
const conjugateVerb = require("../../node_modules/conjugator/lib/conjugateVerb.js")
const isWord = require('is-word');

// @desc    Get spanish verb info by infinitive form
// @route   GET /api/autocompleteTranslations
// @access  Private
const getVerbES = asyncHandler(async (req, res) => {
    const spanishVerb = isWord('spanish')
    if(spanishVerb.check(req.params.infinitiveVerb)){
        var verbResponse = conjugateVerb(req.params.infinitiveVerb, {style: 'rioplatense'})
        res.status(200).json({verbFound: true, verbData: verbResponse})
    }
    res.status(200).json({verbFound: false})

})

module.exports = {
    getVerbES
}