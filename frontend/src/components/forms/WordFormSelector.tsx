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
import {VerbFormES} from "./verbs/VerbFormES";
import {VerbFormEN} from "./verbs/VerbFormEN";
import {VerbFormEE} from "./verbs/VerbFormEE";
import {VerbFormDE} from "./verbs/VerbFormDE";
import {useTranslation} from "react-i18next";

interface WordFormSelectorProps {
    currentLang?: Lang,
    currentTranslationData: TranslationItem,
    partOfSpeech?: PartOfSpeech,
    updateFormData: (formData: TranslationItem) => void
    displayFieldsAsText?: boolean
}

// returns the required form, depending on the selected language and part of speech
export function WordFormSelector(props: WordFormSelectorProps) {
    const { t } = useTranslation(['wordRelated'])

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
            case (PartOfSpeech.verb): {
                return(getVerbForm())
            }
            /* TODO: add remaining part of speech, as the forms are made */
            default: {
                return(<p>{t('wordFormSelector.partOfSpeechNotAvailable', {ns: 'wordRelated'})}</p>)
            }
        }
    }

    const getVerbForm = () => {
        switch (props.currentLang) {
            case (Lang.ES): {
                return(
                    <VerbFormES
                        currentTranslationData={props.currentTranslationData}
                        updateFormData={(formData: TranslationItem) => {
                            props.updateFormData(formData)
                        }}
                        displayOnly={props.displayFieldsAsText}
                    />
                )
            }
            case (Lang.EN): {
                return(
                    <VerbFormEN
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
                    <VerbFormEE
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
                    <VerbFormDE
                        currentTranslationData={props.currentTranslationData}
                        updateFormData={(formData: TranslationItem) => {
                            props.updateFormData(formData)
                        }}
                        displayOnly={props.displayFieldsAsText}
                    />
                )
            }
            default: {
                return(<p>{t('wordFormSelector.languageNotAvailable', {ns: 'wordRelated'})}</p>)
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
                return(<p>{t('wordFormSelector.languageNotAvailable', {ns: 'wordRelated'})}</p>)
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
                return(<p>{t('wordFormSelector.languageNotAvailable', {ns: 'wordRelated'})}</p>)
            }
        }
    }

    return(getPartOfSpeechForm())
}