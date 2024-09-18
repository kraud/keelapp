import {Grid, Typography} from "@mui/material";
import {Lang} from "../ts/enums";
import {getLangKeyByLabel} from "./generalUseFunctions";
import React from "react";
import {ExerciseParameters} from "../pages/Practice";
import {CountryFlag} from "./GeneralUseComponents";
import globalTheme from "../theme/theme";

interface WordSimpleListProps {
    wordsSelectedForExercises: any[] // simple-word
    parameters: ExerciseParameters
}

export const WordSimpleList = (props: WordSimpleListProps) => {

    const getExistingTranslations = (selectedWord: any, fieldsByActiveLanguage: string[]) => {
        return(
            fieldsByActiveLanguage.filter((activeLanguageField) => {
                return((selectedWord[activeLanguageField] !== undefined))
            })
        )
    }

    return(
        <Grid
            container={true}
            justifyContent={'center'}
            item={true}
        >
            {(props.wordsSelectedForExercises).map((selectedWord: any) => {
                const fieldsByActiveLanguage = props.parameters.languages.map((language: Lang) => {
                    return("data"+(getLangKeyByLabel(language)))
                })
                return(
                    <Grid
                        container={true}
                        direction={'column'}
                        // justifyContent={'center'}
                        // alignItems={'flex-start'}
                        alignItems={'flex-start'}
                        justifyContent={'flex-start'}
                        item={true}
                        xs={4}
                        xl={3}
                        sx={{
                            border: '2px solid black',
                            borderRadius: '20px',
                            maxWidth: '250px !important'
                        }}
                    >
                        <Grid
                            container={true}
                            justifyContent={'center'}
                            item={true}
                        >
                            <Grid
                                item={true}
                                xs={'auto'}
                                sx={{
                                    border: '2px solid pink'
                                }}
                            >
                                <Typography
                                    sx={{
                                        typography: {
                                            xs: 'body1',
                                            sm: 'h6',
                                        }
                                    }}
                                    align={"center"}
                                >
                                    {selectedWord.partOfSpeech}
                                </Typography>
                            </Grid>
                        </Grid>
                        {((getExistingTranslations(selectedWord, fieldsByActiveLanguage)).map((activeLanguageField: string) => {
                            return(
                                <Grid
                                    container={true}
                                    justifyContent={'flex-start'}
                                    alignItems={'center'}
                                    item={true}
                                    // xs={12}
                                    xs={'auto'}
                                    sx={{
                                        border: '2px solid blue'
                                    }}
                                >
                                    <Grid
                                        item={true}
                                        xs={'auto'}
                                    >
                                        <CountryFlag
                                            country={Lang[activeLanguageField.slice(-2)] as Lang}
                                            border={true}
                                            sxProps={{
                                                marginRight: globalTheme.spacing(1),
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        item={true}
                                        xs={'auto'}
                                    >
                                        <Typography
                                            sx={{
                                                typography: {
                                                    xs: 'body2',
                                                    sm: 'h6',
                                                },
                                            }}
                                            align={"center"}
                                        >
                                            {selectedWord[activeLanguageField]}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )
                        }))}
                    </Grid>
                )
            })}
        </Grid>
    )
}