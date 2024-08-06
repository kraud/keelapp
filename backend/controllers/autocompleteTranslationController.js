const asyncHandler = require("express-async-handler")
const isWord = require('is-word')

// const conjugateVerb = require("../../node_modules/conjugator/lib/conjugateVerb.js")
const SpanishVerbs = require('spanish-verbs')
const SpanishGender = require('rosaenlg-gender-es')

const GermanVerbsLib = require('german-verbs')
const GermanWords = require('german-words')
const GermanVerbsDict = require('german-verbs-dict/dist/verbs.json')
const GermanWordsList = require('german-words-dict/dist/words.json')

const EnglishVerbs = require('english-verbs-helper');
const Irregular = require('english-verbs-irregular/dist/verbs.json');
const Gerunds = require('english-verbs-gerunds/dist/gerunds.json');
const EnglishVerbsData = EnglishVerbs.mergeVerbsData(Irregular, Gerunds);

// @desc    Get Spanish noun-gender info by singular-nominative form
// @route   GET /api/autocompleteTranslations
// @access  Private
const getNounGenderES = asyncHandler(async (req, res) => {
    const spanishNoun = isWord('spanish')
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
    // TODO: SpanishGender library can infer gender of words that isWord does not know, through grammatical rules.
    //  But SpanishGender also will always return either f or m, even if the word does not exist.
    //  We could include an additional field specifying "certainty" of autocomplete data,
    //  and inform the user when we are not 100% sure if it correct.
    const nounExists = spanishNoun.check(req.params.singularNominativeNoun)
    const matchingGenderResponse = {
        language: 'Spanish',
        cases: [
            {
                caseName: "genderES",
                word: getFullArticleES(SpanishGender(req.params.singularNominativeNoun))
            }
        ]
    }
    if(nounExists){
        res.status(200).json({foundNoun: true, nounData: matchingGenderResponse})
    } else {
        res.status(200).json({
            foundNoun: false,
            possibleMatch: true,
            nounData: matchingGenderResponse,
        })
    }

})

// @desc    Get Spanish verb info by infinitive form
// @route   GET /api/autocompleteTranslations
// @access  Private
const getVerbEN = asyncHandler(async (req, res) => {
    // TODO: maybe also check 'british-english'? To avoid mistakes from different spelling.
    const englishVerb = isWord('american-english')
    const extractVerb = (compoundVerbString) => {
        // compound verbs include "will" "would" in response => we only need conjugated verb
        return(
            compoundVerbString.split(' ')[1]
        )
    }
    // PRONOUNS
    // 0: I
    // 1: you (singular)
    // 2: he/she/it
    // 3: we
    // 4: you (plural)
    // 5: they

    // TENSES
    // -Simple
    // SIMPLE_PRESENT (or PRESENT)
    // SIMPLE_PAST (or PAST)
    // SIMPLE_FUTURE (or FUTURE)
    // -Progressive
    // PROGRESSIVE_PRESENT
    // PROGRESSIVE_PAST
    // PROGRESSIVE_FUTURE
    // -Perfect
    // PERFECT_PRESENT
    // PERFECT_PAST
    // PERFECT_FUTURE
    // -Perfect progressive
    // PERFECT_PROGRESSIVE_PAST
    // PERFECT_PROGRESSIVE_PRESENT
    // PERFECT_PROGRESSIVE_FUTURE

    if(englishVerb.check(req.params.infinitiveVerb)){
        // TODO: use this for 'progressive' and 'perfect progressive' tenses (-ing):
        // EnglishVerbs.getIngPart(EnglishVerbsData, 'swim')
        const verbResponse = {
            language: 'English',
            cases: [
                // Tense: SIMPLE
                // PRESENT
                {
                    caseName: 'simplePresent1sEN',
                    word: EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_PRESENT', 0)
                },
                {
                    caseName: 'simplePresent2sEN',
                    word: EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_PRESENT', 1)
                },
                {
                    caseName: 'simplePresent3sEN',
                    word: EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_PRESENT', 2)
                },
                {
                    caseName: 'simplePresent1plEN',
                    word: EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_PRESENT', 3)
                },
                {
                    caseName: 'simplePresent3plEN',
                    word: EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_PRESENT', 5)
                },
                // PAST
                {
                    caseName: 'simplePast1sEN',
                    word: EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_PAST', 0)
                },
                {
                    caseName: 'simplePast2sEN',
                    word: EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_PAST', 1)
                },
                {
                    caseName: 'simplePast3sEN',
                    word: EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_PAST', 2)
                },
                {
                    caseName: 'simplePast1plEN',
                    word: EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_PAST', 3)
                },
                {
                    caseName: 'simplePast3plEN',
                    word: EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_PAST', 5)
                },
                // FUTURE (auxiliary verb: 'will')
                {
                    caseName: 'simpleFuture1sEN',
                    word: extractVerb(EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_FUTURE', 0))
                },
                {
                    caseName: 'simpleFuture2sEN',
                    word: extractVerb(EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_FUTURE', 1))
                },
                {
                    caseName: 'simpleFuture3sEN',
                    word: extractVerb(EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_FUTURE', 2))
                },
                {
                    caseName: 'simpleFuture1plEN',
                    word: extractVerb(EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_FUTURE', 3))
                },
                {
                    caseName: 'simpleFuture3plEN',
                    word: extractVerb(EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_FUTURE', 5))
                },
                // CONDITIONAL (auxiliary verb: 'would')
                // NB! Both future and conditional tenses use the base form of the verb, but they use different auxiliary (helping) verbs.
                {
                    caseName: 'simpleConditional1sEN',
                    word: extractVerb(EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_FUTURE', 0))
                },
                {
                    caseName: 'simpleConditional2sEN',
                    word: extractVerb(EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_FUTURE', 1))
                },
                {
                    caseName: 'simpleConditional3sEN',
                    word: extractVerb(EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_FUTURE', 2))
                },
                {
                    caseName: 'simpleConditional1plEN',
                    word: extractVerb(EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_FUTURE', 3))
                },
                {
                    caseName: 'simpleConditional3plEN',
                    word: extractVerb(EnglishVerbs.getConjugation(EnglishVerbsData, req.params.infinitiveVerb, 'SIMPLE_FUTURE', 5))
                },
            ]
        }

        res.status(200).json({foundVerb: true, verbData: verbResponse})
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
    // 'INDICATIVE_PRETERITE',
    // 'INDICATIVE_FUTURE',
    // 'CONDITIONAL_PRESENT',
    // INDICATIVE Col2 pdf
    // 'INDICATIVE_PRETERITE_PERFECT',
    // 'INDICATIVE_PLUPERFECT',
    // 'INDICATIVE_PERFECT',
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
                // INDICATIVE - SIMPLE TIME - PRESENT
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
                },
                // INDICATIVE - SIMPLE TIME - PRET. IMPERFECT
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_IMPERFECT', 0),
                    caseName: "indicativeImperfectPast1sES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_IMPERFECT', 1),
                    caseName: "indicativeImperfectPast2sES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_IMPERFECT', 2),
                    caseName: "indicativeImperfectPast3sES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_IMPERFECT', 3),
                    caseName: "indicativeImperfectPast1plES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_IMPERFECT', 4),
                    caseName: "indicativeImperfectPast2plES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_IMPERFECT', 5),
                    caseName: "indicativeImperfectPast3plES"
                },
                // INDICATIVE - SIMPLE TIME - PRET. PERFECT
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_PRETERITE', 0),
                    caseName: "indicativePerfectSimplePast1sES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_PRETERITE', 1),
                    caseName: "indicativePerfectSimplePast2sES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_PRETERITE', 2),
                    caseName: "indicativePerfectSimplePast3sES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_PRETERITE', 3),
                    caseName: "indicativePerfectSimplePast1plES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_PRETERITE', 4),
                    caseName: "indicativePerfectSimplePast2plES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_PRETERITE', 5),
                    caseName: "indicativePerfectSimplePast3plES"
                },
                // INDICATIVE - SIMPLE TIME - FUTURE
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_FUTURE', 0),
                    caseName: "indicativeFuture1sES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_FUTURE', 1),
                    caseName: "indicativeFuture2sES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_FUTURE', 2),
                    caseName: "indicativeFuture3sES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_FUTURE', 3),
                    caseName: "indicativeFuture1plES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_FUTURE', 4),
                    caseName: "indicativeFuture2plES"
                },
                {
                    word: SpanishVerbs.getConjugation(req.params.infinitiveVerb, 'INDICATIVE_FUTURE', 5),
                    caseName: "indicativeFuture3plES"
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
    getVerbEN,
    getVerbES,
    getNounGenderES,
    getVerbDE,
    getNounDE,
}