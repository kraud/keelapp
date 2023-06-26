import {Lang, NounCases} from "./enums";

export interface WordData {
    translations: TranslationItem[],
    partOfSpeech?: string,
    clue?: string,
}
export interface TranslationItem {
    language: Lang,
    nounCases: NounItem[]
}
export interface NounItem {
    word: string,
    caseName: NounCases, // the type on noun stored in "word" property
}
