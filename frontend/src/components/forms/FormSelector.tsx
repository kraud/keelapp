import {Lang, PartOfSpeech} from "../../ts/enums";
import {WordFormES} from "./WordFormES";
import {NounItem} from "../../ts/interfaces";
import React from "react";
import {WordFormEN} from "./WordFormEN";
import {WordFormDE} from "./WordFormDE";

interface FormSelectorProps {
    currentLang?: Lang,
    partOfSpeech?: PartOfSpeech,
    setTranslationStatus: (translationData: {
        language: Lang,
        isValidFormStatus: boolean
    }) => void // to inform parent component which language we are currently surveying and the status of the form
    updateTranslationList: (language: Lang, nounCases: NounItem[]) => void
}

export function FormSelector(props: FormSelectorProps) {


    const getLanguageForm = () => {
        switch (props.partOfSpeech){ // TODO: make this switch depend on the "PartOfSpeech", instead of language.
            case (PartOfSpeech.noun): {
                return(getNounForm())
            }
            /* TODO: add remaining cases as the forms are made */
            default: {
                return(<p>That part of speech is not available yet</p>)
            }
        }
    }

    const getNounForm = () => {
        switch (props.currentLang){
            case (Lang.EN): {
                return(
                    <WordFormEN
                        setCases={(casesList: NounItem[]) => {
                            // generic function to append language, list of NounItems and update parent
                            props.updateTranslationList(Lang.EN, casesList)
                        }}
                        setComplete = {(completionState) => {
                            props.setTranslationStatus({
                                language: Lang.EN,
                                isValidFormStatus:completionState
                            })
                        }}
                    />
                )
            }
            case (Lang.ES): {
                return(
                    <WordFormES
                        setCases={(casesList: NounItem[]) => {
                            // generic function to append language, list of NounItems and update parent
                            props.updateTranslationList(Lang.ES, casesList)
                        }}
                        setComplete = {(completionState) => {
                            props.setTranslationStatus({
                                language: Lang.ES,
                                isValidFormStatus:completionState
                            })
                        }}
                    />
                )
            }
            case (Lang.DE): {
                return(
                    <WordFormDE
                        setCases={(casesList: NounItem[]) => {
                            // generic function to append language, list of NounItems and update parent
                            props.updateTranslationList(Lang.DE, casesList)
                        }}
                        setComplete = {(completionState) => {
                            props.setTranslationStatus({
                                language: Lang.DE,
                                isValidFormStatus:completionState
                            })
                        }}
                    />
                )
            }
            /* TODO: add Forms for German and Estonian */
            default: {
                return(<p>That language is not available yet</p>)
            }
        }
    }

    return(
        <>
            {getLanguageForm()}
        </>
    )
}