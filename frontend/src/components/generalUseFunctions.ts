import {Lang} from "../ts/enums";
import {FilterItem, FriendshipData} from "../ts/interfaces";

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
    return(
        (originalArray.length > 0)
            ?
                (
                    (originalArray[0].type === "tag") &&
                    (originalArray[0].tagIds !== undefined) // if not => each arrayItem has a tagId (additive filtering)
                )
                    ? (originalArray[0].tagIds) // all tagsIds are stored on the first arrayItem (stackable filtering)
                    : (originalArray.map(arrayItem => arrayItem.filterValue))
            :
                []
    )
}

export const checkEqualArrayContent = (original: unknown[], copy: unknown[]) => {
    let allIncluded = (original.length === copy.length)
    if (allIncluded){
        original.every((originalItem: unknown) => {
            allIncluded = copy.includes(originalItem)
            return allIncluded
        })
    }
    return allIncluded
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