import {AdjectiveCases, AdverbCases, Lang, NounCases} from "./enums";

export interface WordData {
    translations: TranslationItem[],
    partOfSpeech?: string,
    clue?: string,
}
export interface WordDataBE {
    id: string,
    translations: TranslationItem[],
    partOfSpeech?: string,
    clue?: string,
}
export type TranslationItem = {
    language: Lang,
    cases: WordItem[]
} & (InternalStatus)

type InternalStatus = {
    completionState?: boolean // used while completing forms, not saved on BE
    isDirty?: boolean // used while completing forms, not saved on BE
}

export interface WordItem {
    word: string,
    caseName: NounCases | AdjectiveCases | AdverbCases, // the type on noun stored in "word" property
}

export interface SearchResults {
    id: string,
    label: string,
    language: Lang,
}
