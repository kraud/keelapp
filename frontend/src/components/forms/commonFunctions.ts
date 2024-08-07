import {
    AdjectiveCases,
    AdverbCases,
    AuxVerbDE,
    NounCases,
    PartOfSpeech, pronounDE,
    VerbCases,
    verbTensesIndicativeDE
} from "../../ts/enums";
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

// German auxiliary verbs:
export const seinPresentAndPastJSON = {
    present: {
        Sg1: 'bin',
        Sg2: 'bist',
        Sg3: 'ist',
        Pl1: 'sind',
        Pl2: 'seid',
        Pl3: 'sind',
    },
    past: {
        Sg1: 'war',
        Sg2: 'warst',
        Sg3: 'war',
        Pl1: 'waren',
        Pl2: 'wart',
        Pl3: 'waren',
    },
}
export const habenPresentAndPastJSON = {
    present: {
        Sg1: 'habe',
        Sg2: 'hast',
        Sg3: 'hat',
        Pl1: 'haben',
        Pl2: 'habt',
        Pl3: 'haben',
    },
    past: {
        Sg1: 'hatte',
        Sg2: 'hattest',
        Sg3: 'hatte',
        Pl1: 'hatten',
        Pl2: 'hattet',
        Pl3: 'hatten',
    },
}
export const werdenPresentAndPastJSON = {
    present: {
        Sg1: 'werde',
        Sg2: 'wirst',
        Sg3: 'wird',
        Pl1: 'werden',
        Pl2: 'werdet',
        Pl3: 'werden',
    },
    past: {
        Sg1: 'wurde',
        Sg2: 'wurdest',
        Sg3: 'wurde',
        Pl1: 'wurden',
        Pl2: 'wurden',
        Pl3: 'wurdet',
    },
}