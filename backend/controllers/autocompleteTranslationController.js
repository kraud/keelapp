const asyncHandler = require("express-async-handler")
// const conjugateVerb = require("../../node_modules/conjugator/lib/conjugateVerb.js")
const SpanishVerbs = require('spanish-verbs')
const SpanishGender = require('rosaenlg-gender-es');
const isWord = require('is-word')
const GermanVerbsLib = require('german-verbs')
const GermanWords = require('german-words');
const GermanVerbsDict = require('german-verbs-dict/dist/verbs.json')
const GermanWordsList = require('german-words-dict/dist/words.json');

// @desc    Get Spanish verb info by infinitive form
// @route   GET /api/autocompleteTranslations
// @access  Private
const getNounGenderES = asyncHandler(async (req, res) => {
    const spanishVerb = isWord('spanish')
    const getFullArticleES = (articleLetter) => {
        switch (articleLetter){
            case('f'):{
                return('la')
            }
            case('m'):{
                return('el')
            }
            default: {
                return('-')
            }
        }
    }

    if(spanishVerb.check(req.params.singularNominativeNoun)){
        const matchingGenderResponse = {
            language: 'Spanish',
            cases: [
                {
                    caseName: "genderES",
                    word: getFullArticleES(SpanishGender(req.params.singularNominativeNoun))
                }
            ]
        }
        res.status(200).json({foundNoun: true, nounData: matchingGenderResponse})
    } else {
        res.status(200).json({foundVerb: false})
    }

})

// @desc    Get Spanish verb info by infinitive form
// @route   GET /api/autocompleteTranslations
// @access  Private
const getVerbES = asyncHandler(async (req, res) => {
    const spanishVerb = isWord('spanish')

    // ---- TENSES ---------
    // INDICATIVE Col1 pdf
    // 'INDICATIVE_PRESENT',
    // 'INDICATIVE_IMPERFECT',
    // 'INDICATIVE_PERFECT',
    // 'INDICATIVE_FUTURE',
    // 'CONDITIONAL_PRESENT',
    // INDICATIVE Col2 pdf
    // 'INDICATIVE_PRETERITE_PERFECT',
    // 'INDICATIVE_PLUPERFECT',
    // 'INDICATIVE_PRETERITE',
    // 'INDICATIVE_FUTURE_PERFECT',
    // 'CONDITIONAL_PERFECT',

    // SUBJUNCTIVE Col1 pdf
    // 'SUBJUNCTIVE_PRESENT',
    // 'SUBJUNCTIVE_IMPERFECT_RA',
    // 'SUBJUNCTIVE_FUTURE',
    // SUBJUNCTIVE Col2 pdf
    // 'SUBJUNCTIVE_PERFECT',
    // 'SUBJUNCTIVE_PLUPERFECT',
    // 'SUBJUNCTIVE_FUTURE_PERFECT',

    // 'SUBJUNCTIVE_IMPERFECT_SE', ?

    // ---- PERSON ---------
    //  0 | 1 | 2 | 3 | 4 | 5
    // 0: ['first', 'singular'],
    // 1: ['second', 'singular'],
    // 2: ['third', 'singular'],
    // 3: ['first', 'plural'],
    // 4: ['second', 'plural'],
    // 5: ['third', 'plural'],

    if(spanishVerb.check(req.params.infinitiveVerb)){
        // this uses deprecated libraries, so it won't work when deployed in Vercel?
        // var verbResponse = conjugateVerb(req.params.infinitiveVerb, {style: 'rioplatense'})
        const verbResponse = {
            language: 'Spanish',
            cases: [
                {
                    // Infinitive is the same conjugation we use to make the request
                    word: req.params.infinitiveVerb,
                    caseName: "infinitiveNonFiniteSimpleES"
                },
                // TODO: the gerund is not found in any other conjugation, and is not regular, so for now we can't autocomplete it.
                // Maybe we could implement logic to create it ourselves following a pattern,
                // and pull the exceptions from storage, since it's a finite list.
                // (see here for more: https://es.wiktionary.org/wiki/Categor%C3%ADa:ES:Verbos_con_gerundio_irregular)
                // {
                //     word: '',
                //     caseName: "gerundNonFiniteSimpleES"
                // },
                {
                    // NB! Participle is used in compound conjugations, so we simply extract it to use it here.
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_PRETERITE_PERFECT', 0).split(' ')[1],
                    caseName: "participleNonFiniteSimpleES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_PRESENT', 0),
                    caseName: "indicativePresent1sES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_PRESENT', 1),
                    caseName: "indicativePresent2sES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_PRESENT', 2),
                    caseName: "indicativePresent3sES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_PRESENT', 3),
                    caseName: "indicativePresent1plES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_PRESENT', 4),
                    caseName: "indicativePresent2plES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_PRESENT', 5),
                    caseName: "indicativePresent3plES"
                }
            ]
        }
        res.status(200).json({foundVerb: true, verbData: verbResponse})
    } else {
        res.status(200).json({foundVerb: false})
    }

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
    } else {
        res.status(200).json({foundVerb: false})
    }
})

// @desc    Get German noun info by basic case form
// @route   GET /api/autocompleteTranslations
// @access  Private
const getNounDE = asyncHandler(async (req, res) => {
    const germanVerb = isWord('ngerman')
    const getFullArticleDE = (articleLetter) => {
        switch (articleLetter){
            case('F'):{
                return('die')
            }
            case('M'):{
                return('der')
            }
            case('N'):{
                return('das')
            }
            default: {
                return('-')
            }
        }
    }
    function capitalizeNoun(nounString) {
        if((nounString !== undefined) && (nounString.length > 1))
        return(nounString[0].toUpperCase() + nounString.slice(1))
    }
    const nounToAutocomplete = capitalizeNoun(req.params.singularNominativeNoun)
    if(germanVerb.check(nounToAutocomplete)){
        const nounResponse = {
            language: 'German',
            cases: [
                // TODO: we could use this getGenderGermanWord error to determine if word is NOT a noun
                //  => tell user to use other form, or input noun correctly
                {
                    caseName: "genderDE",
                    word: getFullArticleDE(GermanWords.getGenderGermanWord(null, GermanWordsList, nounToAutocomplete))
                },
                {
                    caseName: "singularNominativDE",
                    word: GermanWords.getCaseGermanWord(null, GermanWordsList, nounToAutocomplete, 'NOMINATIVE', 'S')
                },
                {
                    caseName: "pluralNominativDE",
                    word: GermanWords.getCaseGermanWord(null, GermanWordsList, nounToAutocomplete, 'NOMINATIVE', 'P')
                },
                {
                    caseName: "singularAkkusativDE",
                    word: GermanWords.getCaseGermanWord(null, GermanWordsList, nounToAutocomplete, 'ACCUSATIVE', 'S')
                },
                {
                    caseName: "pluralAkkusativDE",
                    word: GermanWords.getCaseGermanWord(null, GermanWordsList, nounToAutocomplete, 'ACCUSATIVE', 'P')
                },
                {
                    caseName: "singularGenitivDE",
                    word: GermanWords.getCaseGermanWord(null, GermanWordsList, nounToAutocomplete, 'GENITIVE', 'S')
                },
                {
                    caseName: "pluralGenitivDE",
                    word: GermanWords.getCaseGermanWord(null, GermanWordsList, nounToAutocomplete, 'GENITIVE', 'P')
                },
                {
                    caseName: "singularDativDE",
                    word: GermanWords.getCaseGermanWord(null, GermanWordsList, nounToAutocomplete, 'DATIVE', 'S')
                },
                {
                    caseName: "pluralDativDE",
                    word: GermanWords.getCaseGermanWord(null, GermanWordsList, nounToAutocomplete, 'DATIVE', 'P')
                },
            ]
        }

        res.status(200).json({foundNoun: true, nounData: nounResponse})
    } else {
        res.status(200).json({foundNoun: false})
    }
})

module.exports = {
    getVerbES,
    getNounGenderES,
    getVerbDE,
    getNounDE,
}