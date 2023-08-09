const asyncHandler = require('express-async-handler')

const Word = require('../models/wordModel')
const User = require('../models/userModel')

// @desc    Get Words
// @route   GET /api/words
// @access  Private
const getWords = asyncHandler(async (req, res) => {
    const words = await Word.find({ user: req.user.id})
    res.status(200).json(words)
})

// @desc    Get Words with simplied data
// @route   GET /api/words/simple
// @access  Private
const getWordsSimplified = asyncHandler(async (req, res) => {
    const wordsComplete = await Word.find({
        user: req.user.id,
    })
    let wordsSimplified = []
    wordsComplete.forEach((completeWord) => {
        // we must go through all the languages listed on "translations" and create simplified versions of each
        let simplifiedWord = {
            partOfSpeech: completeWord.partOfSpeech,
            createdAt: completeWord.createdAt,
            updatedAt: completeWord.updatedAt,
            id: completeWord.id,
        }
        // from each translated language, we only retrieve the necessary data
        completeWord.translations.forEach((translation) => {
            switch(translation.language){
                case 'Estonian': {
                    simplifiedWord = {
                        ...simplifiedWord,
                        singularNimetavEE: (translation.cases.find(wordCase => (wordCase.caseName === 'singularNimetavEE'))).word,
                        registeredCasesEE: translation.cases.length
                    }
                    break
                }
                case 'English': {
                    simplifiedWord = {
                        ...simplifiedWord,
                        singularEN: (translation.cases.find(wordCase => (wordCase.caseName === 'singularEN'))).word,
                        registeredCasesEN: translation.cases.length
                    }
                    break
                }
                case 'Spanish': {
                    simplifiedWord = {
                        ...simplifiedWord,
                        genderES: (translation.cases.find(wordCase => (wordCase.caseName === 'genderES'))).word,
                        singularES: (translation.cases.find(wordCase => (wordCase.caseName === 'singularES'))).word,
                        registeredCasesES: translation.cases.length
                    }
                    break
                }
                case 'German': {
                    simplifiedWord = {
                        ...simplifiedWord,
                        genderDE: (translation.cases.find(wordCase => (wordCase.caseName === 'genderDE'))).word,
                        singularNominativDE: (translation.cases.find(wordCase => (wordCase.caseName === 'singularNominativDE'))).word,
                        registeredCasesDE: translation.cases.length
                    }
                    break
                }
            }
        })
        wordsSimplified.push(simplifiedWord)
    })
    const result = {
        amount: wordsComplete.length, // the total amount of words saved for this user
        words: wordsSimplified // the data corresponding to those words, reduced to only the most necessary fields
    }
    res.status(200).json(result)
})

// @desc    Get Words
// @route   GET /api/words
// @access  Private
const getWordById = asyncHandler(async (req, res) => {
    const word = await Word.findById(req.params.id)

    if(!word){
        res.status(400)
        throw new Error("Word not found")
    }

    // Check for user
    if(!req.user){
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged-in user matches the goal user
    if(word.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }
    res.status(200).json(word)
})

// @desc    Set Word
// @route   POST /api/words
// @access  Private
const setWord = asyncHandler(async (req, res) => {
    if(!req.body.partOfSpeech){
        res.status(400)
        throw new Error("Please add part of speech")
    }
    if(!req.body.translations | req.body.translations.length < 2){
        res.status(400)
        throw new Error("Please add 2 or more translations")
    }
    const word = await Word.create({
        partOfSpeech: req.body.partOfSpeech,
        translations: req.body.translations, // TranslationItem array
        clue: req.body.clue,
        user: req.user.id
    })
    res.status(200).json(word)
})

// @desc    Update Word
// @route   PUT /api/words/:id
// @access  Private
const updateWord = asyncHandler(async (req, res) => {
    const word = await Word.findById(req.params.id)

    if(!word){
        res.status(400)
        throw new Error("Word not found")
    }

    // Check for user
    if(!req.user){
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged-in user matches the goal user
    if(word.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedWord = await Word.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json(updatedWord)
})

// @desc    Delete Words
// @route   DELETE /api/words/:id
// @access  Private
const deleteWords = asyncHandler(async (req, res) => {
    const word = await Word.findById(req.params.id)

    if(!word){
        res.status(400)
        throw new Error("Word not found")
    }

    // Check for user
    if(!req.user){
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged-in user matches the word user
    if(word.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

    await word.deleteOne()
    res.status(200).json(word)
})

const filterWordByAnyTranslation = asyncHandler(async (req, res) => {
    if(!(req.query)){
        res.status(400)
        throw new Error("Missing search query text")
    }

    // Check for user
    if(!req.user){
        res.status(401)
        throw new Error('User not found')
    }

    await Word.find({
        "translations.cases": {
            $elemMatch: {
                "word": {$regex: `${req.query.query}`, $options: "i"},
                "caseName": {$not: {$regex: "^gender", $options: "i"}}, // To avoid filtering by word gender
            }
        },
        "user": req.user
    })
    // this will return a single option, representing at most a single translation PER word
    // in the case of auto (same for ES, DE, EE), we would simply display the option for the last one listed inside of translations
    // also see search: "men" for DE: MENschen && EE: iniMENe => this only displays 1 option (inimene), instead of both
    // TODO: return an array from the iterations here and if > 1 => return a spread array with both options - both with same ID -
    .then((data) => {
        if (data) {
            const simpleResults = data.map((word) => {
                let fullWord // word + language + id
                let found = false
                word.translations.forEach((translation) => {
                    translation.cases.forEach((wordCase) => {
                        if(
                            ((wordCase.word).toLowerCase()).includes((req.query.query).toLowerCase())
                            &&
                            !(wordCase.caseName.match(/^gender/i))
                            &&
                            (!found) // TODO: change this to a specific case? to always display the "easiest" case if multiple do match
                        ){
                            fullWord = {
                                id: word.id,
                                language: translation.language,
                                label: wordCase.word
                            }
                            found = true
                        }
                    })
                })
                return(fullWord)
            })
            res.status(200).json(simpleResults)
        } else {
            res.status(404).json({
                text: "No matches for this search",
                error: err
            })
        }
    })
})

module.exports = {
    getWords,
    getWordsSimplified,
    getWordById,
    setWord,
    updateWord,
    deleteWords,
    filterWordByAnyTranslation,
}