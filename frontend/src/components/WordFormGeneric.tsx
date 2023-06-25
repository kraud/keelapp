import {Button, Grid, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
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
    language: Lang,
    nounCases: NounItem[]
}

// A word (string) and the type of noun that it is
export interface NounItem {
    word: string,
    caseName: NounCases, // the type on noun stored in "word" property
}
// TODO: later add all other cases for all languages
export enum NounCases {
    singularEN = "singularEN" ,
    pluralEN = "pluralEN",
    genderES = "genderES",
    singularES = "singularES",
    pluralES = "pluralES",
}

interface WordFormGenericProps {
    availableLanguages: Lang[] // list provided by parent component, so we know which languages can be displayed as options to choose from
    setTranslationStatus: (translationData: {
            language: Lang,
            isValidFormStatus: boolean
        }) => void // to inform parent component which language we are currently surveying and the status of the form
    updateCurrentLang: (langNowAvailable: Lang) => void // when changing the language we inform parent component that previous one is now available
    updateTranslationData: (translation: TranslationItem) => void
}


// Displays available language options, and once selected it displays the correct fields to input
// This form will only display buttons/textfields/selects for A SINGLE language+word combo
export function WordFormGeneric(props: WordFormGenericProps) {
    const [currentLang, setCurrentLang] = useState<Lang | null>(null)
    const [wordCases, setWordCases] = useState<TranslationItem | null >() // each item represents a language that has a translation

    useEffect(() => {
        if(wordCases){
            props.updateTranslationData(wordCases)
        }
    }, [wordCases])

    const updateTranslationList = (language: Lang, nounCases: NounItem[]) => {
        // TODO: check if it's ok to eliminate *here* the nounCases where the "word" property is empty ("")?
        setWordCases({
            language: language,
            nounCases: nounCases.filter((nounCase) => (nounCase.word !== ""))
        })
    }

    const getLanguageForm = (lang: Lang) => {
        switch (lang){
            case (Lang.ES): {
                return(
                    <WordFormES
                        setCases={(casesList: NounItem[]) => {
                            // generic function to append language, list of NounItems and update parent
                            updateTranslationList(Lang.ES, casesList)
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
            case (Lang.EN): {
                return(
                    <WordFormEN
                        setCases={(casesList: NounItem[]) => {
                            // generic function to append language, list of NounItems and update parent
                            updateTranslationList(Lang.EN, casesList)
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
            /* TODO: add Forms for German and Estonian */
            default: {
                return(<p>That language is not available yet</p>)
            }
        }
    }
    const [availableLanguages, setAvailableLanguages] = useState<Lang[]>([])
    useEffect(() => {
        setAvailableLanguages(props.availableLanguages)
    }, [props.availableLanguages])

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
                                                props.updateCurrentLang(currentLang)
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