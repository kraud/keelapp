import {AdjectiveCases, AdverbCases, NounCases, PartOfSpeech, VerbCases} from "../../ts/enums";
import {WordItem, TranslationItem} from "../../ts/interfaces";

export function getWordByCase(searchCase: NounCases | AdjectiveCases | AdverbCases | VerbCases, currentTranslationData: TranslationItem) {
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

// Used to obfuscate in-development functionalities in production environment, according to the current iteration
export const checkEnvironmentAndIterationToDisplay = (displayFromIterationNumber: number) => {
    const environment = process.env.REACT_APP_ENVIRONMENT_NAME
    const iteration = process.env.REACT_APP_ITERATION
    return(
        (environment === 'dev')
        ||
        (displayFromIterationNumber <= parseInt(iteration as string))
    )
}