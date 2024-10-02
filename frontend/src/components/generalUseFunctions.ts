import {
    AdjectiveCases,
    AdverbCases,
    EnglishPronouns, EstonianPronouns,
    GermanPronouns,
    Lang, NounCases,
    PartOfSpeech,
    Plurality,
    SpanishPronouns, VerbCases
} from "../ts/enums";
import {
    FilterItem,
    FriendshipData, InfoChipData,
    NotificationData,
    SearchResult,
    TagData,
    TranslationItem, UserData,
    WordDataBE
} from "../ts/interfaces";
import {toast} from "react-toastify";
import {NounCasesData, VerbCasesData, WordCasesData} from "../ts/wordCasesDataByPoS";

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

// When displaying an empty translation-form in a modal, we display the list of existing translations' base-case, for reference
// This uses as origin the data for a row from the main review-table
export const getListOfBasicCaseFromExistingTranslations = (word: any, langPriorityList: Lang[]) => {

    const basicCasesFromTranslationsInSelectedLanguages: string[] = []
    langPriorityList.forEach((selectedLang) => {
        // In a table row, the format for the data to be displayed on each cell is data+'2-char-country-code'
        const matchingTranslation = word[`data${Object.keys(Lang)[Object.values(Lang).indexOf(selectedLang)]}`]
        if(matchingTranslation!!){
            basicCasesFromTranslationsInSelectedLanguages.push(matchingTranslation)
        }
    })
    let formattedString = ''
    basicCasesFromTranslationsInSelectedLanguages.forEach((translationCase: string, index: number) => {
        switch(index){
            case(0): {
                formattedString = translationCase
                break
            }
            default: {
                formattedString = formattedString+'/'+translationCase
                break
            }
        }
    })
    return(formattedString)
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
        case ("Verb"): {
            switch (translation.language){
                case ("English"): {
                    return(
                        (translation.cases.find(wordCase => (wordCase.caseName === 'simplePresent1sEN')))!.word
                    )
                }
                case ("Spanish"): {
                    return(
                        (translation.cases.find(wordCase => (wordCase.caseName === 'infinitiveNonFiniteSimpleES')))!.word
                    )
                }
                case ("German"): {
                    return(
                        (translation.cases.find(wordCase => (wordCase.caseName === 'infinitiveDE')))!.word
                    )
                }
                case ("Estonian"): {
                    return(
                        (translation.cases.find(wordCase => (wordCase.caseName === 'infinitiveMaEE')))!.word
                    )
                }
                default: {
                    return("- missing verb label -")
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

export const waitDelay = (ms: number) => new Promise(res => setTimeout(res, ms))


let timerID: any

export function setTimerTriggerFunction(functionToRunAfterTimer: () => void, timer?: number) {
    clearTimeout(timerID)
    timerID = setTimeout(() => {
        functionToRunAfterTimer()
    }, (timer) ? timer :450)
}

export function getLangKeyByLabel(languageLabel: Lang){
    const match = Object.keys(Lang)[Object.values(Lang).indexOf(languageLabel)] as string
    return((match!!) ?match :"")
}

export function getPoSKeyByLabel(partOfSpeechLabel: PartOfSpeech){
    const match = Object.keys(PartOfSpeech)[Object.values(PartOfSpeech).indexOf(partOfSpeechLabel)] as string
    return((match!!) ?match :"")
}


// Helper function to shuffle array in-place
export function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function deterministicSort(array: string[]) {
    return array.sort((a: string, b: string) => {
        // Generate a simple hash based on the string characters
        const hashA = a.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hashB = b.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

        return hashA - hashB;
    })
}

export const getVerbPronoun = (personNumber: 1 | 2 | 3, plurality: Plurality, language: Lang): string => {
    const key = `${personNumber}${plurality === Plurality.S ? "S" : "P"}` as keyof typeof SpanishPronouns

    switch (language) {
        case Lang.ES:
            return SpanishPronouns[key]
        case Lang.EN:
            return EnglishPronouns[key]
        case Lang.DE:
            return GermanPronouns[key]
        case Lang.EE:
            return EstonianPronouns[key]
        default:
            return('missing language for pronoun')
    }
}

// TODO: some chips could display additional info in Tooltip on hover?
export const getChipFieldsByPoS = (
    relevantWordDetails: NounCasesData | VerbCasesData,
    currentPartOfSpeech: PartOfSpeech,
    translateFunction: (access: string, count: number) => string
) => {

    let returnList: InfoChipData[] = []
    switch(currentPartOfSpeech){
        case (PartOfSpeech.verb): {
            if (isVerbCasesData(relevantWordDetails)) {
                const verbData: VerbCasesData = relevantWordDetails; // Now TypeScript knows this is VerbCasesData
                if (verbData.isVerbProperty) { // is information about a conjugated verb
                    returnList = [
                        {
                            label: '-',
                            value: verbData.verbPropertyCategory,
                        },
                    ]
                } else { // is a conjugated verb
                    returnList = [
                        {
                            label: 'Type',
                            value: PartOfSpeech.verb,
                        },
                        {
                            label: 'person',
                            value: translateFunction('verbPersonCardinal.number', verbData.person),
                        },
                        {
                            label: 'plurality',
                            value: verbData.plurality, // TODO: translate (singular/plural) for all languages
                        },
                        {
                            label: 'tense',
                            value: verbData.tense, // TODO: translate for all languages (later)
                        },
                        ...(verbData.mood !== undefined)
                            ? [{ label: 'mood', value: verbData.mood}]
                            : [],
                    ]
                }
            }
            break
        }
        case (PartOfSpeech.noun): {
            if (isNounCasesData(relevantWordDetails)) {
                const nounData: NounCasesData = relevantWordDetails; // Now TypeScript knows this is NounCasesData
                if (nounData.isNounProperty) { // is information about a noun
                    returnList = [
                        {
                            label: '-',
                            value: nounData.nounPropertyCategory,
                        },
                    ]
                } else { // is a noun
                    returnList = [
                        {
                            label: 'Type',
                            value: PartOfSpeech.noun,
                        },
                        {
                            label: 'declination',
                            value: nounData.declination,
                        },
                        {
                            label: 'plurality',
                            value: nounData.plurality, // TODO: translate (singular/plural) for all languages
                        },
                    ]
                }
            }
            break
        }
        default: {

        }
    }
    return(returnList)
}


// Type guard for VerbCasesData
export const isVerbCasesData = (data: NounCasesData | VerbCasesData): data is VerbCasesData => {
    return (data as VerbCasesData).isVerbProperty !== undefined;
}

// Type guard for NounCasesData
export const isNounCasesData = (data: NounCasesData | VerbCasesData): data is NounCasesData => {
    return (data as NounCasesData).isNounProperty !== undefined;
}

export const getWordDescriptionElements = (relevantPoS: PartOfSpeech, relevantCaseName: NounCases | VerbCases | AdverbCases| AdjectiveCases) => {
    const currentRelevantPoSData: NounCasesData[] | VerbCasesData[] = WordCasesData[relevantPoS as string]
    // @ts-ignore
    const relevantWordDetails = (currentRelevantPoSData).find((currentPoSCaseList: NounCasesData | VerbCasesData) => {
        return(currentPoSCaseList.caseName === relevantCaseName)
    })
    return(relevantWordDetails)
}

export function interpolateColor(value: number) {
    // Ensure the value is between 0 and 1
    value = Math.max(0, Math.min(1, value));

    // Colors to interpolate between
    const startColor = { r: 0xd4, g: 0x12, b: 0x43 }; // #d41243
    const midColor = { r: 0xf4, g: 0x78, b: 0x35 };  // #f47835
    const endColor = { r: 0x8e, g: 0xc1, b: 0x27 };  // #8ec127

    let r, g, b;

    if (value <= 0.5) {
        // Interpolate between startColor and midColor
        const t = value * 2;
        r = Math.round(startColor.r + t * (midColor.r - startColor.r));
        g = Math.round(startColor.g + t * (midColor.g - startColor.g));
        b = Math.round(startColor.b + t * (midColor.b - startColor.b));
    } else {
        // Interpolate between midColor and endColor
        const t = (value - 0.5) * 2;
        r = Math.round(midColor.r + t * (endColor.r - midColor.r));
        g = Math.round(midColor.g + t * (endColor.g - midColor.g));
        b = Math.round(midColor.b + t * (endColor.b - midColor.b));
    }

    // Convert RGB to HEX format
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}