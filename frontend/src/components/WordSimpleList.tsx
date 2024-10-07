import {Grid, Typography} from "@mui/material";
import {Lang, PartOfSpeech} from "../ts/enums";
import {getLangKeyByLabel} from "./generalUseFunctions";
import React from "react";
import {ExerciseParameters} from "../pages/Practice";
import {CountryFlag} from "./GeneralUseComponents";
import globalTheme from "../theme/theme";
import Tooltip from "@mui/material/Tooltip";
import {useTranslation} from "react-i18next";

interface WordSimpleListProps {
    wordsSelectedForExercises: any[] // simple-word
    parameters: ExerciseParameters
}

export const WordSimpleList = (props: WordSimpleListProps) => {
    const { t } = useTranslation(['common'])

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
        }).sort((a, b) => b.words.length - a.words.length)
        return(filteredGroups)
    }

    const getFormattedKeyString = (languages: Lang[]) => {
        return(
            languages.map((language: Lang) => {
                return("data"+(getLangKeyByLabel(language)))
            })
        )
    }

    const getAmountOfActiveWords = (groupedCategory: GroupedWordsByPoS) => {
        return(
            (groupedCategory.words).filter((selectedWord: any, index: number) => {
                const dataFieldsByActiveLanguage: string[] = getFormattedKeyString(props.parameters.languages)
                const translationsToBeDisplayed = getExistingTranslations(selectedWord, dataFieldsByActiveLanguage)
                return(translationsToBeDisplayed.length > 0)
            }).length
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
                            marginTop: (index > 0) ? globalTheme.spacing(3) : globalTheme.spacing(0)
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
                                    paddingX: globalTheme.spacing(2),
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
                                    {/*{groupedCategory.partOfSpeech} ({getAmountOfActiveWords(groupedCategory)})*/}
                                    {t(`partOfSpeech.${(groupedCategory.partOfSpeech as string).toLowerCase()}`, {ns: 'common'})} ({getAmountOfActiveWords(groupedCategory)})
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container={true}
                            item={true}
                            xs={12}
                            sx={{
                                whiteSpace: 'nowrap',
                                overflowX: 'auto',
                                overflowY: 'hidden',
                                scrollBehavior: 'smooth',
                            }}
                        >
                            <Grid
                                container={true}
                                item={true}
                                xs={'auto'}
                                sx={{
                                    overflowY: 'hidden',
                                    minWidth: 'max-content',
                                    paddingY: globalTheme.spacing(2),
                                    paddingX: globalTheme.spacing(2),
                                    backgroundColor: '#e1e1e1',
                                    borderRadius: '25px'
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
                                                sx={{
                                                    border: '2px solid black',
                                                    borderRadius: '15px',
                                                    marginRight: globalTheme.spacing(1),
                                                    paddingY: globalTheme.spacing(1),
                                                    paddingX: globalTheme.spacing(1),
                                                    // dynamic width depending on word
                                                    width: 'max-content',
                                                    backgroundColor: 'white'
                                                }}
                                            >
                                                {(translationsToBeDisplayed.map((activeLanguageField: string, index: number) => {
                                                    return(
                                                        <Tooltip
                                                            // title={`Registered cases (${activeLanguageField.slice(-2)}): ${selectedWord[`registeredCases${activeLanguageField.slice(-2)}`]}`}
                                                            title={t("tooltips.registeredCases", {ns: 'practice', language: activeLanguageField.slice(-2), amount: selectedWord[`registeredCases${activeLanguageField.slice(-2)}`]})}
                                                            key={index}
                                                        >
                                                            <Grid
                                                                container={true}
                                                                justifyContent={'flex-start'}
                                                                alignItems={'center'}
                                                                item={true}
                                                                xs={'auto'}
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