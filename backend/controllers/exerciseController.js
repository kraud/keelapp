var mongoose = require('mongoose')
const asyncHandler = require("express-async-handler")
const {getWordsIdFromFollowedTagsByUserId} = require("./intermediary/userFollowingTagController")
const Word = require("../models/wordModel")

// Format returned by 'findEquivalentTranslations'
// interface equivalentTranslationValues {
// 	multiLang: true, // boolean
// 	partOfSpeech: PartOfSpeech,
// 	translations : {
// 		itemA: {
// 			language: Lang,
// 			case: caseEnum-according-to-PoS,
// 			value: string,
// 		},
// 		itemB: {
// 			language: Lang,
// 			case: caseEnum-according-to-PoS,
// 			value: string,
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
};


// This functions receives:
// a single word, with all of its translations
// a list of the languages that are relevant to the user
// the corresponding grouped-categories relevant to the PoS of the word.
function findEquivalentTranslations(
    wordData,
    languages,
    groupedCategories
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

    // Iterate over each linguistic group (e.g., singular/plural for nouns, present/past for verbs)
    for (const group in groupedCategories) {
        const groupCategories = groupedCategories[group]

        // Iterate over each case within the group (e.g., nominative, accusative)
        for (const caseType in groupCategories) {
            // TODO: there should be a list of cases to ignore (gender, regularity, etc.)
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
                        equivalentValues.push({
                            partOfSpeech: wordData.partOfSpeech || "",  // Ensure partOfSpeech is used
                            matchingTranslations: {
                                itemA: {
                                    language: langA,
                                    case: languageCases[langA],
                                    value: itemA.word
                                },
                                itemB: {
                                    language: langB,
                                    case: languageCases[langB],
                                    value: itemB.word
                                }
                            }
                        });
                    }
                }
            }
        }
    }

    return equivalentValues;
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


// @desc    Creates exercises for a user based on parameters specified by them on FE
// @route   GET /api/exercises
// @access  Private
const getExercises = asyncHandler(async (req, res) => {
    const parameters = {
        ...req.query.parameters,
        amountOfExercises: parseInt(req.query.parameters.amountOfExercises, 10)
    }

    console.log('received parameters', parameters)

    // words related to other-users-tags, that the current user follows.
    const followedWordsId = await getWordsIdFromFollowedTagsByUserId(req.user.id)

    // word query should also filter by those that have at last 2 translations from the required by user (*)
    // (maybe 1 is ok too, if they are from Lang+PoS combo that can create exercises from single translation?)
    // const matchingWordData = await Word.find({
    //     $or: [
    //         {"user": mongoose.Types.ObjectId(req.user.id)},
    //         {"_id": {$in: followedWordsId}}
    //     ]
    // })

    const matchingWordData = await Word.find({
        $and:[
            {
                $or: [
                    {"user": mongoose.Types.ObjectId(req.user.id)},
                    {"_id": {$in: followedWordsId}}
                ]
            },
            {
                partOfSpeech: {
                    $in: parameters.partsOfSpeech
                }
            }
            // TODO: if there is a pre-selected list of words, all other parameters could/should be ignored?
        ]
    })

    let exercises = []
    matchingWordData // if words not pre-selected => this list could be too big, we should pre-filter by only candidates with real exercise-potential first(*)?
        .slice(0, parameters.amountOfExercises) // this should be a random selection
        .forEach((matchingWord) => {
        const matchingExercises = findEquivalentTranslations(
            matchingWord,
            parameters.languages,
            // ['German', 'Estonian'],
            getGroupedCategories(matchingWord.partOfSpeech)
        )
        exercises.push(...matchingExercises)
    })

    res.status(200).json(exercises) // before sending the data back, we should limit the amount according to parameters
})


module.exports = {
    getExercises,
}