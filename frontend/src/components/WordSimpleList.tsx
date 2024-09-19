import {Grid, Typography} from "@mui/material";
import {Lang, PartOfSpeech} from "../ts/enums";
import {getLangKeyByLabel} from "./generalUseFunctions";
import React from "react";
import {ExerciseParameters} from "../pages/Practice";
import {CountryFlag} from "./GeneralUseComponents";
import globalTheme from "../theme/theme";
import Tooltip from "@mui/material/Tooltip";

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

    interface GroupedWordsByPoS {
        partOfSpeech: PartOfSpeech,
        words: any[] // simple-word[]
    }

    const getWordsSeparatedByPoS = () => {
        let wordsGroupedByPoS: GroupedWordsByPoS[] = []
        props.wordsSelectedForExercises.forEach((simpleWord) => {
            // indexInGroupedList will be -1 if not found
            const indexInGroupedList = wordsGroupedByPoS.findIndex((groupByPoS: GroupedWordsByPoS) => {
                return(groupByPoS.partOfSpeech === simpleWord.partOfSpeech)
            })
            if(indexInGroupedList >= 0){ // if Part of Speech is already included in the list
                // we update the list of words related to that Part of Speech
                wordsGroupedByPoS.splice(
                    indexInGroupedList,
                    1,
                    {
                        partOfSpeech: simpleWord.partOfSpeech as PartOfSpeech,
                        words: [
                            ...wordsGroupedByPoS[indexInGroupedList].words,
                            simpleWord
                        ]
                    }
                )
            } else { // if not included, we add it to the list
                wordsGroupedByPoS.push({
                    partOfSpeech: simpleWord.partOfSpeech as PartOfSpeech,
                    words: [simpleWord]
                })
            }
        })
        const filteredGroups = wordsGroupedByPoS.filter((groupsByPoS: GroupedWordsByPoS) => {
            return(props.parameters.partsOfSpeech.includes(groupsByPoS.partOfSpeech))
        })
        return(filteredGroups)
    }

    const getFormattedKeyString = (languages: Lang[]) => {
        return(
            languages.map((language: Lang) => {
                return("data"+(getLangKeyByLabel(language)))
            })
        )
    }

    return(
        <Grid
            container={true}
            justifyContent={'center'}
            item={true}
        >
            {((getWordsSeparatedByPoS()).map((groupedCategory: GroupedWordsByPoS, index: number) => {
                return(
                    <Grid
                        key={index}
                        container={true}
                        item={true}
                        sx={{
                            marginTop: globalTheme.spacing(3)
                        }}
                    >
                        <Grid
                            container={true}
                            justifyContent={'flex-start'}
                            item={true}
                            xs={12}
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
                                            xs: 'h6',
                                            sm: 'h4',
                                        }
                                    }}
                                    align={"center"}
                                >
                                    {groupedCategory.partOfSpeech}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container={true}
                            item={true}
                            xs={12}
                            sx={{

                                // display: 'relative',
                                whiteSpace: 'nowrap',
                                overflowX: 'auto',
                                overflowY: 'hidden',
                                // maxWidth: 'min-content',
                                // minWidth: 'max-content',
                                scrollBehavior: 'smooth',
                                border: '2px solid red',
                            }}
                        >
                            <Grid
                                container={true}
                                item={true}
                                sx={{
                                    overflowY: 'hidden',
                                    border: '2px solid yellow',
                                    minWidth: 'max-content',
                                }}
                            >
                                {(groupedCategory.words).map((selectedWord: any, index: number) => {
                                    const dataFieldsByActiveLanguage: string[] = getFormattedKeyString(props.parameters.languages)
                                    const translationsToBeDisplayed = getExistingTranslations(selectedWord, dataFieldsByActiveLanguage)
                                    if(translationsToBeDisplayed.length > 0){
                                        return(
                                            <Grid
                                                key={index}
                                                container={true}
                                                direction={'column'}
                                                alignItems={'flex-start'}
                                                justifyContent={'flex-start'}
                                                item={true}
                                                // xs={4}
                                                // xl={3}
                                                sx={{
                                                    border: '2px solid black',
                                                    borderRadius: '15px',
                                                    // fixed width
                                                    // maxWidth: '250px !important',
                                                    // minWidth: '250px !important'
                                                    // width: '175px !important'
                                                    // dynamic width depending on word
                                                    width: 'max-content',
                                                    // minWidth: 'max-content',
                                                    // maxWidth: 'max-content',
                                                    paddingX: globalTheme.spacing(1)
                                                }}
                                            >
                                                {(translationsToBeDisplayed.map((activeLanguageField: string, index: number) => {
                                                    return(
                                                        <Tooltip
                                                            title={`Registered cases: ${selectedWord[`registeredCases${activeLanguageField.slice(-2)}`]}`}
                                                            key={index}
                                                        >
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
                                                        </Tooltip>
                                                    )
                                                }))}
                                            </Grid>
                                        )
                                    } else {
                                        return(null)
                                    }
                                })}
                            </Grid>
                        </Grid>
                    </Grid>
                )
            }))
            }
        </Grid>
    )
}