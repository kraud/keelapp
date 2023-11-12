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
    type: "word",
    language: Lang,
    partOfSpeech: PartOfSpeech,
}

type TagSearch = {
    type: "tag"
}

type UserSearch = {
    type: "user",
    email: string,
    username: string,
    // eventually, add profile picture info
}

export type NotificationData = {
    _id: string,
    user: string,

    // Notification's state:
    // DISMISSED: false => not read => badge on avatar (initial state)
    // DISMISSED: true => read => NO badge on avatar (ignored, but NOT deleted)
    // if accepted => we delete notification
    dismissed: boolean,
} & FriendRequestData

type FriendRequestData = {
    variant: "friendRequest" // TODO: add other types as new notifications are created
    content: {
        requesterId: string,
        requesterUsername: string,
    }
}

export type FriendshipData = {
    _id?: string,
    userIds: string[],
    status: 'pending' | 'accepted' | 'blocked',
    partnerships?: PartnershipsData[]
}

type PartnershipsData = {
    mentor: string,
    language: Lang
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
    onClick: (values: unknown) => unknown // returns unknown instead of void, in case setSelectionOnClick is true => return value is what to set
    setSelectionOnClick?: boolean
    isVisible?: boolean
    displayBySelectionAmount?: (amountSelected: number) => boolean, // greater than number => display
}