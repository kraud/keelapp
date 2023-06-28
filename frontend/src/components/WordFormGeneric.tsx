import {Button, Grid, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {WordFormEN} from "./forms/WordFormEN";
import {WordFormES} from "./forms/WordFormES";
import {NounItem, TranslationItem} from "../ts/interfaces";
import {Lang, PartOfSpeech} from "../ts/enums";
import {FormSelector} from "./forms/FormSelector";

// TODO: later add all other cases for all languages

interface WordFormGenericProps {
    partOfSpeech?: PartOfSpeech,
    availableLanguages: Lang[] // list provided by parent component, so we know which languages can be displayed as options to choose from
    setTranslationStatus: (translationData: {
            language: Lang,
            isValidFormStatus: boolean
        }) => void // to inform parent component which language we are currently surveying and the status of the form
    updateCurrentLang: (langNowAvailable: Lang) => void // when changing the language we inform parent component that previous one is now available
    updateTranslationData: (translation: TranslationItem) => void
    removeForm: () => void // temp workaround - removes the last form on display
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
        setWordCases({
            language: language,
            nounCases: nounCases.filter((nounCase) => (nounCase.word !== "")) // To avoid saving empty cases
        })
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
                                        variant={(currentLang === lang) ?"contained" :"outlined"}
                                        color={(currentLang === lang) ?"primary" :"error"}
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
                            <FormSelector
                                currentLang={currentLang}
                                partOfSpeech={props.partOfSpeech}
                                setTranslationStatus={(translationData) => {
                                    props.setTranslationStatus(translationData)
                                }}
                                updateTranslationList={(language: Lang, nounCases: NounItem[] ) => {
                                    updateTranslationList(language, nounCases)
                                }}
                            />
                        }
                    </Grid>
                </Grid>
                <Grid
                    item={true}
                    container={true}
                >
                    <Button
                        variant={"outlined"}
                        disabled={( // only true when only 2 languages are being used
                            (
                                (Object.values(Lang).filter((v) => isNaN(Number(v))) as unknown as Array<keyof typeof Lang>).length
                                - 2
                            )
                            <
                            props.availableLanguages.length
                        )}
                        onClick={() => {
                            if(currentLang !== null){
                                // inform parent that old lang is now available
                                props.updateCurrentLang(currentLang)
                            }
                            setCurrentLang(null)
                            props.removeForm()
                        }}
                    >
                        REMOVE
                    </Button>
                </Grid>
                {/* SELECT LANGUAGE FOR TRANSLATION */}
                {/* INPUT DATA FOR TRANSLATION */}

            </Grid>
        </Grid>
    )
}