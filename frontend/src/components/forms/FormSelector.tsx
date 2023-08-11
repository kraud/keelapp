import {Lang, PartOfSpeech} from "../../ts/enums";
import {WordFormES} from "./WordFormES";
import {TranslationItem} from "../../ts/interfaces";
import React from "react";
import {WordFormEN} from "./WordFormEN";
import {WordFormDE} from "./WordFormDE";
import {WordFormEE} from "./WordFormEE";

interface FormSelectorProps {
    currentLang?: Lang,
    currentTranslationData: TranslationItem,
    partOfSpeech?: PartOfSpeech,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}

// TODO: should rename to FormLanguageSelector, since we set the Form for the selected language
export function FormSelector(props: FormSelectorProps) {


    const getLanguageForm = () => {
        switch (props.partOfSpeech){
            case (PartOfSpeech.noun): {
                return(getNounForm())
            }
            /* TODO: add remaining part of speech, as the forms are made */
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
                        currentTranslationData={props.currentTranslationData}
                        updateFormData={(formData: TranslationItem) => {
                            props.updateFormData(formData)
                        }}
                        displayOnly={props.displayOnly}
                    />
                )
            }
            case (Lang.ES): {
                return(
                    <WordFormES
                        currentTranslationData={props.currentTranslationData}
                        updateFormData={(formData: TranslationItem) => {
                            props.updateFormData(formData)
                        }}
                        displayOnly={props.displayOnly}
                    />
                )
            }
            case (Lang.DE): {
                return(
                    <WordFormDE
                        currentTranslationData={props.currentTranslationData}
                        updateFormData={(formData: TranslationItem) => {
                            props.updateFormData(formData)
                        }}
                        displayOnly={props.displayOnly}
                    />
                )
            }
            case (Lang.EE): {
                return(
                    <WordFormEE
                        currentTranslationData={props.currentTranslationData}
                        updateFormData={(formData: TranslationItem) => {
                            props.updateFormData(formData)
                        }}
                        displayOnly={props.displayOnly}
                    />
                )
            }
            default: {
                return(<p>That language is not available yet</p>)
            }
        }
    }

    return(getLanguageForm())
}