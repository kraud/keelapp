var mongoose = require('mongoose')
const asyncHandler = require("express-async-handler")
const {getWordsIdFromFollowedTagsByUserId} = require("./intermediary/userFollowingTagController")
const Word = require("../models/wordModel")

// Format returned by 'findEquivalentTranslations'
// interface EquivalentTranslationValues {
// 	multiLang: true, // boolean
// 	type: 'Multiple-Choice' | 'Text-Input' | 'Random',
// 	partOfSpeech: PartOfSpeech,
// 	matchingTranslations : {
// 		itemA: {
// 			language: Lang,
// 			case: caseEnum-according-to-PoS,
// 			value: string,
// 		},
// 		itemB: {
// 			language: Lang,
// 			case: caseEnum-according-to-PoS,
// 			value: string,
// 			otherValues: string[],
// 		}
// 	}
// }

// NB! It is important that any language-case (key-value) pair is on the third level of the JSON object,
// because the algorithm won't keep going down indefinitely
const nounGroupedCategories = {
    singular: {
        nominative: {
            "English": "singularEN",
            "Spanish": "singularES",
            "German": "singularNominativDE",
            "Estonian": "singularNimetavEE",
        },
        accusative: {
            "German": "singularAkkusativDE",
            "Estonian": "singularOsastavEE",
        },
        genitive: {
            "German": "singularGenitivDE",
            "Estonian": "singularOmastavEE",
        },
        dative: {
            "German": "singularDativDE",
        },
        // NB! We comment these out, because we can't compare genders directly between languages
        // (not all female nouns in Spanish are also female in German, for example).
        // We could make a special exercise case, where we pick both genders and both singular-nominative cases,
        // and display them on the exercise card?
        // gender: {
        //     "Spanish": "genderES",
        //     "German": "genderDE",
        // }
    },
    plural: {
        nominative: {
            "English": "pluralEN",
            "Spanish": "pluralES",
            "German": "pluralNominativDE",
            "Estonian": "pluralNimetavEE",
        },
        accusative: {
            "German": "pluralAkkusativDE",
            "Estonian": "pluralOsastavEE",
        },
        genitive: {
            "German": "pluralGenitivDE",
            "Estonian": "pluralOmastavEE",
        },
        dative: {
            "German": "pluralDativDE",
        }
    }
}

// NB! It is important that any language-case (key-value) pair is on the third level of the JSON object,
// because the algorithm won't keep going down indefinitely
const verbGroupedCategories = {
    present: {
        firstSingular: {
            "English": "simplePresent1sEN",
            "Spanish": "indicativePresent1sES",
            "German": "indicativePresent1sDE",
            "Estonian": "kindelPresent1sEE",
        },
        secondSingular: {
            "English": "simplePresent2sEN",
            "Spanish": "indicativePresent2sES",
            "German": "indicativePresent2sDE",
            "Estonian": "kindelPresent2sEE",
        },
        thirdSingular: {
            "English": "simplePresent3sEN",
            "Spanish": "indicativePresent3sES",
            "German": "indicativePresent3sDE",
            "Estonian": "kindelPresent3sEE",
        },
        firstPlural: {
            "English": "simplePresent1plEN",
            "Spanish": "indicativePresent1plES",
            "German": "indicativePresent1plDE",
            "Estonian": "kindelPresent1plEE",
        },
        thirdPlural: {
            "English": "simplePresent3plEN",
            "Spanish": "indicativePresent3plES",
            "German": "indicativePresent3plDE",
            "Estonian": "kindelPresent3plEE",
        }
    },
    past: {
        firstSingular: {
            "English": "simplePast1sEN",
            "Spanish": "indicativePerfectSimplePast1sES",
            "German": "indicativeSimplePast1sDE",
            "Estonian": "kindelSimplePast1sEE",
        },
        secondSingular: {
            "English": "simplePast2sEN",
            "Spanish": "indicativePerfectSimplePast2sES",
            "German": "indicativeSimplePast2sDE",
            "Estonian": "kindelSimplePast2sEE",
        },
        thirdSingular: {
            "English": "simplePast3sEN",
            "Spanish": "indicativePerfectSimplePast3sES",
            "German": "indicativeSimplePast3sDE",
            "Estonian": "kindelSimplePast3sEE",
        },
        firstPlural: {
            "English": "simplePast1plEN",
            "Spanish": "indicativePerfectSimplePast1plES",
            "German": "indicativeSimplePast1plDE",
            "Estonian": "kindelSimplePast1plEE",
        },
        thirdPlural: {
            "English": "simplePast3plEN",
            "Spanish": "indicativePerfectSimplePast3plES",
            "German": "indicativeSimplePast3plDE",
            "Estonian": "kindelSimplePast3plEE",
        }
    },
    future: {
        firstSingular: {
            "English": "simpleFuture1sEN",
            "Spanish": "indicativeFuture1sES",
            "German": "indicativeSimpleFuture1sDE",
        },
        secondSingular: {
            "English": "simpleFuture2sEN",
            "Spanish": "indicativeFuture2sES",
            "German": "indicativeSimpleFuture2sDE",
        },
        thirdSingular: {
            "English": "simpleFuture3sEN",
            "Spanish": "indicativeFuture3sES",
            "German": "indicativeSimpleFuture3sDE",
        },
        firstPlural: {
            "English": "simpleFuture1plEN",
            "Spanish": "indicativeFuture1plES",
            "German": "indicativeSimpleFuture1plDE",
        },
        thirdPlural: {
            "English": "simpleFuture3plEN",
            "Spanish": "indicativeFuture3plES",
            "German": "indicativeSimpleFuture3plDE",
        }
    }
}

// This function should return the amount required of exercises, by capturing them from as many different words as possible (randomly)
// function getRequiredAmountOfExercises(
//     exercisesByWord, // exercises are grouped by word
//     amountOfExercises,
// ) {
//
//     // These 2 boolean will never be both true simultaneously
//     const requireMultipleExercisesPerWord = amountOfExercises > (exercisesByWord.length)
//     const requireFewerExercisesPerWord = amountOfExercises < (exercisesByWord.length)
//     // NB! if requireMultipleExercisesPerWord & requireFewerExercisesPerWord both false => same amount exercises as words
//     let availableExercisesByWord = exercisesByWord // we will me removing items as we select them to be returned
//     let filteredExercises = []
//
//     // TODO:
//     //  if we need to return more than 1 per word (in case more exercises than words required)
//     //  Logic: if amount requested exercises > amount items in matchingWordData => we need more than 1 exercise from some words until we match both amounts
//     //  To do this, we'll get 1 exercise from each word first,
//     //  and on the next pass we pick a word at random and get another exercise from it until we get enough (same logic as if 'requireFewerExercisesPerWord' true)
//     if(requireMultipleExercisesPerWord){
//         // first-pass:
//         //      => we get one exercise per word => we can go through the full word-list in order (returned list will be shuffled before being returned)
//         //      => exercises inside will be chosen randomly (and removed from that list, so we don't pick it more than once)
//         // Nth-pass: (depending on 'amountOfExercises', we might need to do multiple passes through 'exercisesByWord' after the first pass, or maybe we won't even complete a second pass before matching 'amountOfExercises' and 'filteredExercises.length'
//         //      => word from list is selected randomly (to avoid always pulling from the first items)
//         //      => we get one exercise per word
//         //      => exercises inside will be chosen randomly (and removed from that list, so we don't pick it more than once)
//         //      => we stop when 'filteredExercises' length === 'amountOfExercises'
//         // NB! we should go through words sequentially, when in random order, so we get at least one exercise from each word before getting another from a previously used word
//     } else if(requireFewerExercisesPerWord){
//         //  TODO:
//         //   Alternative: if amount requested exercises < amount items in matchingWordData => not every word will return an exercise
//         //   Because of this, we'll select words at random and get 1 exercise from each one
//         // first-and-only-pass (same logic as Nth pass in 'requireMultipleExercisesPerWord: true'):
//         //      => word from list is selected randomly (to avoid always pulling from the first items)
//         //      => we get one exercise per word
//         //      => exercises inside will be chosen randomly (and removed from that list, so we don't pick it more than once)
//         //      => we stop when 'filteredExercises' length === 'amountOfExercises'
//
//     } else {
//         // same amount exercises as words => one exercise per word
//         // one pass => we get one translation per word (same logic as first-pass in 'requireMultipleExercisesPerWord: true')
//     }
//
//     return(filteredExercises)
// }


// Helper function to shuffle array in-place
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getRequiredAmountOfExercises(
    exercisesByWord, // exercises are grouped by word []
    amountOfExercises,
) {
    const requireMultipleExercisesPerWord = amountOfExercises > exercisesByWord.length;
    const requireFewerExercisesPerWord = amountOfExercises < exercisesByWord.length;

    let availableExercisesByWord = [...exercisesByWord]; // Clone to avoid mutating the original
    let filteredExercises = [];

    // Helper function to randomly select one exercise from each word group
    function randomlySelectExerciseByWord(exercisesList) {
        return exercisesList.map(word => {
            const randomIndex = Math.floor(Math.random() * word.exercises.length)
            const selectedExercise = word.exercises[randomIndex]
            word.exercises.splice(randomIndex, 1) // Remove the selected exercise
            return selectedExercise
        })
    }

    // Helper function for selecting exercises multiple times if needed
    function randomlySelectExercisesMultipleWords(availableExercisesByWord, neededAmount) {
        let selectedExercises = []
        let wordsInRandomOrder = [...availableExercisesByWord] // Clone the array
        while (selectedExercises.length < neededAmount) {
            shuffleArray(wordsInRandomOrder) // Shuffle the array for randomness
            selectedExercises.push(
                ...randomlySelectExerciseByWord(wordsInRandomOrder)
                    .slice(0, neededAmount - selectedExercises.length) // Ensure we don't overshoot
            )
            wordsInRandomOrder = wordsInRandomOrder.filter(word => word.exercises.length > 0) // Keep only words with remaining exercises
            if (wordsInRandomOrder.length === 0) break // Stop if no exercises left
        }
        return selectedExercises
    }

    // Main logic
    if (requireMultipleExercisesPerWord) {
        // Select one exercise per word first, then loop through randomly until reaching the required amount
        filteredExercises = randomlySelectExercisesMultipleWords(availableExercisesByWord, amountOfExercises)
    } else if (requireFewerExercisesPerWord) {
        // Select random exercises from randomly picked words, stopping when the required amount is reached
        shuffleArray(availableExercisesByWord); // Randomly shuffle word list
        filteredExercises = randomlySelectExerciseByWord(availableExercisesByWord)
            .slice(0, amountOfExercises) // Take as many as needed
    } else {
        // One exercise per word, equal number of exercises and words
        filteredExercises = randomlySelectExerciseByWord(availableExercisesByWord)
    }

    return filteredExercises
}

const getMCExercise = (itemA, itemB, partOfSpeech) => {
    return({
        partOfSpeech: partOfSpeech,
        type: "Multiple-Choice",
        matchingTranslations: {
            itemA: {
                language: itemA.language,
                case: itemA.case,
                value: itemA.value,
            },
            itemB: {
                language: itemB.language,
                case: itemB.case,
                value: itemB.value,
                otherValues: []
            }
        }
    })
}
const getTIExercise = (itemA, itemB, partOfSpeech) => {
    return({
        partOfSpeech: partOfSpeech,  // Ensure partOfSpeech is used
        type: "Text-Input",
        matchingTranslations: {
            itemA: {
                language: itemA.language,
                case: itemA.case,
                value: itemA.value,
            },
            itemB: {
                language: itemB.language,
                case: itemB.case,
                value: itemB.value
            }
        }
    })
}

const getFormattedExercise = (type, itemA, itemB, partOfSpeech) => {
    // Currently, the difference between the types is only 2 fields, but We create it this way
    // in case the format for the different type of exercises change a lot in the future
    switch(type) {
        case('Multiple-Choice'): {
            return(getMCExercise(itemA, itemB, partOfSpeech))
        }
        case('Text-Input'): {
            return(getTIExercise(itemA, itemB, partOfSpeech))
        }
        // TODO: potential additional type: 50%-50%?
        case('Random'): {
            const randomValue = (Math.floor(Math.random() * 10))%2
            if(randomValue === 1){
                return(getMCExercise(itemA, itemB, partOfSpeech))
            } else {
                return(getTIExercise(itemA, itemB, partOfSpeech))
            }
        }

        default: { // 'Other?'
            return({
                partOfSpeech: partOfSpeech, // Ensure partOfSpeech is used
                type: "Other",
                matchingTranslations: {
                    itemA: {
                        language: itemA.language,
                        case: itemA.case,
                        value: itemA.value,
                    },
                    itemB: {
                        language: itemB.language,
                        case: itemB.case,
                        value: itemB.value,
                    }
                }
            })
        }
    }
}

// This functions receives:
// a single word, with all of its translations
// a list of the languages that are relevant to the user
// the corresponding grouped-categories relevant to the PoS of the word.
// This functions returns all the possible exercises between the translations associated with this word
function findExercisesByEquivalentTranslations(
    wordData,
    languages,
    exerciseType //  'Multiple-Choice' | 'Text-Input' | 'Random',
) {

    // Helper function to generate unique pairs of languages.
    // This must be done at a word-level because each one might have a different set of available languages,
    // depending on the translations assigned to it.
    function getUniqueLanguagePairs(langs) {
        const pairs = [];
        for (let i = 0; i < langs.length; i++) {
            for (let j = i + 1; j < langs.length; j++) {
                pairs.push([langs[i], langs[j]]);
            }
        }
        return pairs
    }

    // First, we get ALL stored languages per word
    const availableLanguages = wordData.translations.map(t => t.language);
    // Get the intersection of the user-required languages and the languages stored in wordData.translations
    const validLanguages = languages.filter(lang => availableLanguages.includes(lang))
    // Now we calculate all the possible unique pairs of the intersection-languages
    const languagePairs = getUniqueLanguagePairs(validLanguages)
    const equivalentValues = []

    // TODO: we currently only have groupedCategories for pairs of languages,
    //  we need to to create groupedCategories for single-translation exercises as well,
    //  this way we can create better exercises when answers are multiple-choice in PoS like Nouns (which in Spanish/English only have 2 fields)
    const groupedCategories = getGroupedCategories(wordData.partOfSpeech)

    // Iterate over each linguistic group (e.g., singular/plural for nouns, present/past for verbs)
    for (const group in groupedCategories) {
        const groupCategories = groupedCategories[group]

        // Iterate over each case within the group (e.g., nominative, accusative)
        for (const caseType in groupCategories) {
            // TODO: there should be a list of cases to ignore (gender, regularity, etc.) => simply do not include them in groupedCategories object
            const languageCases = groupCategories[caseType]

            // Now check each pair of languages for matching cases
            for (const [langA, langB] of languagePairs) {
                if (languageCases[langA] && languageCases[langB]) {
                    const itemA = wordData.translations
                        .find(t => t.language === langA)
                        ?.cases.find(c => c.caseName === languageCases[langA])

                    const itemB = wordData.translations
                        .find(t => t.language === langB)
                        ?.cases.find(c => c.caseName === languageCases[langB])

                    // If both languages have a matching word for this case, add to results
                    if (itemA && itemB) {
                        const dataItemA = {
                            language: langA,
                            case: languageCases[langA],
                            value: itemA.word
                        }
                        const dataItemB = {
                            language: langB,
                            case: languageCases[langB],
                            value: itemB.word
                        }
                        equivalentValues.push(
                            getFormattedExercise(
                                exerciseType,
                                dataItemA,
                                dataItemB,
                                wordData.partOfSpeech || ""
                            )
                        )
                    }
                }
            }
        }
    }

    return equivalentValues
}

const getGroupedCategories = (partOfSpeech) => {
    switch(partOfSpeech) {
        case('Noun'): {
            return(nounGroupedCategories)
        }
        case('Verb'): {
            return(verbGroupedCategories)
        }
        default: {
            return({})
        }
    }
}

// Some cases stored in a TranslationItem.cases are not relevant to a Multiple-Choice exercise (like those related to noun-gender, or verb-regularity for example),
// so we use this function to filter them according to different parameters
// potentialCase: string
const calculateIfNotRelevantCase = (potentialCase) => {
    let ignore = false
    if(
        (potentialCase.startsWith('gender')) // nouns[ES || DE]
        ||
        (potentialCase.startsWith('gradable')) // adverbs[DE]
        ||
        (potentialCase.startsWith('regularity')) // verbs[EN || ES ]
        ||
        (potentialCase.startsWith('auxVerb')) // verbs[DE]
        ||
        (potentialCase.startsWith('caseType')) // verbs[DE]
        ||
        (potentialCase.startsWith('prefix')) // verbs[DE]
    ){
        ignore = true
    }
    return(ignore)
}

const isOriginalValueFromThisTranslation = (fullListOfCases, originalCase, originalValue) => {
    return(
        fullListOfCases.some((caseRelatedToTranslation) => {
            return(
                (caseRelatedToTranslation.caseName === originalCase) &&
                (caseRelatedToTranslation.word === originalValue)
            )
        })
    )
    // console.log('listOfCasesRelatedToTranslation', listOfCasesRelatedToTranslation)
    // console.log('originalCase', originalCase)
    // console.log('check if included', listOfCasesRelatedToTranslation.includes(originalCase))
    // console.log('===============================')
    // return(listOfCasesRelatedToTranslation.includes(originalCase))
}

// This will always find other words that match the language for a Multiple-Choice-type exercise, IF THE OPTIONS EXIST. If not, the list will return as many options as available.
const getOtherValues = (targetLanguage, originalValue, originalCase, allMatchingWords, dataOrigin, requiredAmount) => {
    switch (dataOrigin){
        case('matching-words'): {
            // we use 'allMatchingWords' as source of other options
            const shuffledMatchingWords = [...allMatchingWords]
            shuffleArray(shuffledMatchingWords) // this should guarantee that we won't be getting the same words in the "other-options" for different exercises
            let requiredTranslations = []
            shuffledMatchingWords.forEach((matchingWord) => {
                // let breakFromWords = false
                if(requiredAmount > requiredTranslations.length){
                    (matchingWord.translations).forEach((matchingWordTranslation) => {
                        let breakFromTranslations = false
                        if(!breakFromTranslations){
                            if(matchingWordTranslation.language === targetLanguage){
                                // TODO: if we want to force matching Part of Speech, it should be added here
                                let keepSearching = true
                                let count = 0
                                while(keepSearching && (count < 25)){ // to avoid potential infinite loop, we add a max amount of random checks
                                    const randomCaseIndex = Math.floor(Math.random() * matchingWordTranslation.cases.length)
                                    const potentialWord = matchingWordTranslation.cases[randomCaseIndex].word
                                    const potentialCase = matchingWordTranslation.cases[randomCaseIndex].caseName
                                    // to avoid including the 'correct-option' in the other options
                                    // and to avoid including any other case from the translation related to originalValue
                                    const sameTranslationOriginAsOriginalValue = isOriginalValueFromThisTranslation(matchingWordTranslation.cases, originalCase, originalValue)
                                    const ignoreWord = (
                                        calculateIfNotRelevantCase(potentialCase)
                                        ||
                                        sameTranslationOriginAsOriginalValue
                                    )
                                    if(!ignoreWord){ // to avoid matching with gender-related-cases or other word-properties
                                        requiredTranslations.push(potentialWord)
                                        keepSearching = false // this should break from the while
                                    } else {
                                        // to avoid infinite loop in case translation has only one case stored (which is the same as the 'correct-option' for this Multiple-Choice exercise).
                                        if(matchingWordTranslation.cases.length === 1){
                                            // this should break from the while
                                            keepSearching = false
                                        } else {
                                            count++
                                        }
                                    }
                                }
                                breakFromTranslations = true // this should break from '(matchingWord.translations).forEach(...)' and continue next matchingWord
                            }
                        }
                    })
                }
            })
            return(requiredTranslations)
        }
        case('all-available-words'): {
            // we use 'allMatchingWords' as source of other options
            // TODO: implement logic making query to BE for the required data for this exercise
            return([])
        }
    }
}

const getMissingDataForMCExercises = (incompleteExercises, allMatchingWords, dataOrigin) => {
    // const additionalOptionsByLanguageRequired = [] //  AdditionalOptionsRequired[]
    // const additionalValues = getOptionalValuesFromWordsMatchingParameters(matchingWordData, additionalOptionsByLanguageRequired)
    // const mergedListOfExercises = mergeExercisesWithAdditionalValues(matchingWordData, additionalValues)

    // let exercisesWithFullData = [...incompleteExercises]
    // incomplete exercises, that we'll iterate over and improve the ones that are missing data (Multiple-Choice).
    // Not all items will be Multiple-Choice, in case user selected 'All' type, where each item is either 'Text-Input' or 'Multiple-Choice' at random.
    let exercisesWithFullData = incompleteExercises.map((exercise) => {
        if(exercise.type === 'Multiple-Choice'){
            return({
                ...exercise,
                matchingTranslations: {
                    ...exercise.matchingTranslations,
                    itemB: {
                        ...exercise.matchingTranslations.itemB,
                        otherValues: getOtherValues(
                            exercise.matchingTranslations.itemB.language,
                            exercise.matchingTranslations.itemB.value,
                            exercise.matchingTranslations.itemB.case,
                            allMatchingWords,
                            dataOrigin,
                            2 // TODO: this should be a parameter
                        )
                    }
                }
            })
        } else { // if it's not Multiple-Choice => exercise is complete => store it in list
            return(exercise)
        }
    })
    return(exercisesWithFullData)
}


// @desc    Creates exercises for a user based on parameters specified by them on FE
// @route   GET /api/exercises
// @access  Private
const getExercises = asyncHandler(async (req, res) => {
    // const parameters = req.query.parameters.parameters
    const parameters = {
        ...req.query.parameters,
        amountOfExercises: parseInt(req.query.parameters.amountOfExercises, 10)
    }

    // words related to other-users-tags, that the current user follows.
    const followedWordsId = await getWordsIdFromFollowedTagsByUserId(req.user.id)


    // If the user pre-selected words to create exercises => we'll not check for any other words
    const getWordFilterQuery = (parametersIncludePreselectWords) => {
        if(parametersIncludePreselectWords){
            return({
                _id: {
                    $in: parameters.preSelectedWords
                }
            })
        } else {
            return({
                $or: [
                    {"user": mongoose.Types.ObjectId(req.user.id)},
                    {"_id": {$in: followedWordsId}}
                ]
            })
        }
    }
    const preSelectedWordsIncludedInParameters = (parameters.preSelectedWords !== undefined) && (parameters.preSelectedWords.length > 0)
    // word query should also filter by those that have at last 2 translations from the required by user (*)
    // (maybe 1 is ok too, if they are from Lang+PoS combo that can create exercises from single translation?)
    const matchingWordData = await Word.find({
        $and:[
            getWordFilterQuery(preSelectedWordsIncludedInParameters),
            {
                partOfSpeech: {
                    $in: parameters.partsOfSpeech
                }
            }
            // could we check here if there is overlap of at least 1 language with the ones in parameters and filter accordingly?
        ]
    })


    let exercisesByWord = []
    matchingWordData // if words not pre-selected => this list could be too big, we should pre-filter by only candidates with real exercise-potential first(*)?
        .forEach((matchingWord) => {
            const matchingExercisesPerWord = findExercisesByEquivalentTranslations(
                matchingWord,
                parameters.languages,
                parameters.type,
            )
            // If we found exercises for that word, we save them, and we'll filter them later
            if(matchingExercisesPerWord.length > 0){
                exercisesByWord.push({
                    _id: matchingWord._id,
                    exercises: matchingExercisesPerWord // EquivalentTranslationValues[]
                })
            }
        })
    let filteredExercises = getRequiredAmountOfExercises(exercisesByWord, parameters.amountOfExercises)
    if(['Multiple-Choice', 'Random'].includes(parameters.type)){
        const exercisesWithMCData = getMissingDataForMCExercises(
            filteredExercises,
            matchingWordData,
            // TODO: this should be optional if the user wants to only use words that match the parameters, or the full list of words they have stored in their account
            'matching-words' // 'matching-words' | 'all-available-words' TODO: should be a parameter
        )
        res.status(200).json(exercisesWithMCData)
    } else { // type: 'Text-Input' => no need to add additional options
        res.status(200).json(filteredExercises)
    }
})

module.exports = {
    getExercises,
}