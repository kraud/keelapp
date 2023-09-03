import {Lang, PartOfSpeech} from "../../ts/enums";
import {NounFormES} from "./nouns/NounFormES";
import {TranslationItem} from "../../ts/interfaces";
import React from "react";
import {NounFormEN} from "./nouns/NounFormEN";
import {NounFormDE} from "./nouns/NounFormDE";
import {NounFormEE} from "./nouns/NounFormEE";
import {AdjectiveFormEN} from "./adjectives/AdjectiveFormEN";
import {AdjectiveFormES} from "./adjectives/AdjectiveFormES";

interface WordFormSelectorProps {
    currentLang?: Lang,
    currentTranslationData: TranslationItem,
    partOfSpeech?: PartOfSpeech,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}

// returns the required form, depending on the selected language and part of speech
export function WordFormSelector(props: WordFormSelectorProps) {

    const getPartOfSpeechForm = () => {
        switch (props.partOfSpeech){
            case (PartOfSpeech.noun): {
                return(getNounForm())
            }
            case (PartOfSpeech.adjective): {
                return(getAdjectiveForm())
            }
            /* TODO: add remaining part of speech, as the forms are made */
            default: {
                return(<p>That part of speech is not available yet</p>)
            }
        }
    }

    const getAdjectiveForm = () => {
        switch (props.currentLang) {
            case (Lang.EN): {
                return(
                    <AdjectiveFormEN
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
                    <AdjectiveFormES
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

    const getNounForm = () => {
        switch (props.currentLang){
            case (Lang.EN): {
                return(
                    <NounFormEN
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
                    <NounFormES
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
                    <NounFormDE
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
                    <NounFormEE
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

    return(getPartOfSpeechForm())
}