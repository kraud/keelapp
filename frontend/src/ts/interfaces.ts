import {Lang, NounCases} from "./enums";

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
export interface TranslationItem {
    language: Lang,
    cases: NounItem[]
    completionState?: boolean // used while completing forms, not saved on BE
}
export interface NounItem {
    word: string,
    caseName: NounCases, // the type on noun stored in "word" property
}
