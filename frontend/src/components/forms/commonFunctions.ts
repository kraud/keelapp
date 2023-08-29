import {NounCases} from "../../ts/enums";
import {WordItem, TranslationItem} from "../../ts/interfaces";

export function getWordByCase(searchCase: NounCases, currentTranslationData: TranslationItem) {
    const returnValue = (currentTranslationData.cases).find((wordCase: WordItem) => {
        return (wordCase.caseName === searchCase)
    })
    if (returnValue === undefined) {
        return ("")
    } else {
        return (returnValue.word)
    }
}

// To determine exactly when to display the empty fields on a disabled language form
export function getDisabledInputFieldDisplayLogic(disabled: boolean, fieldValue: string) {
    return(
        (!disabled)
        ||
        (
            (disabled) && (fieldValue !== "")
        )
    )
}