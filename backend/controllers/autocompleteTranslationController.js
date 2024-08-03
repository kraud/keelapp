const asyncHandler = require("express-async-handler")
// const conjugateVerb = require("../../node_modules/conjugator/lib/conjugateVerb.js")
const isWord = require('is-word')
const GermanVerbsLib = require('german-verbs');
const GermanVerbsDict = require('german-verbs-dict/dist/verbs.json');

// @desc    Get Spanish verb info by infinitive form
// @route   GET /api/autocompleteTranslations
// @access  Private
const getVerbES = asyncHandler(async (req, res) => {
    const spanishVerb = isWord('spanish')
    // if(spanishVerb.check(req.params.infinitiveVerb)){
        // var verbResponse = conjugateVerb(req.params.infinitiveVerb, {style: 'rioplatense'})
    //     res.status(200).json({foundVerb: true, verbData: verbResponse})
    // }
    res.status(200).json({foundVerb: false})

})

// @desc    Get German verb info by infinitive form
// @route   GET /api/autocompleteTranslations
// @access  Private
const getVerbDE = asyncHandler(async (req, res) => {
    const germanVerb = isWord('ngerman')
    if(germanVerb.check(req.params.infinitiveVerb)){
        const verbResponse = {
            language: 'German',
            cases: [
                // TODO: add optional field to request to specify auxiliary verb: haben/sein
                //  (small list of verbs use 'sein', we could filter/determine them in FE?).
                //  We need aux verb for Perfekt (present perfect) and other forms.
                // word: GermanVerbsLib.getConjugation(GermanVerbsDict, req.params.infinitiveVerb, 'PRASENS', 1, 'S', 'HABEN')
                {
                    caseName: "indicativePresent1sDE",
                    word: GermanVerbsLib.getConjugation(GermanVerbsDict, req.params.infinitiveVerb, 'PRASENS', 1, 'S')[0]
                },
                {
                    caseName: "indicativePresent2sDE",
                    word: GermanVerbsLib.getConjugation(GermanVerbsDict, req.params.infinitiveVerb, 'PRASENS', 2, 'S')[0]
                },
                {
                    caseName: "indicativePresent3sDE",
                    word: GermanVerbsLib.getConjugation(GermanVerbsDict, req.params.infinitiveVerb, 'PRASENS', 3, 'S')[0]
                },
                {
                    caseName: "indicativePresent1plDE",
                    word: GermanVerbsLib.getConjugation(GermanVerbsDict, req.params.infinitiveVerb, 'PRASENS', 1, 'P')[0]
                },
                {
                    caseName: "indicativePresent2plDE",
                    word: GermanVerbsLib.getConjugation(GermanVerbsDict, req.params.infinitiveVerb, 'PRASENS', 2, 'P')[0]
                },
                {
                    caseName: "indicativePresent3plDE",
                    word: GermanVerbsLib.getConjugation(GermanVerbsDict, req.params.infinitiveVerb, 'PRASENS', 3, 'P')[0]
                },
            ]
        }

        res.status(200).json({foundVerb: true, verbData: verbResponse})
    }
    res.status(200).json({foundVerb: false})

})

module.exports = {
    getVerbES,
    getVerbDE,
}