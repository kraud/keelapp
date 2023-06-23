import {Button, Grid, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import globalTheme from "../theme/theme";
import {TextInputFormWithHook} from "./TextInputFormHook";
import LinearIndeterminate from "./Spinner";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {IFormInput} from "../pages/Register";
import * as Yup from "yup";
import {WordFormEN} from "./WordFormEN";
import {WordFormES} from "./WordFormES";

// TODO: find a better place to define all this:
export interface WordData {
    translations: TranslationItem[],
    clue?: string,
}

export enum Lang {
    ES= "Spanish",
    EN = "English",
    DE = "German",
    EE= "Estonian"
}
export enum WordGender {
    M = "male", // MALE
    F = "female", // FEMALE
    N = "neutral" // NEUTRAL
}

export interface TranslationItem {
    lang: Lang,
    nounCases: NounItem[]
}

// interface NounEN extends TranslationItem {
//     singularEN: string,
//     pluralEN: string,
// }
// interface NounES extends TranslationItem {
//     genderES: WordGender,
//     singularES: string,
//     pluralES: string,
// }

// TODO: later add all other cases for all languages
export enum NounCases {
    singularEN = "singularEN" ,
    pluralEN = "pluralEN",
    genderES = "genderES",
    singularES = "singularES",
    pluralES = "pluralES",
}

interface WordFormGenericProps {
    availableLangs: Lang[] // list provided by parent component, so we know which languages can be displayed as options to choose from
    setTranslation: (translationData: {
            lang: Lang,
            isComplete: boolean
        }) => void // to inform parent component which language we are currently surveying and the status of the form
    removeLangFromUse: (langNowAvailable: Lang) => void // when changing the language we inform parent component that previous one is now available
    giveTranslation: (translation: TranslationItem) => void
}

// A word (string) and the type of noun that it is
export interface NounItem {
    word: string,
    caseName: NounCases, // the type on noun stored in "word" property
}

// Displays available language options, and once selected it displays the correct fields to input
// This form will only display buttons/textfields/selects for A SINGLE language+word combo
export function WordFormGeneric(props: WordFormGenericProps) {
    const [currentLang, setCurrentLang] = useState<Lang | null>(null)
    const [wordCases, setWordCases] = useState<TranslationItem | null >() // each item represents a language that has a translation

    const onSubmit = () => {
        // Create WordData object from appended form fields
        //@ts-ignore
        // TODO: dispatch(addWord(wordTranslationData))
    }

    useEffect(() => {
        if(wordCases){
            props.giveTranslation(wordCases)
        }
    }, [wordCases])

    const updateTranslationList = (language: Lang, nounCases: NounItem[]) => {
        // TODO: should we eliminate *here* the nounCases where the "word" property is empty ("")?
        setWordCases({
            lang: language,
            nounCases: nounCases.filter((nounCase) => (nounCase.word !== ""))
        })
    }

    const getLanguageForm = (lang: Lang) => {
        switch (lang){
            case (Lang.ES): {
                return(
                    <WordFormES
                        setCases={(casesList: NounItem[]) => {
                            console.log("casesList ES")
                            console.log(casesList)
                            // generic function to append language, list of NounItems and update parent
                            updateTranslationList(Lang.ES, casesList)
                        }}
                        setComplete = {(completionState) => {
                            props.setTranslation({
                                lang: Lang.ES,
                                isComplete:completionState
                            })
                        }}
                    />
                )
            }
            case (Lang.EN): {
                return(
                    <WordFormEN
                        setCases={(casesList: NounItem[]) => {
                            // generic function to append language, list of NounItems and update parent
                            console.log("casesList EN")
                            console.log(casesList)
                            updateTranslationList(Lang.EN, casesList)
                        }}
                        setComplete = {(completionState) => {
                            props.setTranslation({
                                lang: Lang.EN,
                                isComplete:completionState
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
    const [availableLanguages, setAvailableLanguages] = useState<Lang[]>([])
    useEffect(() => {
        setAvailableLanguages(props.availableLangs)
    }, [props.availableLangs])

    return(
        <Grid
            item={true}
        >
            <Grid
                item={true}
                container={true}
                spacing={2}
                alignItems={"center"}
            >
                {/* SELECT LANGUAGE FOR ORIGINAL WORD */}
                <Grid
                    item={true}
                    container={true}
                    xs={12}
                    sm={6}
                    justifyContent={"center"}
                    spacing={2}
                >
                    {
                        availableLanguages.map((lang: Lang, index: number) => {
                            return(
                                <Grid
                                    item={true}
                                    key={index}
                                >
                                    <Button
                                        variant={(currentLang == lang) ?"contained" :"outlined"}
                                        color={(currentLang == lang) ?"primary" :"error"}
                                        onClick={() => {
                                            if(currentLang !== null){
                                                // inform parent that old lang is now available
                                                props.removeLangFromUse(currentLang)
                                            }
                                            setCurrentLang(lang)
                                        }}
                                    >
                                        {lang}
                                    </Button>
                                </Grid>
                            )
                        })
                    }
                </Grid>
                {/* INPUT ORIGINAL WORD */}
                <Grid
                    item={true}
                    xs={"auto"}
                    container={true}
                    alignItems={"flex-start"}
                >
                    <Grid
                        item={true}
                    >
                        {(currentLang == null)
                            ?
                            <Typography
                                variant={"subtitle2"}
                                // align={"center"}
                            >
                                Pick a language for the new word
                            </Typography>
                            :
                            getLanguageForm(currentLang)
                        }
                    </Grid>
                </Grid>
                {/* SELECT LANGUAGE FOR TRANSLATION */}
                {/* INPUT DATA FOR TRANSLATION */}

            </Grid>
        </Grid>
    )
}