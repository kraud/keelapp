import {Button, Grid, Typography} from "@mui/material";
import React, {useState} from "react";
import {NounItem} from "../ts/interfaces";
import {Lang, PartOfSpeech} from "../ts/enums";
import {FormSelector} from "./forms/FormSelector";

// TODO: later add all other cases for all languages

interface WordFormGenericProps {
    partOfSpeech?: PartOfSpeech,
    availableLanguages: Lang[] // list provided by parent component, so we know which languages can be displayed as options to choose from
    removeLanguageFromSelected: (langNowAvailable: Lang) => void // when changing the language we inform parent component that previous one is now available
    removeForm: () => void // temp workaround - removes the last form on display - this should remove an item from a specific index

    updateFormData: (formData: {
        language: Lang,
        cases?: NounItem[],
        completionState?: boolean
    }) => void
}


// Displays available language options, and once selected it displays the correct fields to input
// This form will only display buttons/textfields/selects for A SINGLE language+word combo
export function WordFormGeneric(props: WordFormGenericProps) {
    const [currentLang, setCurrentLang] = useState<Lang | null>(null)

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
                                                props.removeLanguageFromSelected(currentLang)
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
                                updateFormData={(formData: {
                                    language: Lang,
                                    cases?: NounItem[],
                                    completionState?: boolean
                                }) => {
                                    // TODO: recreate functions of setTranslationStatus and updateTranslationList into 1 prop
                                    props.updateFormData({
                                        ...formData,
                                        cases: (formData.cases!)
                                            // To avoid saving empty cases,
                                            ? formData.cases.filter((nounCase) => (nounCase.word !== ""))
                                            : formData.cases
                                    })
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
                                - 2 // amount of minimum forms to be displayed
                            )
                            <
                            props.availableLanguages.length
                        )}
                        onClick={() => {
                            if(currentLang !== null){
                                // inform parent that old lang is now available
                                props.removeLanguageFromSelected(currentLang)
                            }
                            setCurrentLang(null)
                            props.removeForm()
                        }}
                    >
                        REMOVE
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}