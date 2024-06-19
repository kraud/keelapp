import {Lang, PartOfSpeech} from "../ts/enums";
import {
    FilterItem,
    FriendshipData,
    NotificationData,
    SearchResult,
    TagData,
    TranslationItem, UserData,
    WordDataBE
} from "../ts/interfaces";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";

export const getCurrentLangTranslated = (currentLang?: Lang) => {
    switch(currentLang) {
        case Lang.DE: {
            return ("Deutsch")
        }
        case Lang.EE: {
            return ("Eesti")
        }
        case Lang.EN: {
            return ("English")
        }
        case Lang.ES: {
            return ("Español")
        }
        default: return("Not Found")
    }
}

export const extractTagsArrayFromUnknownFormat = (originalArray: FilterItem[]) => {
    if(originalArray.length > 0){
        if(
            (originalArray[0].type === "tag") &&
            (originalArray[0].restrictiveArray !== undefined)
        ){
            // all tagsIds are stored on the first arrayItem (stackable filtering)
            return(originalArray[0].restrictiveArray)
        } else {
            // if not => each arrayItem has a tagId (additive filtering)
            const allItemsHaveAdditiveItem = originalArray.every((item: FilterItem) => {
                return(
                    (item.type === "tag") &&
                    (item.additiveItem !== undefined)
                )
            })
            if(allItemsHaveAdditiveItem){
                return(originalArray.map((arrayItem: FilterItem) => {
                    //@ts-ignore // NB! TS not recognizing allItemsHaveAdditiveItem? every arrayItem will have additiveItem
                    return(arrayItem.additiveItem!)
                }))
            } else {
                return([])
            }
        }
    } else {
        return([])
    }
}

export const checkEqualArrayContent = (original: unknown[], copy: unknown[]) => {
    let allIncluded = (original.length === copy.length)
    if (allIncluded){
        original.every((originalItem: unknown) => {
            allIncluded = copy.includes(originalItem) // TODO: this might not work with arrays of TagData?
            return allIncluded
        })
    }
    return allIncluded
}

export const getOtherUserDataFromFriendship = (friendship: FriendshipData, currentUserId: string) => {
    if(friendship.usersData !== undefined){
        const matchingUserData = (friendship.usersData).find((participant) => {
            return(participant._id !== currentUserId)
        })
        if(matchingUserData !== undefined){
            return(matchingUserData)
        } else {
            return({
                _id: "no-matching-id",
                name: 'no-matching-name',
                username: 'no-matching-username',
                email: 'no-matching-email',
                languages: [],
            })

        }
    } else {
        const matchingUserId = (friendship.userIds).filter((participantId) => {
            return(participantId !== currentUserId)
        })[0]
        return({
            _id: matchingUserId,
            name: 'no-name-available',
            username: 'no-username-available',
            email: 'no-email-available',
            languages: [],
        })
    }
}

export const userDataToSearchResultConversion = (userDataItem: UserData) => {
    return({
        id: userDataItem._id,
        type: "user"  as const,
        label: userDataItem.name,
        email: userDataItem.email,
        username: userDataItem.username,
        languages: userDataItem.languages
    })
}

export const searchResultToUserDataConversion = (searchResultItem: SearchResult) => {
    return({
        _id: searchResultItem.id,
        name: searchResultItem.label,
        // TODO: double check if this works
        ...(searchResultItem.type === 'user')
            ? {
                username: searchResultItem.username,
                email: searchResultItem.email,
            }
            : undefined
    })
}

function stringToColor(string: string) {
    if(string!!){
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    } else {
        return('black')
    }
}

export function stringAvatar(name: string, onlyOne?: "color"|"children") {
    let initials = ""
    const maxAmountInitials = 3
    const returnInitials = () => {
        if(name!! && name.length > 0){
            name.split(' ').forEach((word: string, index: number) => {
                if(maxAmountInitials > index){
                    initials = initials.concat((word)[0].toUpperCase())
                }
            })
            return(initials)
        } else {
            initials = '-'
        }
    }

    if(onlyOne !== undefined){
        switch (onlyOne){
            case("color"):{
                return({
                    sx: {
                        bgcolor: stringToColor(name),
                    }
                })
            }
            case("children"):{
                return({
                    children: returnInitials()
                })
            }
        }
    } else {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: returnInitials()
        }
    }
}

export const checkIfAlreadyFriend = (allFriendships: any [], potentialFriendId: string): (FriendshipData | undefined) => {
    return(
        allFriendships.find((friendship: FriendshipData) => {
            return(friendship.userIds.includes(potentialFriendId))
            // implied that currently-logged-in user's id is present in all locally-available friendships
            // friendship.userIds.includes(user._id)
        })
    )
}

export const getFriendRequestButtonLabel = (allFriendships: any[], potentialFriendId: string): 0|1|2|3  => {
    const friendship = checkIfAlreadyFriend(allFriendships, potentialFriendId)

    if(friendship === undefined){ // No friendship (yet!)
        // return('Add')
        return(0)
    } else {
        // There is a friendship and it's active
        if(friendship.status === 'accepted'){
            return(3) // 'Remove friend'
        } else {// There is a friendship and it's not confirmed yet
            if(friendship.userIds[0] === potentialFriendId){ // potentialFriend listed first => potentialFriend made the request (current user can accept)
                // return('Accept')
                return(1)
            } else { // currently logged-in user made the request => disable button? Cancel request?
                // return('Cancel')
                return(2)
            }
        }
    }
}

export const acceptFriendRequest = (
    notification: NotificationData,
    friendships: FriendshipData[],
    triggerDeleteNotification: (notificationId: string) => void,
    triggerUpdateNotification: (notificationData: {_id: string, status: 'pending' | 'accepted' | 'blocked'}) => void,
    triggerToasts?: () => void,
) => {
    const friendship = friendships.filter((friendship: FriendshipData) => {
        return(friendship.userIds[0] == notification.content.requesterId)
    })[0]
    if(friendship!){
        if(triggerToasts!!){
            triggerToasts()
        }
        triggerDeleteNotification(notification._id)
        if(friendship._id !== undefined){
            triggerUpdateNotification({
                _id: friendship._id,
                status: 'accepted'
            })
        }
    } else {
        toast.info('There was an error processing this request (no matching friendship request.')
    }
}

export const getAllIndividualTagDataFromFilterItem = (originalArray: FilterItem[]) => {
    let tagDataList = [] as TagData[]
    if(originalArray.length === 0){
        return([])
    } else {
        originalArray.forEach((item: FilterItem) => {
            if(
                (item.type === "tag") &&
                // if the element in the array is an additive item, then there's (usually) one or more items inside the array
                (item.additiveItem !== undefined)
            ){
                tagDataList.push(item.additiveItem)
            } else {
                if(
                    (item.type === "tag") &&
                    // if the element in the array is a restrictive array, then (usually?) it's the only item in the array
                    (item.restrictiveArray !== undefined)
                ){
                    tagDataList = item.restrictiveArray
                }
            }
        })
    }
    return(tagDataList)
}

// NB! This is only needed if we assume that completeWordInfo is an optional field. IT SHOULD BECOME A REQUIRED FIELD
export const getAllIndividualWordDataFromSearchResult = (originalArray: SearchResult[]) => {
    let wordDataList = [] as WordDataBE[]
    if(originalArray.length === 0){
        return([])
    } else {
        originalArray.forEach((item: SearchResult) => {
            if(
                (item.type === "word") &&
                (item.completeWordInfo !== undefined)
            ){
                wordDataList.push(item.completeWordInfo)
            }
        })
    }
    return(wordDataList)
}

export const getWordChipDataByLangInOrder = (word: WordDataBE, langPriorityList: Lang[]) => {
    let langDataFound = false
    let currentIndex: number = 0
    while(!langDataFound){
        const wordTranslation = word.translations.find((translation: TranslationItem) => {
            return(translation.language === langPriorityList[currentIndex]) // we look for the translation matching the most relevant language at this iteration
        })

        const currentPartOfSpeech = (word.partOfSpeech !== undefined)
            ? word.partOfSpeech as PartOfSpeech
            : PartOfSpeech.noun // we default to noun if nothing is there

        if(wordTranslation!!){ // if we found a match, we exit the loop
            langDataFound = true
            const displayLabel = getRequiredFieldsData(wordTranslation, currentPartOfSpeech)
            return({
                ...wordTranslation,
                displayLabel: displayLabel,
                //@ts-ignore // TODO: CHANGE WordDatBE to _id and fix where necessary
                wordId: word._id,
            })
        } else {
            if(currentIndex >= (langPriorityList.length -1)){
                // if no match is found, and we checked all the items in langPriorityList
                // => the word does not have a translation in any of the languages selected by the user.
                // Regardless, we return the fist item from the list
                const displayLabel = getRequiredFieldsData(word.translations[0], currentPartOfSpeech)
                return({
                    ...word.translations[0],
                    displayLabel: displayLabel,
                    //@ts-ignore // TODO: CHANGE WordDatBE to _id and fix where necessary
                    wordId: word._id,
                })
            } else {
                currentIndex = currentIndex+1 // if no match is found, we move to the next language and loop again
            }
        }
    }
}

const getRequiredFieldsData = (translation: TranslationItem, partOfSpeech: PartOfSpeech) => {
    //Fields depend on Part of Speech + Language
    switch (partOfSpeech){
        case ("Noun"): {
            switch (translation.language){
                case ("Estonian"): {
                    return(
                        (translation.cases.find(wordCase => (wordCase.caseName === 'singularNimetavEE')))!.word
                    )
                }
                case ("English"): {
                    return(
                        (translation.cases.find(wordCase => (wordCase.caseName === 'singularEN')))!.word
                    )
                }
                case ("Spanish"): {
                    return(
                        (translation.cases.find(wordCase => (wordCase.caseName === 'singularES')))!.word
                    )
                }
                case ("German"): {
                    return(
                        (translation.cases.find(wordCase => (wordCase.caseName === 'singularNominativDE')))!.word
                    )
                }
                default: {
                    return("- missing noun label -")
                }
            }
        }
        case ("Adverb"): {
            switch (translation.language){
                case ("English"): {
                    return(
                        (translation.cases.find(wordCase => (wordCase.caseName === 'adverbEN')))!.word
                    )
                }
                case ("Spanish"): {
                    return(
                        (translation.cases.find(wordCase => (wordCase.caseName === 'adverbES')))!.word
                    )
                }
                case ("German"): {
                    return(
                        (translation.cases.find(wordCase => (wordCase.caseName === 'adverbDE')))!.word
                    )
                }

                default: {
                    return("- missing adverb label -")
                }
            }
        }
        case ("Adjective"): {
            switch (translation.language){
                case ("English"): {
                    return(
                        (translation.cases.find(wordCase => (wordCase.caseName === 'positiveEN')))!.word
                    )
                }
                case ("Spanish"): {
                    return(
                        (translation.cases.find(wordCase => (wordCase.caseName === 'maleSingularES')))!.word
                    )
                }
                case ("German"): {
                    return(
                        (translation.cases.find(wordCase => (wordCase.caseName === 'positiveDE')))!.word
                    )
                }
                case ("Estonian"): {
                    return(
                        (translation.cases.find(wordCase => (wordCase.caseName === 'algvorreEE')))!.word
                    )
                }
                default: {
                    return("- missing adjective label -")
                }
            }
        }
        default: {
            return("Part of speech not found")
        }
    }
}

type FriendshipCase = {
    listType: 'Friendships',
    rawList: FriendshipData[],
    currentUserId: string,
}

type SearchResultCase = {
    listType: 'SearchResults',
    rawList: SearchResult[]
}

type GetListOfAvailableUsersInput = {
    selectedUsersList: SearchResult[]
    userIdsToIgnore: string[]
} & (FriendshipCase | SearchResultCase)

export const getListOfAvailableUsers = (inputData: GetListOfAvailableUsersInput) => {
    const selectedUsersId = inputData.selectedUsersList.map((userItem: SearchResult) => {
        return(userItem.id)
    })
    switch(inputData.listType){
        case "Friendships": {
            let availableFriendships: FriendshipData[] = []
            inputData.rawList.forEach((friendshipItem: FriendshipData) => {
                const otherUserInFriendship = getOtherUserDataFromFriendship(friendshipItem, inputData.currentUserId)
                if(
                    (!selectedUsersId.includes(otherUserInFriendship._id)) &&
                    (!inputData.userIdsToIgnore.includes(otherUserInFriendship._id))
                ){
                    availableFriendships.push(friendshipItem)
                }
            })
            return(availableFriendships)
        }
        case "SearchResults": {
            let availableUsers: SearchResult[] = []
            inputData.rawList.forEach((searchResultItem: SearchResult) => {
                if(
                    (!selectedUsersId.includes(searchResultItem.id)) &&
                    (!inputData.userIdsToIgnore.includes(searchResultItem.id))
                ){
                    availableUsers.push(searchResultItem)
                }
            })
            return(availableUsers)
        }
    }
}

export function getIntersectionBetweenLists (a: any[], b: any[]) {
    const setA = new Set(a);
    return b.filter((value: any) => setA.has(value));
}