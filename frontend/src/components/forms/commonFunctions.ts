import {AdjectiveCases, AdverbCases, NounCases, PartOfSpeech} from "../../ts/enums";
import {WordItem, TranslationItem} from "../../ts/interfaces";

export function getWordByCase(searchCase: NounCases | AdjectiveCases | AdverbCases, currentTranslationData: TranslationItem) {
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

export function getPartOfSpeechAbbreviated(partOfSpeech: PartOfSpeech){
    switch (partOfSpeech){
        case("Noun"):{
            return("n.")
        }
        case("Pronoun"):{
            return("pron.")
        }
        case("Verb"):{
            return("v.")
        }
        case("Adjective"):{
            return("adj.")
        }
        case("Adverb"):{
            return("adv.")
        }
        case("Preposition"):{
            return("prep.")
        }
        case("Conjunction"):{
            return("conj.")
        }
        default: return("-")
    }
}