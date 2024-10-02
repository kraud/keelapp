import {EquivalentTranslationValues, ExerciseResult} from "../../ts/interfaces";
import {ExerciseParameters} from "../../pages/Practice";
import {Collapse, Divider, Grid, Typography} from "@mui/material";
import React, {useState} from "react";
import {WordSimpleList} from "../WordSimpleList";
import Button from "@mui/material/Button";
import {CardTypeSelection, Lang, PartOfSpeech} from "../../ts/enums";
import globalTheme from "../../theme/theme";
import {CountryFlag} from "../GeneralUseComponents";
import {ResultRow} from "./ResultRow";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FlagIcon from '@mui/icons-material/Flag';

interface EndScreenProps {
    currentCardIndex: number,
    setCurrentCardIndex: (index: number) => void // needed to go back an review exercise (can click on exercise to review)
    exercises: EquivalentTranslationValues[], // to display review of exercises
    exercisesResults: ExerciseResult[], // to display results of review-exercise
    parameters: ExerciseParameters // to add as info about parameters that created the exercises
    wordsSelectedForExercises: any[] // simple-word // used to displayed exercised words/translations
    onClickReset: () => void
}

export const EndScreen = (props: EndScreenProps) => {
    const [displayWords, setDisplayWords] = useState<boolean>(false)
    const [displayParameters, setDisplayParameters] = useState<boolean>(false)

    return (
        <Grid
            container={true}
            justifyContent={'center'}
            alignItems={'center'}
            item={true}
            xs={12}
            xl={10}
        >
            <Grid
                container={true}
                justifyContent={'space-around'}
                alignItems={'center'}
                item={true}
            >
                <Grid
                    item={true}
                    xs={12}
                >
                    <Divider
                        orientation="horizontal"
                        flexItem={true}
                        sx={{
                            "&::before, &::after": {
                                borderColor: "black !important",
                            },
                        }}
                    >
                        <Button
                            variant={'text'}
                            onClick={() => {
                                setDisplayParameters((prevValue: boolean) => !prevValue)
                            }}
                        >
                            {(displayParameters) ? "Hide parameters" : "Display parameters"}
                        </Button>
                    </Divider>
                    <Collapse
                        in={displayParameters}
                        sx={{
                            width: '100%'
                        }}
                    >
                        <Grid
                            container={true}
                            justifyContent={'space-between'}
                        >
                            <Grid
                                item={true}
                                xs={true}
                                sx={{
                                    backgroundColor: '#e1e1e1',
                                    borderRadius: '25px',
                                    paddingY: globalTheme.spacing(2),
                                    paddingX: globalTheme.spacing(3),
                                    marginTop: globalTheme.spacing(1),
                                    marginRight: globalTheme.spacing(1),
                                    alignContent: 'space-evenly'
                                }}
                            >
                                <Grid
                                    container={true}
                                    justifyContent={'space-around'}
                                    alignItems={'center'}
                                    item={true}
                                >
                                    {(
                                        (props.parameters.type === 'Random')
                                            ? ['Multiple-Choice', 'Text-Input']
                                            : [props.parameters.type]
                                    ).map((cardType: string, index: number) => {
                                        return(
                                            <Grid
                                                key={index}
                                                container={true}
                                                alignItems={'center'}
                                                item={true}
                                                justifyContent={'center'}
                                                xs={12}
                                                sm={7}
                                                md={'auto'}
                                                sx={{
                                                    backgroundColor: 'white',
                                                    borderRadius: '25px',
                                                    paddingY: globalTheme.spacing(1),
                                                    paddingX: globalTheme.spacing(2),
                                                    margin: globalTheme.spacing(0.25),
                                                }}
                                            >
                                                <Grid
                                                    item={true}
                                                    xs={'auto'}
                                                >
                                                    {(cardType === "Multiple-Choice") &&
                                                        <FormatListBulletedIcon
                                                            sx={{
                                                                color: 'black',
                                                                height: '25px',
                                                                width: '25px',
                                                                verticalAlign: 'bottom',
                                                                marginRight: globalTheme.spacing(1)
                                                            }}
                                                        />
                                                    }
                                                    {(cardType === "Text-Input") &&
                                                        <BorderColorIcon
                                                            sx={{
                                                                color: 'black',
                                                                height: '25px',
                                                                width: '25px',
                                                                verticalAlign: 'bottom',
                                                                marginRight: globalTheme.spacing(1)
                                                            }}
                                                        />
                                                    }
                                                </Grid>
                                                <Grid
                                                    item={true}
                                                    xs={'auto'}
                                                >
                                                    <Typography
                                                        sx={{
                                                            typography: {
                                                                xs: 'body2',
                                                                sm: 'body2',
                                                                md: 'body1',
                                                                xl: 'h6',
                                                            },
                                                            marginTop: 0,
                                                            color: 'black'
                                                        }}
                                                        align={"center"}
                                                    >
                                                        {cardType}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        )
                                    })
                                    }
                                </Grid>
                            </Grid>
                            <Grid
                                item={true}
                                xs={true}
                                sx={{
                                    backgroundColor: '#e1e1e1',
                                    borderRadius: '25px',
                                    paddingY: globalTheme.spacing(2),
                                    paddingX: globalTheme.spacing(3),
                                    marginTop: globalTheme.spacing(1),
                                    marginLeft: globalTheme.spacing(1),
                                    alignContent: 'space-evenly'
                                }}
                            >
                                <Grid
                                    container={true}
                                    justifyContent={'space-around'}
                                    alignItems={'center'}
                                    item={true}
                                >
                                    {(
                                        (props.parameters.multiLang === 'Random')
                                            ? ['Multi-Language', 'Single-Language'] as CardTypeSelection[]
                                            : [props.parameters.multiLang]
                                    ).map((languageType: CardTypeSelection, index: number) => {
                                        return(
                                            <Grid
                                                key={index}
                                                container={true}
                                                justifyContent={'center'}
                                                item={true}
                                                xs={12}
                                                sm={7}
                                                md={'auto'}
                                                sx={{
                                                    backgroundColor: 'white',
                                                    borderRadius: '25px',
                                                    paddingY: globalTheme.spacing(1),
                                                    paddingX: globalTheme.spacing(2),
                                                    margin: globalTheme.spacing(0.25)
                                                }}
                                            >
                                                <Grid
                                                    item={true}
                                                    xs={'auto'}
                                                >
                                                    {(languageType === "Multi-Language") &&
                                                        <>
                                                            <FlagIcon
                                                                sx={{
                                                                    color: 'black',
                                                                    height: '25px',
                                                                    width: '25px',
                                                                    verticalAlign: 'bottom',
                                                                }}
                                                            />
                                                            <FlagIcon
                                                                sx={{
                                                                    color: '#0072CE',
                                                                    height: '25px',
                                                                    width: '25px',
                                                                    verticalAlign: 'bottom',
                                                                    marginLeft: `-20px`,
                                                                    marginBottom: `-5px`,
                                                                    marginRight: globalTheme.spacing(1)
                                                                }}
                                                            />
                                                        </>
                                                    }
                                                    {(languageType === "Single-Language") &&
                                                        <FlagIcon
                                                            sx={{
                                                                color: 'black',
                                                                height: '25px',
                                                                width: '25px',
                                                                verticalAlign: 'bottom',
                                                                marginRight: globalTheme.spacing(1)
                                                            }}
                                                        />
                                                    }
                                                </Grid>
                                                <Grid
                                                    item={true}
                                                    xs={'auto'}
                                                >
                                                    <Typography
                                                        sx={{
                                                            typography: {
                                                                xs: 'body2',
                                                                sm: 'body2',
                                                                md: 'body1',
                                                                xl: 'h6',
                                                            },
                                                            marginTop: 0,
                                                            color: 'black'
                                                        }}
                                                        align={"center"}
                                                    >
                                                        {languageType}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        )
                                    })
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container={true}
                            justifyContent={'space-between'}
                        >
                            <Grid
                                item={true}
                                xs={true}
                                sx={{
                                    backgroundColor: '#e1e1e1',
                                    borderRadius: '25px',
                                    paddingY: globalTheme.spacing(2),
                                    paddingX: globalTheme.spacing(3),
                                    marginTop: globalTheme.spacing(1),
                                    marginRight: globalTheme.spacing(1)
                                }}
                            >
                                <Grid
                                    container={true}
                                    justifyContent={'space-around'}
                                    spacing={2}
                                    item={true}
                                >
                                    {(props.parameters.languages.map((language: Lang, index: number) => {
                                        return(
                                            <Grid
                                                key={index}
                                                item={true}
                                                xs={'auto'}
                                            >
                                                <CountryFlag
                                                    country={language}
                                                    border={true}
                                                    sxProps={{}}
                                                    size={2}
                                                />
                                            </Grid>
                                        )
                                    }))}
                                </Grid>
                            </Grid>
                            <Grid
                                item={true}
                                xs={'auto'}
                                sx={{
                                    backgroundColor: '#e1e1e1',
                                    borderRadius: '25px',
                                    paddingY: globalTheme.spacing(1),
                                    paddingX: globalTheme.spacing(3),
                                    marginTop: globalTheme.spacing(1),
                                    marginLeft: globalTheme.spacing(1),
                                    alignContent: 'space-evenly'
                                }}
                            >
                                <Grid
                                    container={true}
                                    justifyContent={'space-around'}
                                    alignItems={'center'}
                                    item={true}
                                >
                                    {(props.parameters.partsOfSpeech.map((partOfSpeech: PartOfSpeech, index: number) => {
                                        return(
                                            <Grid
                                                key={index}
                                                item={true}
                                                xs={'auto'}
                                                sx={{
                                                    backgroundColor: 'white',
                                                    borderRadius: '25px',
                                                    paddingY: globalTheme.spacing(1),
                                                    paddingX: globalTheme.spacing(2),
                                                    margin: globalTheme.spacing(0.25),
                                                    // maxHeight: 'max-content'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        typography: {
                                                            xs: 'body2',
                                                            sm: 'body2',
                                                            md: 'body1',
                                                            xl: 'h6',
                                                        },
                                                        marginTop: 0,
                                                        color: 'black'
                                                    }}
                                                    align={"center"}
                                                >
                                                    {partOfSpeech}
                                                </Typography>
                                            </Grid>
                                        )
                                    }))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid>
            </Grid>
            <Grid
                container={true}
                justifyContent={'space-around'}
                alignItems={'center'}
                item={true}
            >
                <Grid
                    item={true}
                    xs={12}
                >
                    <Grid
                        item={true}
                        xs={'auto'}
                        sx={{
                            backgroundColor: '#e1e1e1',
                            borderRadius: '25px',
                            paddingY: globalTheme.spacing(1),
                            paddingX: globalTheme.spacing(3),
                            marginTop: globalTheme.spacing(1)
                        }}
                    >
                        <Grid
                            container={true}
                            justifyContent={'center'}
                            alignItems={'center'}
                            item={true}
                        >
                            {(props.exercisesResults.map((result: ExerciseResult, index: number) => {
                                const originalExerciseData: EquivalentTranslationValues = props.exercises[index]
                                return(
                                    <ResultRow
                                        exerciseResult={result}
                                        originalExerciseData={originalExerciseData}
                                        index={index}
                                        setCurrentCardIndex={(newIndex: number) => {
                                            props.setCurrentCardIndex(newIndex)
                                        }}
                                    />
                                )
                            }))}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {/* PRE-SELECTED WORDS */}
            {(props.wordsSelectedForExercises.length > 0) &&
                <Grid
                    container={true}
                    justifyContent={'center'}
                    item={true}
                >
                    <Grid
                        item={true}
                        xs={12}
                    >
                        <Divider
                            orientation="horizontal"
                            flexItem={true}
                            sx={{
                                "&::before, &::after": {
                                    borderColor: "black !important",
                                },
                            }}
                        >
                            <Button
                                variant={'text'}
                                onClick={() => {
                                    setDisplayWords((prevValue: boolean) => !prevValue)
                                }}
                            >
                                {(displayWords) ? "Hide words" : "Display words"}
                            </Button>
                        </Divider>
                        <Collapse
                            in={displayWords}
                            sx={{
                                width: '100%'
                            }}
                        >
                            <Grid
                                item={true}
                                xs={12}
                            >
                                <WordSimpleList
                                    wordsSelectedForExercises={props.wordsSelectedForExercises}
                                    parameters={props.parameters}
                                />
                            </Grid>
                        </Collapse>
                    </Grid>
                </Grid>
            }
            <Grid
                container={true}
                justifyContent={'center'}
                item={true}
                sx={{
                    marginTop: globalTheme.spacing(2)
                }}
            >
                <Grid
                    item={true}
                    xs={10}
                >
                    <Button
                        fullWidth={true}
                        variant={'contained'}
                        color={'info'}
                        onClick={() => {
                            props.onClickReset()
                        }}
                    >
                        Go back to parameters
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}