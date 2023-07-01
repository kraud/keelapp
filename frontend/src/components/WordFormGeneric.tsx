import {Button, Grid, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {NounItem, TranslationItem} from "../ts/interfaces";
import {Lang, PartOfSpeech} from "../ts/enums";
import {FormSelector} from "./forms/FormSelector";

interface WordFormGenericProps {
    index: number, // needed to know on which item in completeWordData.translations list this form data is stored
    partOfSpeech?: PartOfSpeech,
    availableLanguages: Lang[], // list provided by parent component, so we know which languages can be displayed as options to choose from
    currentTranslationData: TranslationItem,
    amountOfFormsOnScreen: number,

    removeLanguageFromSelected: (
        index: number,
        willUpdateLanguage: boolean // true when selecting switching between languages - false when removing form from screen
    ) => void // when changing the language we inform parent component that previous one is now available
    updateFormData: (
        formData: {
            language: Lang,
            cases?: NounItem[],
            completionState?: boolean
        },
        index: number
    ) => void
}


// Displays available language options, and once selected it displays the correct fields to input
// This form will only display buttons/textfields/selects for A SINGLE language+word combo
export function WordFormGeneric(props: WordFormGenericProps) {
    const [currentLang, setCurrentLang] = useState<Lang | null>(null)

    const { currentTranslationData } = props
    useEffect(() => {
        if(currentTranslationData.language!){
            setCurrentLang(currentTranslationData.language)
        } // if it's another empty Object, the language here should remain null
    }, [currentTranslationData])

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
                        props.availableLanguages.map((lang: Lang, index: number) => {
                            return(
                                <Grid
                                    item={true}
                                    key={index}
                                >
                                    <Button
                                        variant={(currentLang === lang) ?"contained" :"outlined"}
                                        color={(currentLang === lang) ?"primary" :"error"}
                                        onClick={() => {
                                            // if we click on the button for the selected language nothing happens
                                            if(currentLang === lang){
                                                return
                                            }
                                            if(currentLang !== null){
                                                // inform parent that old lang is now available
                                                props.removeLanguageFromSelected(props.index, true)
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
                                currentTranslationData={props.currentTranslationData}
                                partOfSpeech={props.partOfSpeech}
                                updateFormData={(formData: {
                                    language: Lang,
                                    cases?: NounItem[],
                                    completionState?: boolean
                                }) => {
                                    props.updateFormData(
                                        {
                                            ...formData,
                                            cases: (formData.cases!)
                                                // To avoid saving empty cases,
                                                ? formData.cases.filter((nounCase) => (nounCase.word !== ""))
                                                : formData.cases
                                        },
                                        props.index
                                    )
                                }}
                            />
                        }
                    </Grid>
                </Grid>
                <Grid
                    item={true}
                    container={true}
                    spacing={1}
                >
                    <Grid
                        item={true}
                    >
                        <Button
                            variant={"outlined"}
                            disabled={(props.amountOfFormsOnScreen < 3)}
                            onClick={() => {
                                // this should run even if no language is selected
                                // because there's an empty Object at this index holding its place
                                props.removeLanguageFromSelected(props.index, false)
                                setCurrentLang(null)
                            }}
                        >
                            REMOVE
                        </Button>
                    </Grid>
                    <Grid
                        item={true}
                    >
                        <Button
                            variant={"outlined"}
                            disabled={(currentLang === null)}
                            onClick={() => {
                                props.removeLanguageFromSelected(props.index, true)
                                setCurrentLang(null)
                            }}
                        >
                            CLEAR
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}