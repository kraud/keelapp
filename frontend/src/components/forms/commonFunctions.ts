import {NounCases} from "../../ts/enums";
import {NounItem, TranslationItem} from "../../ts/interfaces";

export function getWordByCase(searchCase: NounCases, currentTranslationData: TranslationItem) {
    const returnValue = (currentTranslationData.cases).find((wordCase: NounItem) => {
        return (wordCase.caseName === searchCase)
    })
    if (returnValue === undefined) {
        return ("")
    } else {
        return (returnValue.word)
    }
}