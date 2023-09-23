import {Lang} from "../ts/enums";
import {FilterItem} from "../features/words/wordSlice";

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