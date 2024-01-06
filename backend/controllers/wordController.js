const asyncHandler = require('express-async-handler')

const Word = require('../models/wordModel')

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
                            "caseName": {$regex: "^gender"}, // TODO: add check for other fields like "gradable" in adverb
                        }
                    },
                    "user": req.user.id,
                }
            }
            // TODO: this will need to be changed. 2 options:
            //  1 - If we keep on each word the id+tag, we can simply modify this search
            //      (problem: 2 sources of truth => if tag label changes we must update it on every word)
            //  2 - If we only keep the id, we must filter the tags separately and then return the overlapping list.
            //      (problem: this could cause issues with searching through other user's tags -set as public or friends-only-
            //      We would need to keep a list per-user of the tags they're using?)
            case 'tag': {
                // NB! in this case, filter.tagIds for type === "tag" will be an array of strings
                // so each filter further restricts the results when included
                if(filter.tagIds !== undefined && filter.tagIds.length > 0){
                    return {
                        "tags": { $all: filter.tagIds},// This would force to only get items that have all the tags in filter.value
                        user: req.user.id
                    }
                } else {
                    // NB! in this case, filter.value for type === "tag" will be a single string
                    // so each filter gives additive results when included
                    if ((filter.filterValue !== undefined) && (filter.filterValue !== "")) {
                        return {
                            "tags": {$regex: `${filter.filterValue}`, $options: "i"},
                            user: req.user.id
                        }
                    }
                }
                break
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
    const getRequiredFieldsData = (translation, partOfSpeech) => {
        //Fields depend on Part of Speech + Language
        switch (partOfSpeech){
            case ("Noun"): {
                switch (translation.language){
                    case ("Estonian"): {
                        return({
                            dataEE: (translation.cases.find(wordCase => (wordCase.caseName === 'singularNimetavEE'))).word,
                        })
                    }
                    case ("English"): {
                        return({
                            dataEN: (translation.cases.find(wordCase => (wordCase.caseName === 'singularEN'))).word,
                        })
                    }
                    case ("Spanish"): {
                        return({
                            genderES: (translation.cases.find(wordCase => (wordCase.caseName === 'genderES'))).word,
                            dataES: (translation.cases.find(wordCase => (wordCase.caseName === 'singularES'))).word,
                        })
                    }
                    case ("German"): {
                        return({
                            genderDE: (translation.cases.find(wordCase => (wordCase.caseName === 'genderDE'))).word,
                            dataDE: (translation.cases.find(wordCase => (wordCase.caseName === 'singularNominativDE'))).word,
                        })
                    }
                    default: {
                        res.status(400)
                        throw new Error("Language not found for this part of speech (Noun)")
                    }
                }
            }
            case ("Adverb"): {
                switch (translation.language){
                    case ("English"): {
                        return({
                            dataEN: (translation.cases.find(wordCase => (wordCase.caseName === 'adverbEN'))).word,
                        })
                    }
                    case ("Spanish"): {
                        return({
                            dataES: (translation.cases.find(wordCase => (wordCase.caseName === 'adverbES'))).word,
                        })
                    }
                    case ("German"): {
                        return({
                            dataDE: (translation.cases.find(wordCase => (wordCase.caseName === 'adverbDE'))).word,
                        })
                    }

                    default: {
                        res.status(400)
                        throw new Error("Language not found for this part of speech (Adverb)")
                    }
                }
            }
            case ("Adjective"): {
                switch (translation.language){
                    case ("English"): {
                        return({
                            dataEN: (translation.cases.find(wordCase => (wordCase.caseName === 'positiveEN'))).word,
                        })
                    }
                    case ("Spanish"): {
                        return(((translation.cases.find(wordCase => (wordCase.caseName === 'maleSingularES'))) !== undefined)
                            ?
                                ({
                                    dataES: (translation.cases.find(wordCase => (wordCase.caseName === 'maleSingularES'))).word,
                            })
                            :
                                ({
                                    dataES: (translation.cases.find(wordCase => (wordCase.caseName === 'neutralSingularES'))).word,
                            })
                        )
                    }
                    case ("German"): {
                        return({
                            dataDE: (translation.cases.find(wordCase => (wordCase.caseName === 'positiveDE'))).word,
                        })
                    }
                    case ("Estonian"): {
                        return({
                            dataEE: (translation.cases.find(wordCase => (wordCase.caseName === 'algvorreEE'))).word,
                        })
                    }
                    default: {
                        res.status(400)
                        throw new Error("Language not found for this part of speech (Adjective)")
                    }
                }
            }
            default: {
                res.status(400)
                throw new Error("Part of speech not found")
            }
        }
    }
    const getFieldName = (language) => {
        switch(language){
            case 'Estonian': {
                return("registeredCasesEE")
            }
            case 'English': {
                return("registeredCasesEN")
            }
            case 'Spanish': {
                return("registeredCasesES")
            }
            case 'German': {
                return("registeredCasesDE")
            }
        }
    }
    const filters = (req.query.filters !== undefined) ?req.query.filters :[]

    let originalResults = []

    if(filters.length > 0){
        for (const filter of filters) {
            let result = await Word.find(
                getFilterQuery(filter)
            )
            // TODO: potential optimization => only push if result.length > 0
            originalResults.push({
                type: filter.type,
                searchResults: result})
        }
    } else {
        const result = await Word.find(
            {
                "user": req.user.id,
            }
        )
        originalResults.push({
            type: 'none',
            searchResults: result
        })
    }


    let wordsSimplified = []
    // we merge all the items with the same "type" into the same array
    let groupedResults = []
    let processedResults = []
    // if no filters => single array results will be spread
    if((originalResults.length === 1) && (originalResults[0].type === 'none')){
        processedResults = (originalResults[0].searchResults)
    } else {
        originalResults.forEach((originalResult, indexOGResult) => {
            // first item will be added directly
            if(groupedResults.length === 0){
                groupedResults.push({
                    type: originalResult.type,
                    queryResults: originalResult.searchResults
                })
            } else {
                // if there is at least 1 item already on the list, we must check if the current queryResult's type is already added
                groupedResults.forEach((groupedResult, indexGrouped) => {
                    // if so, add this queryResult queryResults into that groupedResults item
                    if(originalResult.type === groupedResult.type){
                        groupedResults[indexGrouped] = {
                            ...groupedResult, // we keep the other fields (type and potentially others) as they were
                            queryResults: [
                                // potentially duplicated items between the 2 lists => will be filtered later
                                ...(groupedResult.queryResults),
                                ...(originalResult.searchResults),
                            ]
                        }
                    } else {
                        // if not AND this is the end of the groupedResults array
                        if(indexGrouped === (groupedResults.length-1)){
                            // then we add it to the groupedResults array at the end
                            groupedResults.push({
                                // indexQuery will always be 0 for this case?
                                type: originalResult.type, // TODO: no need for index here?
                                queryResults: originalResult.searchResults
                            })
                        }
                    }
                })
            }
        })
        // filter each type again to only include unique results
        let uniqueResults = groupedResults.map((groupedResult) => {
            let seen = new Set()
            const uniqueItems = groupedResult.queryResults.filter((groupedResult) => {
                const duplicate = seen.has((groupedResult._id).toString())
                seen.add((groupedResult._id).toString())
                return(!duplicate)
            })
            // we only return the result lists, since the filter type is not relevant anymore
            return(uniqueItems)
        })
        // we filter and spread uniqueResults, so it ONLY includes results present in all the arrays?
        // if only 1 type => no need to check overlap, we simply return list
        if(uniqueResults.length === 1) {
            processedResults = [...(uniqueResults[0])]
        } else if(uniqueResults.length > 1) {
            // if 2 or more => we check for all the overlapping ids
            let allIds = uniqueResults.map((uniqueItem, index) => {
                return(
                    uniqueItem.map((item) => {
                        return ((item._id).toString())
                    })
                )
            })
            const finalIds = (allIds[0]).filter(wordId => allIds.every(typeArray => typeArray.includes(wordId)))
            let checked = new Set()
            uniqueResults.forEach((uniqueItem, index) => {
                uniqueItem.forEach((item) => {
                    if (
                        (finalIds.includes((item._id).toString())) &&
                        !(checked.has((item._id).toString()))
                    ) {
                        checked.add((item._id).toString())
                        processedResults.push(item)
                    }
                })
            })
        }
    }
    const partsOfSpeech = new Set()
    // Filtering complete => setting up format to be displayed on table
    if((processedResults !== undefined) && (processedResults.length > 0)){
        processedResults.forEach((completeWord) => {
            // we must go through all the languages listed on "translations" and create simplified versions of each
            let simplifiedWord = {
                tags: completeWord.tags,
                partOfSpeech: completeWord.partOfSpeech,
                createdAt: completeWord.createdAt,
                updatedAt: completeWord.updatedAt,
                id: completeWord.id,
            }
            partsOfSpeech.add(completeWord.partOfSpeech)
            // from each translated language, we only retrieve the necessary data
            completeWord.translations.forEach((translation) => {
                simplifiedWord = {
                    ...simplifiedWord,
                    ...(getRequiredFieldsData(translation, completeWord.partOfSpeech)),
                    [getFieldName(translation.language)]: translation.cases.length
                }
            })
            wordsSimplified.push(simplifiedWord)
        })
    }
    const result = {
        amount: wordsSimplified.length, // the total amount of words saved for this user
        partsOfSpeechIncluded: Array.from(partsOfSpeech),
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

    // Make sure the logged-in user matches the word user
    if(word.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }
    res.status(200).json(word)
})

// @desc    Get Tags
// @route   GET /api/tags
// @access  Private
const getTags = asyncHandler(async (req, res) => {
    // first we get all tag arrays from stored words, where at least 1 matches the query
    const tags = await Word.find(
        {
            "tags": {$regex: `${req.query.query}`, $options: "i"},
            user: req.user.id
        },
        {
            tags: 1, _id: 0
        }
    )
    let filteredTags = new Set();
    // we iterate through all the arrays in tags, and from each we only retrieve the (unique) matching strings
    (tags).forEach((tagArray) => {
        (tagArray.tags).forEach((tagString) => {
            if(tagString.includes(req.query.query)){
                filteredTags.add(tagString)
            }
        })
    })
    // TODO: should we return this in the "FilterItem" format for tag?
    res.status(200).json(Array.from(filteredTags))
})

// @desc    Get Amount of items for a Tags
// @route   GET /api/tagsAmount
// @access  Private
const getAmountByTag = asyncHandler(async (req, res) => {
    const amountByTag = await Word.countDocuments(
        {
            "tags": {$regex: `${req.query.query}`, $options: "i"},
            user: req.user.id
        }
    )
    res.status(200).json(amountByTag)
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
        tags: req.body.tags,
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
                "caseName": {
                    $not: {$regex: "^gender", $options: "i"},
                    $not: {$regex: "^gradable", $options: "i"}
                }, // To avoid filtering by fields that don't represent translation-data
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
                            !(wordCase.caseName.match(/^gradable/i))
                            &&
                            (!found) // TODO: change this to a specific case? to always display the "easiest" case if multiple do match
                        ){
                            fullWord.push({
                                id: word.id,
                                language: translation.language,
                                partOfSpeech: word.partOfSpeech,
                                label: wordCase.word,
                                type: "word",
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
    getTags,
    getAmountByTag
}