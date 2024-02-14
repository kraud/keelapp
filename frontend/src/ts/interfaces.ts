import {AdjectiveCases, AdverbCases, Lang, NounCases, PartOfSpeech} from "./enums";

export interface WordData {
    translations: TranslationItem[],
    partOfSpeech?: string,
    clue?: string,
    tags?: TagData[],
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

// part of form validation
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
    // TODO: add tag-relevant properties (check tagModel in BE)
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
// TODO: add other types as new notifications are created

type FriendRequestData = {
    variant: "friendRequest"
    content: {
        requesterId: string,
        requesterUsername: string,
    }
}

export type FriendshipData = {
    _id?: string,
    userIds: string[],
    usernames?: string[],
    status: 'pending' | 'accepted' | 'blocked',
    partnerships?: PartnershipsData[]
}

type PartnershipsData = {
    mentor: string,
    language: Lang
}

// Matches tagModel in BE
export type TagData = {
    _id?: string, // can be undefined when creating a new tag
    author: string,
    label: string,
    description: string,
    public: 'Public' | 'Private' | 'Friends-Only',
    wordsId?: string[]
} & (InternalStatus)

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
    requiresConfirmation?: boolean
    confirmationButtonLabel?: string
    cancellationButtonLabel?: string
}

export type FilterItem = {
    id: string,
    filterValue: string, // also the label that will be displayed
} & (CaseFilter | TagFilter | PartOfSpeechFilter)

type CaseFilter = {
    type: 'gender'
    caseName: NounCases | string,
    language: Lang,
}

type TagFilter = {
    type: 'tag'
    restrictiveArray?: TagData[], // info of each Tag that needs to be present at the same time, single FilterItem can be very restrictive
    additiveItem?: TagData, // single tag info - this way we can filter by many FilterItems in parallel and each one adds more results
}

type PartOfSpeechFilter = {
    type: 'PoS'
    partOfSpeech: PartOfSpeech,
}