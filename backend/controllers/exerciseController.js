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
        gender: {
            "Spanish": "genderES",
            "German": "genderDE",
        }
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
};


function findEquivalentTranslations(
    wordData,
    languages,
    groupedCategories
) {

    // Helper function to generate unique pairs of languages
    function getUniqueLanguagePairs(langs) {
        const pairs = [];
        for (let i = 0; i < langs.length; i++) {
            for (let j = i + 1; j < langs.length; j++) {
                pairs.push([langs[i], langs[j]]);
            }
        }
        return pairs
    }

    const availableLanguages = wordData.translations.map(t => t.language);
    // Get the intersection of the passed languages and the available languages in wordData
    const validLanguages = languages.filter(lang => availableLanguages.includes(lang));

    const languagePairs = getUniqueLanguagePairs(validLanguages)
    const equivalentValues = []

    // Iterate over each linguistic group (e.g., singular/plural for nouns, present/past for verbs)
    for (const group in groupedCategories) {
        const groupCategories = groupedCategories[group]

        // Iterate over each case within the group (e.g., nominative, accusative)
        for (const caseType in groupCategories) {
            const languageCases = groupCategories[caseType]

            // Now check each pair of languages for matching cases
            for (const [langA, langB] of languagePairs) {
                if (languageCases[langA] && languageCases[langB]) {
                    console.log('words', wordData)
                    const itemA = wordData.translations
                        .find(t => t.language === langA)
                        ?.cases.find(c => c.caseName === languageCases[langA]);

                    const itemB = wordData.translations
                        .find(t => t.language === langB)
                        ?.cases.find(c => c.caseName === languageCases[langB]);

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


// @desc    Creates exercises for a user based on parameters specified by them on FE
// @route   GET /api/exercises
// @access  Private
const getExercises = asyncHandler(async (req, res) => {
    const parameters = req.query.parameters

    // words related to other-users-tags, that the current user follows.
    const followedWordsId = await getWordsIdFromFollowedTagsByUserId(req.user.id)

    // word query should also filter by those that have at last 2 translations from the required by user (*)
    // (maybe 1 is ok too, if they are from Lang+PoS combo that can create exercises from single translation?)
    const matchingWordData = await Word.find({
        $or: [
            {"user": mongoose.Types.ObjectId(req.user.id)},
            {"_id": {$in: followedWordsId}}
        ]
    })

    let exercises = []
    matchingWordData // if words not pre-selected => this list could be too big, we should pre-filter by only candidates with real exercise-potential first(*)?
        .slice(0,6) // this should be a random selection
        .forEach((matchingWord) => {
        const matchingExercises = findEquivalentTranslations(
            matchingWord,
            // ['English', 'Spanish', 'German', 'Estonian'],
            ['German', 'Estonian'],
            nounGroupedCategories
        )
        exercises.push(...matchingExercises)
    })

    res.status(200).json(exercises) // before sending the data back, we should limit the amount according to parameters
})


module.exports = {
    getExercises,
}