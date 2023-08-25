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

// @desc    Get Words with simplified data
// @route   GET /api/words/simple
// @access  Private
const getWordsSimplified = asyncHandler(async (req, res) => {
    const getFilterQuery = (filter) => {
        switch(filter.type) {
            case 'gender': {
                return {
                    "translations.cases": {
                        $elemMatch: {
                            // bug with MongoDB? Might have to create work-around iterating through the filters array
                            // and checking one at a time, and then joining the unique results at the end
                            // see more at: https://stackoverflow.com/questions/22907451/nodejs-mongodb-in-array-not-working-if-array-is-a-variable
                            // "word": {$in: ['der', 'die']}, // this works
                            // it's an array to allow searching by more than 1 gender at a time => doesn't work at the moment
                            "word": {$in: `${[filter.filterValue]}`}, // this doesn't work => only 1 filter at a time
                            "caseName": {$regex: "^gender"},
                        }
                    },
                    "user": req.user.id,
                }
            }
            case 'tag': {
                // TODO: specify and implement
                return {
                    "user": req.user.id,
                }
            }
            case 'PoS': {
                return {
                    "user": req.user.id,
                    "partOfSpeech": {$eq: `${filter.filterValue}`}, // this doesn't work => only 1 filter at a time
                }
            }
            default: { // NO FILTER?
                return {
                    "user": req.user.id,
                }
            }
        }
    }
    const filters = (req.query.filters !== undefined) ?req.query.filters :[]

    let filteredResults = []

    if(filters.length > 0){
        for (const filter of filters) {
            let result = await Word.find(
                getFilterQuery(filter)
            )
            filteredResults.push(...result)
        }
    } else {
        const result = await Word.find(
            {
                "user": req.user.id,
            }
        )
        filteredResults.push(...result)
    }

    let wordsSimplified = []
    filteredResults.forEach((completeWord) => {
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
        amount: wordsSimplified.length, // the total amount of words saved for this user
        words: wordsSimplified // the data corresponding to those words, reduced to only the most necessary fields
    }
    res.status(200).json(result)
})

// @desc    Get Words with simplified data
// @route   GET /api/words/simple
// @access  Private
const getWordsSimplifiedOG = asyncHandler(async (req, res) => {
    const filters = req.query.filters
    let filterStrings = []
    if(filters !== undefined){
        filterStrings = filters.map(filter => {
            return ((filter.filterValue).toString())
        })
    }
    // let queryString = ""
    // if(filters !== undefined){
    //     filters.forEach(filter => {
    //         queryString = queryString+((filter.filterValue).toString())+" "
    //     })
    // }

    await Word.find(
        ((filters !== undefined) && (filterStrings.length > 0))
        // ? { $where: function() { return queryString.indexOf(this.translations.cases.word) > -1; } } // 'where' is not free for mongoDB
        // ? {"$expr": {$ne : [{$indexOfCP: [queryString, "$translations.cases.word"]}, -1]}} // this doesn't work because word is an array?
        // ? {$text: {$search: queryString}} // always empty results?
        // ? {
        //     $text: {$search: queryString},
        //     "user": req.user.id,
        // } // no results?
        ? {
            "translations.cases": {
                $elemMatch: {
                    // bug with MongoDB? Might have to create work-around iterating through the filters array
                    // and checking one at a time, and then joining the unique results at the end
                    // see more at: https://stackoverflow.com/questions/22907451/nodejs-mongodb-in-array-not-working-if-array-is-a-variable
                    // "word": {$in: ['der', 'die']}, // this works
                    "word": {$in: `${filterStrings}`}, // this doesn't work => only 1 filter at a time
                    "caseName": {$regex: "^gender"},
                }
            },
            "user": req.user.id,
        }
        // ? {
        //     // "translations.cases.word": {$in: ['der', 'die']}, // this works
        //     // "translations.cases.word": {$in: `${filterStrings}`}, // this doesn't work => only 1 filter at a time
        // } same issues as above
        : {
            "user": req.user.id,
        }
    )
    .then((data) => {
        if(data){
            let wordsSimplified = []
            data.forEach((completeWord) => {
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
                amount: data.length, // the total amount of words saved for this user
                words: wordsSimplified // the data corresponding to those words, reduced to only the most necessary fields
            }
            res.status(200).json(result)
        }
    })
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

// @desc    Get a list of Words that match a search query in any of its translations
// @route   Get /api/words/searchWord
// @access  Private
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
    // this will return an array of options, representing one or more translation PER word,
    // in case that more than one translation in a word matches the search query
    .then((data) => {
        if (data) {
            let simpleResults = []
            data.forEach((word) => {
                let fullWord = [] // word + language + id
                word.translations.forEach((translation) => {
                    // this should guarantee a single result per language
                    let found = false // we reset the flag state when iterating over a new language
                    translation.cases.forEach((wordCase) => {
                        if(
                            ((wordCase.word).toLowerCase()).includes((req.query.query).toLowerCase())
                            &&
                            !(wordCase.caseName.match(/^gender/i))
                            &&
                            (!found) // TODO: change this to a specific case? to always display the "easiest" case if multiple do match
                        ){
                            fullWord.push({
                                id: word.id,
                                language: translation.language,
                                label: wordCase.word
                            })
                            found = true
                        }
                    })
                })
                simpleResults = [
                    ...simpleResults,
                    ...fullWord
                ]
            })
            // sort simpleResults by alphabetical order
            simpleResults.sort((a, b) => a.label.localeCompare(b.label))
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