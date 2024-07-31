import {Lang, NounCases} from "../../ts/enums";
import {TranslationItem} from "../../ts/interfaces";

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
    wordData: TranslationItem
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
            wordData: formattedEENoun
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
    wordData: TranslationItem
}
type sanitizeDataStructureESVerbResponseNotFound = {
    foundVerb: false,
}

// from the API we receive too much data, so we take only what we're currently expecting to use
export const sanitizeDataStructureESVerb = (request: any): sanitizeDataStructureESVerbResponse => {
    if('condition'){ // TODO: depending on response structure add condition here (should it be done on BE?)
        const formattedESVerb: TranslationItem = {
            language: Lang.ES,
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
            foundVerb: true,
            wordData: formattedESVerb
        })
    } else {
        return({
            foundVerb: false,
        })
    }
}