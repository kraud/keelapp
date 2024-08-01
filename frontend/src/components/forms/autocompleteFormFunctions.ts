import {Lang, NounCases, VerbCases} from "../../ts/enums"
import {TranslationItem} from "../../ts/interfaces"

interface PartOfSpeechStructure {
    code: string
    value: string
}

interface MeaningStructure {
    definition: string
    partOfSpeech: PartOfSpeechStructure[]
    examples: string[]
    synonyms: string[]
}

interface WordFormStructure {
    inflectionType: string
    code: string
    morphValue: string
    value: string
}

interface SearchResultStructure {
    wordClasses: string[]
    wordForms: WordFormStructure[]
    meanings: MeaningStructure[]
    similarWords: string[]
}

interface TranslationStructure {
    from: string
    to: string
    input: string
    translations: string[]
}

interface WordSearchResultStructure {
    requestedWord: string
    estonianWord: string
    searchResult: SearchResultStructure[]
    translations: TranslationStructure[]
}

export type sanitizeDataStructureEENounResponse = {
    foundNoun: boolean,
} & (sanitizeDataStructureEENounResponseFound | sanitizeDataStructureEENounResponseNotFound)

type sanitizeDataStructureEENounResponseFound = {
    foundNoun: true,
    nounData: TranslationItem
}
type sanitizeDataStructureEENounResponseNotFound = {
    foundNoun: false,
}

const getWordFromWordFormsList = (wordFormList: WordFormStructure[], propertyNameInAPI: string): string => {
    const match = wordFormList.find(((wordFormItem: WordFormStructure) => {
        return(wordFormItem.code === propertyNameInAPI)
    }))
    return((match!!) ?match?.value :"")
}

const getShortFormEENounIfExist = (wordFormsList: WordFormStructure[]): string => {
    const shortFormsStringList: string = (getWordFromWordFormsList(wordFormsList,'SgAdt'))
    if(shortFormsStringList !== undefined){
        return(shortFormsStringList.split(',')[0])
    } else {
        return('-short form does not exist-')
    }
}

// from the API we receive too much data, so we take only what we're currently expecting to use
export const sanitizeDataStructureEENoun = (request: WordSearchResultStructure): sanitizeDataStructureEENounResponse => {
    if((request.searchResult.length > 0) && (request.searchResult[0].wordClasses[0] === 'noomen')){
        const formattedEENoun: TranslationItem = {
            language: Lang.EE,
            cases: [
                {
                    word: getWordFromWordFormsList(request.searchResult[0].wordForms,'SgN'),
                    caseName: NounCases.singularNimetavEE
                },
                {
                    word: getWordFromWordFormsList(request.searchResult[0].wordForms,'PlN'),
                    caseName: NounCases.pluralNimetavEE
                },
                {
                    word: getWordFromWordFormsList(request.searchResult[0].wordForms,'SgG'),
                    caseName: NounCases.singularOmastavEE
                },
                {
                    word: getWordFromWordFormsList(request.searchResult[0].wordForms,'PlG'),
                    caseName: NounCases.pluralOmastavEE
                },
                {
                    word: getWordFromWordFormsList(request.searchResult[0].wordForms,'SgP'),
                    caseName: NounCases.singularOsastavEE
                },
                {
                    word: getWordFromWordFormsList(request.searchResult[0].wordForms,'PlP'),
                    caseName: NounCases.pluralOsastavEE
                },
                {
                    word: getShortFormEENounIfExist(request.searchResult[0].wordForms),
                    caseName: NounCases.shortFormEE
                }
            ]
        }
        return({
            foundNoun: true,
            nounData: formattedEENoun
        })
    } else {
        return({
            foundNoun: false,
        })
    }
}

// TODO: could it be simplified to a single sanitized data structure for all?
export type sanitizeDataStructureESVerbResponse = {
    foundVerb: boolean,
} & (sanitizeDataStructureESVerbResponseFound | sanitizeDataStructureESVerbResponseNotFound)

type sanitizeDataStructureESVerbResponseFound = {
    foundVerb: true,
    verbData: TranslationItem
}
type sanitizeDataStructureESVerbResponseNotFound = {
    foundVerb: false,
}

interface VerbConjugation {
    indicative: {
        present: TenseConjugation
        imperfect: TenseConjugation
        preterite: TenseConjugation
        future: TenseConjugation
        perfect: TenseConjugation
        pluperfect: TenseConjugation
        futurePerfect: TenseConjugation
        preteritePerfect: TenseConjugation
    }
    subjunctive: {
        present: TenseConjugation
        'imperfect -ra': TenseConjugation
        'imperfect -se': TenseConjugation
        future: TenseConjugation
        perfect: TenseConjugation
        pluperfect: TenseConjugation
        futurePerfect: TenseConjugation
    }
    conditional: {
        present: TenseConjugation
        perfect: TenseConjugation
    }
    imperative: {
        affirmative: ImperativeConjugation
        negative: ImperativeConjugation
    }
}

interface TenseConjugation {
    singular: PersonConjugation
    plural: PersonConjugation
}

interface PersonConjugation {
    first: string
    second: string
    third: string
}

interface ImperativeConjugation {
    singular: {
        second: string
        third: string
    }
    plural: {
        first: string
        second: string
        third: string
    }
}

interface VerbESResponse {
    verbFound: boolean,
    verbData: VerbConjugation
}

// from the API we receive too much data, so we take only what we're currently expecting to use
export const sanitizeDataStructureESVerb = (request: VerbESResponse): sanitizeDataStructureESVerbResponse => {
    if(request.verbFound!!){
        const formattedESVerb: TranslationItem = {
            language: Lang.ES,
            cases: [
                {
                    word: request.verbData.indicative.present.singular.first,
                    caseName: VerbCases.indicativePresent1sES
                },
                {
                    word: request.verbData.indicative.present.singular.second,
                    caseName: VerbCases.indicativePresent2sES
                },
                {
                    word: request.verbData.indicative.present.singular.third,
                    caseName: VerbCases.indicativePresent3sES
                },
                {
                    word: request.verbData.indicative.present.plural.first,
                    caseName: VerbCases.indicativePresent1plES
                },
                {
                    word: request.verbData.indicative.present.plural.second,
                    caseName: VerbCases.indicativePresent2plES
                },
                {
                    word: request.verbData.indicative.present.plural.third,
                    caseName: VerbCases.indicativePresent3plES
                }
            ]
        }
        return({
            foundVerb: true,
            verbData: formattedESVerb
        })
    } else {
        return({
            foundVerb: false,
        })
    }
}