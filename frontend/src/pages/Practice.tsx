import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../app/store";
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {Grid, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import LinearIndeterminate from "../components/Spinner";
import {CardTypeSelection, ExerciseTypeSelection, Lang, PartOfSpeech} from "../ts/enums";
import {ExerciseParameterSelector} from "../components/ExerciseParameterSelector";
import {toast} from "react-toastify";
import {
    getExercisesForUser,
    resetExerciseList,
} from "../features/exercises/exerciseSlice";
import {WordSimpleList} from "../components/WordSimpleList";
import {ExerciseCard} from "../components/ExerciseCard";
import {ExerciseResult} from "../ts/interfaces";


export interface ExerciseParameters {
    languages: Lang[],
    partsOfSpeech: PartOfSpeech[],
    amountOfExercises: number,
    multiLang: CardTypeSelection, // 'Multi-Language' | 'Single-Language' | 'Random',
    type: ExerciseTypeSelection, //  'Multiple-Choice' | 'Text-Input' | 'Random',
    mode: 'Single-Try' | 'Multiple-Tries'
    preSelectedWords?: any[] // simple-word data
}

interface PracticeProps {

}

export const Practice = (props: PracticeProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const {exercises, isErrorExercises, isSuccessExercises, isLoadingExercises, wordsSelectedForExercises} = useSelector((state: any) => state.exercises)
    const {user} = useSelector((state: any) => state.auth)


    const initialListOfPoS: PartOfSpeech[] = [PartOfSpeech.noun, PartOfSpeech.verb] // TODO: add missing PoS as we create BE logic to create exercises

    const initialParameters: ExerciseParameters = {
        languages: user.languages as Lang[],
        partsOfSpeech: initialListOfPoS,
        amountOfExercises: 10,
        multiLang: CardTypeSelection['Random'], // By default, exercises will include exercise cards with single and multi languages exercises
        type: ExerciseTypeSelection['Text-Input'],
        mode: 'Single-Try'
    }

    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    //@ts-ignore
    const [parameters, setParameters] = useState<ExerciseParameters>(initialParameters)
    // if false => display parameter selection
    const [acceptedParameters, setAcceptedParameters] = useState(false)

    const [cardAnswers, setCardAnswers] = useState<ExerciseResult[]>([])

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
        const dispatchParameters = {
            ...parameters,
            // BE expects only id for pre-selected words
            preSelectedWords: (parameters.preSelectedWords !== undefined)
                ? (parameters.preSelectedWords).map((preSelectedWordSimple: any) => {
                    return(preSelectedWordSimple.id)
                })
                : undefined
        }
        dispatch(getExercisesForUser(dispatchParameters))
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
                ...initialParameters,
                // If there are pre-selected words, we must keep the list of available PoS in-sync with the PoS listed in pre-selected words.
                ...(wordsSelectedForExercises.length > 0)
                    ? {partsOfSpeech: getRelevantPoSFromWordSelection(wordsSelectedForExercises)}
                    : {}
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
                border: '4px solid #0072CE',
                borderRadius: '25px',
                paddingX: globalTheme.spacing(2),
                paddingBottom: globalTheme.spacing(2)
            }}
            xs={12}
            md={11}
            lg={12}
            xl={(wordsSelectedForExercises.length > 0) ?10 :9}
        >
            <Grid
                container={true}
                justifyContent={'center'}
                alignItems={'flex-start'}
                item={true}
                spacing={3}
                direction={{
                    xs: 'row',
                    lg: 'row-reverse',
                }}
            >
                <Grid
                    item={true}
                    xs={12}
                    sx={{
                        marginTop: globalTheme.spacing(2)
                    }}
                >
                    <Typography
                        sx={{
                            typography: {
                                xs: 'h3',
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
                        lg={7}
                    >
                        <Grid
                            item={true}
                            xs={10}
                            sx={{
                                display: {xs: 'none', lg: 'inherit'}
                            }}
                        >
                            <Typography
                                sx={{
                                    typography: {
                                        xs: 'body1',
                                        sm: 'h6',
                                        md: 'h5',
                                        xl: 'h5',
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
                            lg={(wordsSelectedForExercises.length > 0) ?5 :8}
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
                        // TODO: this is not displayed => fix later
                        ? <LinearIndeterminate/>
                        :
                            <Grid
                                container={true}
                                justifyContent={'center'}
                                alignItems={'center'}
                                item={true}
                                xs={12}
                                sx={{
                                    height: 'max-content'
                                }}
                            >
                                {(isLoadingExercises && !isSuccessExercises)
                                    ?
                                    <LinearIndeterminate/>
                                    :
                                    <ExerciseCard
                                        type={exercises[currentCardIndex]?.type}
                                        currentCardIndex={currentCardIndex}
                                        setCurrentCardIndex={(value: number) => {
                                            setCurrentCardIndex(value)
                                        }}
                                        exercises={exercises}
                                        isLoadingExercises={isLoadingExercises}
                                        onClickReset={() => {
                                            onClickReset()
                                        }}
                                        exercisesResults={cardAnswers}
                                        setExercisesResults={(newAnswer: ExerciseResult) => {
                                            setCardAnswers((prevState: ExerciseResult[]) => {
                                                // TODO: should we set newAnswer at the index specified in newAnswer.indexInList?
                                                return([
                                                    ...prevState,
                                                    newAnswer
                                                ])
                                            })
                                        }}
                                    />
                                }
                            </Grid>
                    }
            </Grid>
        </Grid>
    )
}