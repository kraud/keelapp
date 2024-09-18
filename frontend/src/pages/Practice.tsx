import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../app/store";
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {Grid, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import LinearIndeterminate from "../components/Spinner";
import {CountryFlag} from "../components/GeneralUseComponents";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {Lang, PartOfSpeech} from "../ts/enums";
import {ExerciseParameterSelector} from "../components/ExerciseParameterSelector";
import {toast} from "react-toastify";
import {
    getExercisesForUser,
    resetExerciseList,
    resetWordsSelectedForExercises
} from "../features/exercises/exerciseSlice";
import {getLangKeyByLabel} from "../components/generalUseFunctions";
import {WordSimpleList} from "../components/WordSimpleList";

interface CardAnswerData {
    index: number,
    answer: string,
    correct: boolean,
}

export interface ExerciseParameters {
    languages: Lang[],
    partsOfSpeech: PartOfSpeech[],
    amountOfExercises: number,
    input: 'Multiple-Choice' | 'Text-Input',
    mode: 'Single-Try' | 'Multiple-Tries'
    preSelectedWords?: any[] // simple-word data
}

interface PracticeProps {

}

export const Practice = (props: PracticeProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const {exercises, isErrorExercises, isSuccessExercises, isLoadingExercises, wordsSelectedForExercises} = useSelector((state: any) => state.exercises)
    const {user} = useSelector((state: any) => state.auth)
    const { t } = useTranslation(['partOfSpeechCases', 'exercises', 'common'])


    const initialParameters: ExerciseParameters = {
        languages: user.languages as Lang[],
        partsOfSpeech: [PartOfSpeech.verb, PartOfSpeech.noun], // TODO: keep adding PoS as we create the GroupedCategories JSON objects
        amountOfExercises: 10,
        input: 'Text-Input',
        mode: 'Single-Try'
    }

    const initialListOfPoS: PartOfSpeech[] = [PartOfSpeech.noun, PartOfSpeech.verb]

    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    //@ts-ignore
    const [parameters, setParameters] = useState<ExerciseParameters>(initialParameters)
    // if false => display parameter selection
    const [acceptedParameters, setAcceptedParameters] = useState(false)

    const [cardAnswers, setCardAnswers] = useState<CardAnswerData[]>([])

    // This wil determine which checkboxes are displayed on ParameterSelector for Parts of Speech (so we don't display PoS options NOT included on pre-selected words).
    const [relevantPoSForPreSelectedWords, setRelevantPoSForPreSelectedWords] = useState<PartOfSpeech[]>(initialListOfPoS)

    const getRelevantPoSFromWordSelection = (selectedWords: any[]) => {
        const allPoS = selectedWords.map((selectedWord) => {
            return(selectedWord.partOfSpeech)
        })
        const relevantPartsOfSpeech = new Set(allPoS)
        return(Array.from(relevantPartsOfSpeech))
    }

    const onAcceptParameters = () => {
        toast.info("let me check...")
        dispatch(getExercisesForUser({
            ...parameters,
            // BE expects only id for pre-selected words
            preSelectedWords: (parameters.preSelectedWords !== undefined)
                ? (parameters.preSelectedWords).map((preSelectedWordSimple: any) => {
                    return(preSelectedWordSimple._id)
                })
                : undefined
        }))
        setAcceptedParameters(true)
    }

    useEffect(() => {
        if(wordsSelectedForExercises.length > 0){
            setParameters((prevState) => {
                return({
                    ...prevState,
                    partsOfSpeech: getRelevantPoSFromWordSelection(wordsSelectedForExercises),
                    preSelectedWords: wordsSelectedForExercises
                })
            })
            setRelevantPoSForPreSelectedWords(getRelevantPoSFromWordSelection(wordsSelectedForExercises))
        }
    }, [wordsSelectedForExercises])

    const onClickReset = () => {
        setParameters((prevState) => {
            return({
                ...prevState,
                ...initialParameters
            })
        })
        setAcceptedParameters(false)
        setCurrentCardIndex(0)
        setCardAnswers([])
        dispatch(resetExerciseList())
    }

    return(
        <Grid
            component={motion.div} // to implement animations with Framer Motion
            variants={routeVariantsAnimation}
            initial="initial"
            animate="final"
            container={true}
            justifyContent={'center'}
            item={true}
            sx={{
                marginTop: globalTheme.spacing(4),
                border: '3px solid black'
            }}
            xs={12}
            md={11}
            lg={10}
            xl={9}
        >
            <Grid
                container={true}
                justifyContent={'center'}
                alignItems={'flex-start'}
                item={true}
                sx={{
                    border: '3px solid blue',
                }}
                direction={{
                    xs: 'row',
                    lg: 'row-reverse',
                }}
            >
                <Grid
                    item={true}
                    xs={12}
                    sx={{
                        border: '3px solid green',
                        // borderColor: '#2e2e2e',
                    }}
                >
                    <Typography
                        sx={{
                            typography: {
                                xs: 'h4',
                                sm: 'h3',
                                md: 'h1',
                            },
                        }}
                        align={"center"}
                    >
                        {(exercises.length > 0)
                            ? `Exercises ${currentCardIndex+1}/${exercises.length}`
                            : "Create Exercises"
                        }
                    </Typography>
                </Grid>
                {(
                    (wordsSelectedForExercises.length > 0) &&
                    !(acceptedParameters)
                ) &&
                    <Grid
                        container={true}
                        justifyContent={'center'}
                        item={true}
                        xs={12}
                        lg={8}
                    >
                        <Grid
                            item={true}
                            xs={12}
                            sx={{
                                border: '3px solid green',
                            }}
                        >
                            <Typography
                                sx={{
                                    typography: {
                                        xs: 'body1',
                                        sm: 'h6',
                                        md: 'h5',
                                    },
                                }}
                                align={"center"}
                            >
                                {`Parameters will apply to exercises created from these ${wordsSelectedForExercises.length} words:`}
                            </Typography>
                        </Grid>
                        <WordSimpleList
                            wordsSelectedForExercises={wordsSelectedForExercises}
                            parameters={parameters}
                        />
                    </Grid>
                }
                {(!acceptedParameters || isLoadingExercises) // if parameters have not been yet accepted => display them
                    ?
                        <Grid
                            container={true}
                            item={true}
                            xs={12}
                            lg={4}
                        >
                            <ExerciseParameterSelector
                                availableLanguages={user.languages}
                                defaultParameters={parameters}
                                onParametersChange={(newParameters: ExerciseParameters) => {
                                    setParameters((prevState) => {
                                        // This way we won't overwrite fields not modified inside ParameterSelector
                                        return({
                                            ...prevState,
                                            ...newParameters
                                        })
                                    })
                                }}
                                onAccept={() => {
                                    onAcceptParameters()
                                }}
                                availablePoS={relevantPoSForPreSelectedWords}
                                disabled={isLoadingExercises}
                            />
                        </Grid>
                    : (isLoadingExercises && !isSuccessExercises)
                        ? <LinearIndeterminate/>
                        :
                            <Grid
                                container={true}
                                justifyContent={'center'}
                                alignItems={'center'}
                                item={true}
                                xs={12}
                                sx={{
                                    border: '3px solid blue',
                                    height: 'max-content'
                                }}
                            >
                                {(isLoadingExercises && !isSuccessExercises)
                                    ?
                                    <LinearIndeterminate/>
                                    :
                                    // TODO: define EXERCISE CARD in a separate component
                                    <Grid
                                        container={true}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                        // direction={'column'}
                                        item={true}
                                        xs={12}
                                        sm={10}
                                        md={8}
                                        lg={7}
                                        xl={6}
                                        sx={{
                                            border: '4px solid green',
                                        }}
                                    >
                                        {/*BUTTON BACK*/}
                                        {/* TODO: there will be different types of cards (depending on exercise type: multiple-choice, text-input, etc.*/}
                                        <Grid
                                            container={true}
                                            item={true}
                                            justifyContent={'center'}
                                            // rowSpacing={3}
                                            alignItems={'center'}
                                            xs={'auto'}
                                            sx={{
                                                border: '4px solid red',
                                            }}
                                        >
                                            <Grid
                                                item={true}
                                                xs={true}
                                                sx={{
                                                    border: '4px solid yellow',
                                                    // width: '40px'
                                                }}
                                            >
                                                <IconButton
                                                    color={'primary'}
                                                    disabled={(currentCardIndex === 0)}
                                                    onClick={() => {
                                                        setCurrentCardIndex((currentIndex) => {
                                                            if(currentIndex > 0){
                                                                return(currentIndex-1)
                                                            } else {
                                                                // Not possible, but TS requires it. Button is disabled.
                                                                return(currentIndex)
                                                            }
                                                        })
                                                    }}
                                                >
                                                    <ChevronLeftIcon
                                                        sx={{
                                                            fontSize: 100,
                                                            // width: '40px'
                                                            marginLeft: '-35px',
                                                            marginRight: '-35px'
                                                        }}
                                                    />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                        {!(exercises.length > 0)
                                            ? <Grid
                                                container={true}
                                                justifyContent={'center'}
                                                item={true}
                                                xs={6}
                                            >
                                                <Grid
                                                    item={true}
                                                >
                                                    <Typography
                                                        variant={'h3'}
                                                    >
                                                        No results matching those parameters, please try again with different settings.
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            : <Grid
                                                container={true}
                                                justifyContent={'center'}
                                                alignItems={'center'}
                                                direction={'column'}
                                                item={true}
                                                xs={true}
                                                sx={{
                                                    border: '4px solid red',
                                                    borderRadius: '25px',
                                                    height: '55vh',
                                                    background: '#d3d3d3',
                                                }}
                                            >
                                                <Grid
                                                    container={true}
                                                    item={true}
                                                    direction={'column'}
                                                    justifyContent={'space-around'}
                                                    xs={true}
                                                    // rowSpacing={3}
                                                    alignItems={'center'}
                                                    sx={{
                                                        border: '4px solid yellow',
                                                        height: '100%'
                                                    }}
                                                >
                                                    <Grid
                                                        container={true}
                                                        justifyContent={'center'}
                                                        item={true}
                                                        sx={{
                                                            border: '4px solid black',
                                                        }}
                                                    >
                                                        <Grid
                                                            item={true}
                                                            xs={'auto'}
                                                            sx={{
                                                                border: '2px solid gray',
                                                            }}
                                                        >
                                                            <CountryFlag
                                                                country={exercises[currentCardIndex].matchingTranslations.itemA.language}
                                                                border={true}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            item={true}
                                                            xs={12}
                                                            sx={{
                                                                border: '2px solid gray',
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    typography: {
                                                                        xs: 'h6',
                                                                        sm: 'h5',
                                                                        md: 'h3',
                                                                    },
                                                                }}
                                                                align={"center"}
                                                            >
                                                                {/* TODO: itemA or itemB should be random selection */}
                                                                {exercises[currentCardIndex].matchingTranslations.itemA.value}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid
                                                            item={true}
                                                            xs={12}
                                                            sx={{
                                                                border: '2px solid gray',
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    typography: {
                                                                        xs: 'body2',
                                                                        sm: 'body1',
                                                                        md: 'h6',
                                                                    },
                                                                }}
                                                                align={"center"}
                                                            >
                                                                {t(`${(exercises[currentCardIndex].partOfSpeech as string).toLowerCase()}.${exercises[currentCardIndex].matchingTranslations.itemA.case}`, {ns: 'partOfSpeechCases'})}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container={true}
                                                        justifyContent={'center'}
                                                        item={true}
                                                        sx={{
                                                            border: '4px solid green',
                                                        }}
                                                    >
                                                        <Grid
                                                            item={true}
                                                            xs={'auto'}
                                                            sx={{
                                                                border: '2px solid gray',
                                                            }}
                                                        >
                                                            <CountryFlag
                                                                country={exercises[currentCardIndex].matchingTranslations.itemB.language}
                                                                border={true}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            item={true}
                                                            xs={12}
                                                            sx={{
                                                                border: '2px solid gray',
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    typography: {
                                                                        xs: 'h6',
                                                                        sm: 'h5',
                                                                        md: 'h3',
                                                                    },
                                                                }}
                                                                align={"center"}
                                                            >
                                                                {/* TODO: itemB or itemB should be random selection */}
                                                                {exercises[currentCardIndex].matchingTranslations.itemB.value}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container={true}
                                                        justifyContent={'center'}
                                                        alignItems={'center'}
                                                        item={true}
                                                        sx={{
                                                            border: '4px solid green',
                                                        }}
                                                    >

                                                        <Grid
                                                            item={true}
                                                            xs={8}
                                                            sx={{
                                                                border: '2px solid gray',
                                                            }}
                                                        >
                                                            <Button
                                                                variant={'contained'}
                                                                color={'success'}
                                                                fullWidth={true}
                                                            >
                                                                Check
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        }
                                        {/* BUTTON FORWARD */}
                                        <Grid
                                            container={true}
                                            item={true}
                                            justifyContent={'center'}
                                            // rowSpacing={3}
                                            alignItems={'center'}
                                            xs={'auto'}
                                            sx={{
                                                border: '4px solid red',
                                            }}
                                        >
                                            <Grid
                                                item={true}
                                                xs={true}
                                                sx={{
                                                    border: '4px solid yellow',
                                                    // width: '40px'
                                                }}
                                            >
                                                <IconButton
                                                    color={'primary'}
                                                    disabled={(currentCardIndex === (exercises.length -1))}
                                                    onClick={() => {
                                                        setCurrentCardIndex((currentIndex) => {
                                                            if(currentIndex < (exercises.length -1)){
                                                                return(currentIndex+1)
                                                            } else {
                                                                // Not possible, but TS requires it. Button is disabled.
                                                                return(currentIndex)
                                                            }
                                                        })
                                                    }}
                                                >
                                                    <ChevronRightIcon
                                                        sx={{
                                                            fontSize: 100,
                                                            // width: '40px'
                                                            marginLeft: '-35px',
                                                            marginRight: '-35px'
                                                        }}
                                                    />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                        {/* ACTION BUTTONS */}
                                        <Grid
                                            container={true}
                                            justifyContent={'center'}
                                            item={true}
                                            xs={12}
                                            sx={{
                                                border: '4px solid red',
                                            }}
                                        >
                                            <Grid
                                                item={true}
                                                xs={true}
                                            >
                                                <Button
                                                    variant={'contained'}
                                                    color={'warning'}
                                                    fullWidth={true}
                                                    disabled={isLoadingExercises}
                                                    onClick={() => {
                                                        onClickReset()
                                                    }}
                                                >
                                                    Reset
                                                </Button>
                                            </Grid>
                                            <Grid
                                                item={true}
                                                xs={true}
                                            >
                                                <Button
                                                    variant={'contained'}
                                                    color={'secondary'}
                                                    fullWidth={true}
                                                    disabled={isLoadingExercises}
                                                    onClick={() => {

                                                    }}
                                                >
                                                    Finish
                                                </Button>
                                            </Grid>
                                            <Grid
                                                item={true}
                                                xs={true}
                                            >
                                                <Button
                                                    variant={'contained'}
                                                    color={'primary'}
                                                    fullWidth={true}
                                                    disabled={isLoadingExercises}
                                                    onClick={() => {

                                                    }}
                                                >
                                                    Clue
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                }
                            </Grid>
                    }
            </Grid>
        </Grid>
    )
}