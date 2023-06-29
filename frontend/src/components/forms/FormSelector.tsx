import {Lang, PartOfSpeech} from "../../ts/enums";
import {WordFormES} from "./WordFormES";
import {NounItem} from "../../ts/interfaces";
import React from "react";
import {WordFormEN} from "./WordFormEN";
import {WordFormDE} from "./WordFormDE";
import {WordFormEE} from "./WordFormEE";

interface FormSelectorProps {
    currentLang?: Lang,
    partOfSpeech?: PartOfSpeech,
    // setTranslationStatus: (translationData: {
    //     language: Lang,
    //     isValidFormStatus: boolean
    // }) => void // to inform parent component which language we are currently surveying and the status of the form
    // updateTranslationList: (language: Lang, nounCases: NounItem[]) => void
    updateFormData: (formData: {
        language: Lang,
        cases?: NounItem[],
        completionState?: boolean
    }) => void
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
                        // setCases={(casesList: NounItem[]) => {
                        //     // generic function to append language, list of NounItems and update parent
                        //     props.updateTranslationList(Lang.EN, casesList)
                        // }}
                        // setComplete = {(completionState) => {
                        //     props.setTranslationStatus({
                        //         language: Lang.EN,
                        //         isValidFormStatus:completionState
                        //     })
                        // }}
                        updateFormData={(formData: {
                            cases?: NounItem[],
                            completionState?: boolean
                        }) => {
                            props.updateFormData({
                                language: Lang.EN,
                                cases: formData.cases,
                                completionState: formData.completionState
                            })
                        }}
                    />
                )
            }
            case (Lang.ES): {
                return(
                    <WordFormES
                        // setCases={(casesList: NounItem[]) => {
                        //     // generic function to append language, list of NounItems and update parent
                        //     props.updateTranslationList(Lang.ES, casesList)
                        // }}
                        // setComplete = {(completionState) => {
                        //     props.setTranslationStatus({
                        //         language: Lang.ES,
                        //         isValidFormStatus:completionState
                        //     })
                        // }}
                        updateFormData={(formData: {
                            cases?: NounItem[],
                            completionState?: boolean
                        }) => {
                            props.updateFormData({
                                language: Lang.ES,
                                cases: formData.cases,
                                completionState: formData.completionState
                            })
                        }}
                    />
                )
            }
            case (Lang.DE): {
                return(
                    <WordFormDE
                        // setCases={(casesList: NounItem[]) => {
                        //     // generic function to append language, list of NounItems and update parent
                        //     props.updateTranslationList(Lang.DE, casesList)
                        // }}
                        // setComplete = {(completionState) => {
                        //     props.setTranslationStatus({
                        //         language: Lang.DE,
                        //         isValidFormStatus:completionState
                        //     })
                        // }}
                        updateFormData={(formData: {
                            cases?: NounItem[],
                            completionState?: boolean
                        }) => {
                            props.updateFormData({
                                language: Lang.DE,
                                cases: formData.cases,
                                completionState: formData.completionState
                            })
                        }}
                    />
                )
            }
            case (Lang.EE): {
                return(
                    <WordFormEE
                        // setCases={(casesList: NounItem[]) => {
                        //     // generic function to append language, list of NounItems and update parent
                        //     props.updateTranslationList(Lang.EE, casesList)
                        // }}
                        // setComplete = {(completionState) => {
                        //     props.setTranslationStatus({
                        //         language: Lang.EE,
                        //         isValidFormStatus:completionState
                        //     })
                        // }}
                        updateFormData={(formData: {
                            cases?: NounItem[],
                            completionState?: boolean
                        }) => {
                            props.updateFormData({
                                language: Lang.EE,
                                cases: formData.cases,
                                completionState: formData.completionState
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