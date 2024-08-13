import {
    AdjectiveCases,
    AdverbCases,
    NounCases,
    PartOfSpeech, PrefixesVerbDE,
    VerbCases, VerbCaseTypeDE,
} from "../../ts/enums";
import {WordItem, TranslationItem} from "../../ts/interfaces";
import {CheckboxItemData} from "../CheckboxGroupFormHook";

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

// we can't store a list of type-cases inside "word" property in a TranslationItem
// => we make it into an acronym to store and reverse the process when retrieving
export const getAcronymFromVerbCaseTypes = (selectedCases: CheckboxItemData[]) => {
    let acronym = ''
    selectedCases.map((selectedCase: CheckboxItemData, index: number) => {
        switch (selectedCase.value){
            case(VerbCaseTypeDE.accusativeDE):{
                acronym +="A"
                break
            }
            case(VerbCaseTypeDE.dativeDE):{
                acronym +="D"
                break
            }
            case(VerbCaseTypeDE.genitiveDE):{
                acronym +="G"
                break
            }
            default: acronym +="*"
        }
        // if not the last item => we add a separator
        if(index < (selectedCases.length-1)){
            acronym +="-"
        }
    })
    return(acronym)
}

// we can't store a list of type-cases inside "word" property in a TranslationItem
// => we make it into an acronym to store and reverse the process when retrieving
export const getVerbCaseTypesFromAcronym = (acronym: string) => {
    let casesObjects: CheckboxItemData[] = []
    if(acronym.length > 0){
        const extractedCases = acronym.split('-')
        extractedCases.map((caseLetter: string, index: number) => {
            switch (caseLetter){
                case("A"):{
                    casesObjects.push({label: 'Accusative', value: VerbCaseTypeDE.accusativeDE})
                    break
                }
                case("D"):{
                    casesObjects.push({label: 'Dative', value: VerbCaseTypeDE.dativeDE})
                    break
                }
                case("G"):{
                    casesObjects.push({label: 'Genitive', value: VerbCaseTypeDE.genitiveDE})
                    break
                }
                default:{
                    casesObjects.push({label: 'error', value: VerbCaseTypeDE.accusativeDE})
                    break
                }
            }
        })
    }
    return(casesObjects)
}

export type CheckForPatternResponse = {
    detected: boolean,
    prefixCase: PrefixesVerbDE | ""
}
export const checkForPatternPrefixDE = (infinitiveVerbDE: string): CheckForPatternResponse => {
    for (const prefix of Object.values(PrefixesVerbDE)) {
        if (infinitiveVerbDE.startsWith(prefix)) {
            return {
                detected: true,
                prefixCase: prefix as PrefixesVerbDE
            }
        }
    }

    return {
        detected: false,
        prefixCase: ""
    }
}
