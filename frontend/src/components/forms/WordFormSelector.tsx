import {Lang, PartOfSpeech} from "../../ts/enums";
import {NounFormES} from "./nouns/NounFormES";
import {TranslationItem} from "../../ts/interfaces";
import React from "react";
import {NounFormEN} from "./nouns/NounFormEN";
import {NounFormDE} from "./nouns/NounFormDE";
import {NounFormEE} from "./nouns/NounFormEE";
import {AdjectiveFormEN} from "./adjectives/AdjectiveFormEN";
import {AdjectiveFormES} from "./adjectives/AdjectiveFormES";
import {AdjectiveFormDE} from "./adjectives/AdjectiveFormDE";
import {AdjectiveFormEE} from "./adjectives/AdjectiveFormEE";
import {AdverbFormEN} from "./adverbs/AdverbFormEN";
import {AdverbFormES} from "./adverbs/AdverbFormES";
import {AdverbFormDE} from "./adverbs/AdverbFormDE";

interface WordFormSelectorProps {
    currentLang?: Lang,
    currentTranslationData: TranslationItem,
    partOfSpeech?: PartOfSpeech,
    updateFormData: (formData: TranslationItem) => void
    displayFieldsAsText?: boolean
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
            case (PartOfSpeech.adverb): {
                return(getAdverbForm())
            }
            /* TODO: add remaining part of speech, as the forms are made */
            default: {
                return(<p>That part of speech is not available yet</p>)
            }
        }
    }

    const getAdverbForm = () => {
        switch (props.currentLang) {
            case (Lang.EN): {
                return(
                    <AdverbFormEN
                        currentTranslationData={props.currentTranslationData}
                        updateFormData={(formData: TranslationItem) => {
                            props.updateFormData(formData)
                        }}
                        displayOnly={props.displayFieldsAsText}
                    />
                )
            }
            case (Lang.ES): {
                return(
                    <AdverbFormES
                        currentTranslationData={props.currentTranslationData}
                        updateFormData={(formData: TranslationItem) => {
                            props.updateFormData(formData)
                        }}
                        displayOnly={props.displayFieldsAsText}
                    />
                )
            }
            case (Lang.DE): {
                return(
                    <AdverbFormDE
                        currentTranslationData={props.currentTranslationData}
                        updateFormData={(formData: TranslationItem) => {
                            props.updateFormData(formData)
                        }}
                        displayOnly={props.displayFieldsAsText}
                    />
                )
            }

            default: {
                return(<p>That language is not available yet</p>)
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
                        displayOnly={props.displayFieldsAsText}
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
                        displayOnly={props.displayFieldsAsText}
                    />
                )
            }
            case (Lang.DE): {
                return(
                    <AdjectiveFormDE
                        currentTranslationData={props.currentTranslationData}
                        updateFormData={(formData: TranslationItem) => {
                            props.updateFormData(formData)
                        }}
                        displayOnly={props.displayFieldsAsText}
                    />
                )
            }
            case (Lang.EE): {
                return(
                    <AdjectiveFormEE
                        currentTranslationData={props.currentTranslationData}
                        updateFormData={(formData: TranslationItem) => {
                            props.updateFormData(formData)
                        }}
                        displayOnly={props.displayFieldsAsText}
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
                        displayOnly={props.displayFieldsAsText}
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
                        displayOnly={props.displayFieldsAsText}
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
                        displayOnly={props.displayFieldsAsText}
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
                        displayOnly={props.displayFieldsAsText}
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