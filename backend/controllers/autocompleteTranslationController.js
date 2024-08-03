const asyncHandler = require("express-async-handler")
// const conjugateVerb = require("../../node_modules/conjugator/lib/conjugateVerb.js")
const SpanishVerbs = require('spanish-verbs')
const isWord = require('is-word')
const GermanVerbsLib = require('german-verbs')
const GermanVerbsDict = require('german-verbs-dict/dist/verbs.json')

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
        console.log("should be 'saltado'", SpanishVerbs.getConjugation('saltar', 'INDICATIVE_PRETERITE_PERFECT', 0).split(' ')[1])
        const verbResponse = {
            language: 'Spanish',
            cases: [
                {
                    // Infinitive is the same conjugation we use to make the request
                    word: req.params.infinitiveVerb,
                    caseName: "infinitiveNonFiniteSimpleES"
                },
                // TODO: the gerund is not found in any other conjugation is not regular, so for now we don't autocomplete it.
                // Maybe we could implement logic to create it ourselves following a pattern,
                // and pull the exceptions from storage, since it's a finite list.
                // (see here for more: https://es.wiktionary.org/wiki/Categor%C3%ADa:ES:Verbos_con_gerundio_irregular)
                // {
                //
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

module.exports = {
    getVerbES,
    getVerbDE,
}