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

export interface PropsButtonData {
    id: string
    variant?: "contained" | "outlined" | "text"
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
    disabled?: boolean
    // TODO: add a calculateVisible, in case data needed to calculate if it should be displayed comes from where the button is being used
    // for situations where the data needed to calculate if it should be disabled comes from where the button is being used
    calculateDisabled?: (values: any) => boolean
    label?: string
    icon?: any
    onClick: any
    isVisible?: boolean
    displayBySelectionAmount?: (amountSelected: number) => boolean, // greater than number => display
}