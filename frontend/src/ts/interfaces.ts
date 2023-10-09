import {AdjectiveCases, AdverbCases, Lang, NounCases, PartOfSpeech} from "./enums";

export interface WordData {
    translations: TranslationItem[],
    partOfSpeech?: string,
    clue?: string,
    tags?: string[],
}
export interface WordDataBE {
    id: string,
    translations: TranslationItem[],
    partOfSpeech?: string,
    clue?: string,
    tags?: string[],
}
export type TranslationItem = {
    language: Lang,
    cases: WordItem[]
} & (InternalStatus)

export type InternalStatus = {
    completionState?: boolean // used while completing forms, not saved on BE
    isDirty?: boolean // used while completing forms, not saved on BE
}

export interface WordItem {
    word: string,
    caseName: NounCases | AdjectiveCases | AdverbCases, // the type on noun stored in "word" property
}

export type SearchResult = {
    id: string,
    label: string,
} & (WordSearch | TagSearch | UserSearch)

type WordSearch = {
    type: "word"
    language: Lang,
    partOfSpeech: PartOfSpeech,
}

type TagSearch = {
    type: "tag"
}

type UserSearch = {
    type: "user",
    email: string,
    // eventually, add profile picture info
}