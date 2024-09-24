import {Grid, TextField, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {CountryFlag} from "./GeneralUseComponents";
import Button from "@mui/material/Button";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {deterministicSort} from "./generalUseFunctions";
import {ExerciseTypeSelection} from "../ts/enums";
import {EquivalentTranslationValues, ExerciseResult} from "../ts/interfaces";
import {Bounce, toast} from "react-toastify";
import globalTheme from "../theme/theme";


interface ExerciseCardProps {
    type: ExerciseTypeSelection,
    currentCardIndex: number,
    setCurrentCardIndex: (index: number) => void
    exercises: EquivalentTranslationValues[],
    isLoadingExercises: boolean
    onClickReset: () => void
    onClickCheck?: () => void
    exercisesResults: ExerciseResult[]
    setExercisesResults: (newResult: ExerciseResult) => void
}

export const ExerciseCard = (props: ExerciseCardProps) => {
    const { t } = useTranslation(['partOfSpeechCases'])
    const correctValue = props.exercises[props.currentCardIndex].matchingTranslations.itemB.value
    const [textInputAnswer, setTextInputAnswer] = useState<string>("")

    // TODO: maybe this should filter the list and the element with to 'indexInList' that matches?
    const currentCardAnswer: ExerciseResult = props.exercisesResults[props.currentCardIndex]

    const componentStyles = {
        textField: {
            fieldset: {
                border: 'none',
            },
            input: {
                border: `4px solid ${
                    !(currentCardAnswer!!)
                        ? globalTheme.palette.primary.main // default before answering
                        : (currentCardAnswer!!) && (currentCardAnswer.correct)
                            ? globalTheme.palette.success.main // correct answer
                            : globalTheme.palette.error.main // wrong answer
                }`,
                borderRadius: '25px',
                background: "white"
            }
        }
    }

    const checkIfCorrectAnswer = (answer: string) => {
        let answerStatus: boolean = false
        switch (props.type){
            case('Text-Input'):{
                answerStatus = (correctValue.toLowerCase() === answer.toLowerCase())
                break
            }
            case('Multiple-Choice'):{
                answerStatus = (correctValue.toLowerCase() === answer.toLowerCase())
                break
            }
            default:{
                break
            }
        }
        // TODO: improve content in toasts
        if(answerStatus){
            toast.success('Correct! ✅', {
                position: "bottom-center",
                autoClose: 500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            })
        } else {
            toast.error(`Incorrect! ❌ - Correct answer: ${correctValue}`, {
                position: "bottom-center",
                autoClose: 500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            })

        }
        const newExerciseResult = {
            answer: answer,
            correct: answerStatus,
            indexInList: props.currentCardIndex,
            time: Date.now(),
        }
        props.setExercisesResults(newExerciseResult)
    }

    const getOptionsToDisplay = (type: ExerciseTypeSelection) => {
        switch(type){
            case(ExerciseTypeSelection["Multiple-Choice"]): {
                let allOptions: string[] = []
                const currentExercise: EquivalentTranslationValues = props.exercises[props.currentCardIndex]
                if(currentExercise.type === 'Multiple-Choice'){
                    allOptions = [
                        currentExercise.matchingTranslations.itemB.value,
                        // we filter here so in case this is a (multiLang:false) exercise, we don't display the correct option twice
                        ...(currentExercise.matchingTranslations.itemB.otherValues).filter((otherValue: string) => {
                            return(otherValue !== currentExercise.matchingTranslations.itemB.value)
                        })
                    ]
                }
                allOptions = deterministicSort(allOptions)

                return(
                    <Grid
                        container={true}
                        item={true}
                        alignItems={'center'}
                        justifyContent={'center'}
                        rowSpacing={2}
                    >
                        {allOptions.map((option: string, index: number) => {
                            return(
                                <Grid
                                    key={index}
                                    item={true}
                                    xs={8}
                                    sx={{
                                        // border: '2px solid gray',
                                    }}
                                >
                                    <Button
                                        variant={'contained'}
                                        // color={'secondary'}
                                        fullWidth={true}
                                        // disabled={(currentCardAnswer !== undefined)}
                                        onClick={() => {
                                            if((currentCardAnswer === undefined)) {
                                                checkIfCorrectAnswer(option)
                                            }
                                        }}
                                        color={
                                            !(currentCardAnswer!!)
                                                ? 'secondary'
                                                : (currentCardAnswer!!) && (currentCardAnswer.answer === option)
                                                    ? (currentCardAnswer.correct)
                                                        ? 'success'
                                                        : 'error'
                                                    : 'inherit' // should be gray/disabled
                                        }
                                    >
                                        {option}
                                    </Button>
                                </Grid>
                            )
                        })}
                    </Grid>
                )
            }
            case(ExerciseTypeSelection["Text-Input"]): {
                return(
                    <Grid
                        item={true}
                        xs={10}
                        sx={{
                            // border: '2px solid gray',
                        }}
                    >
                        {/* TODO: this should be a text-input field */}
                        <TextField
                            id={"filled-basic"}
                            placeholder={"Answer here..."}
                            inputProps={{min: 0, style: { textAlign: 'center', fontSize: '2.25rem' }}}
                            variant={"outlined"}
                            size={"medium"}
                            fullWidth={true}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setTextInputAnswer(event.target.value)
                            }}
                            // disabled={(currentCardAnswer!!) && (currentCardAnswer?.answer !== "")}

                            InputProps={{
                                readOnly: (currentCardAnswer!!) && (currentCardAnswer?.answer !== ""),
                            }}
                            value={textInputAnswer}
                            sx={componentStyles.textField}
                        />
                    </Grid>
                )
            }
            default: {
                return('Something went wrong with this exercise... My bad.')
            }
        }
    }

    const resetCardState = () => {
        setTextInputAnswer("")
    }

    useEffect(() => {
        if(currentCardAnswer !== undefined){
            setTextInputAnswer(currentCardAnswer.answer)
        }
    }, [props.currentCardIndex])

    return(
        <Grid
            container={true}
            justifyContent={'center'}
            alignItems={'center'}
            item={true}
            xs={12}
            sm={10}
            md={8}
            lg={7}
            xl={6}
        >
            {/*BUTTON BACK*/}
            <Grid
                container={true}
                item={true}
                justifyContent={'center'}
                alignItems={'center'}
                xs={'auto'}
            >
                <Grid
                    item={true}
                    xs={true}
                >
                    <IconButton
                        color={'primary'}
                        disabled={
                            (props.currentCardIndex === 0)
                        }
                        onClick={() => {
                            if(props.currentCardIndex > 0){
                                props.setCurrentCardIndex((props.currentCardIndex-1))
                            } else {
                                // Not possible, but TS requires it. Button is disabled.
                                props.setCurrentCardIndex((props.currentCardIndex))
                            }
                            resetCardState()
                        }}
                    >
                        <ChevronLeftIcon
                            sx={{
                                fontSize: 100,
                                marginLeft: '-35px',
                                marginRight: '-35px'
                            }}
                        />
                    </IconButton>
                </Grid>
            </Grid>
            {!(props.exercises.length > 0)
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
                        border: '4px solid #0072CE',
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
                            // border: '4px solid yellow',
                            height: '100%'
                        }}
                    >
                        <Grid
                            container={true}
                            justifyContent={'center'}
                            item={true}
                            sx={{
                                // border: '4px solid black',
                            }}
                        >
                            <Grid
                                item={true}
                                xs={'auto'}
                                sx={{
                                    // border: '2px solid gray',
                                }}
                            >
                                <CountryFlag
                                    country={props.exercises[props.currentCardIndex].matchingTranslations.itemA.language}
                                    border={true}
                                />
                            </Grid>
                            <Grid
                                item={true}
                                xs={12}
                                sx={{
                                    // border: '2px solid gray',
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
                                    {props.exercises[props.currentCardIndex].matchingTranslations.itemA.value}
                                </Typography>
                            </Grid>
                            <Grid
                                item={true}
                                xs={12}
                                sx={{
                                    // border: '2px solid gray',
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
                                    {t(`${(props.exercises[props.currentCardIndex].partOfSpeech as string).toLowerCase()}.${props.exercises[props.currentCardIndex].matchingTranslations.itemA.case}`, {ns: 'partOfSpeechCases'})}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container={true}
                            justifyContent={'center'}
                            spacing={1}
                            item={true}
                            sx={{
                                // border: '4px solid green',
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
                                        // border: '2px solid gray',
                                    }}
                                >
                                    <CountryFlag
                                        country={props.exercises[props.currentCardIndex].matchingTranslations.itemB.language}
                                        border={true}
                                    />
                                </Grid>
                            </Grid>
                            {/* This help should only be visible for (multiLang:false)+(type:Text-Input) exercises */}
                            {(
                                (props.type === 'Text-Input') &&
                                !(props.exercises[props.currentCardIndex].multiLang)
                            ) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                    sx={{
                                        // border: '2px solid gray',
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
                                        {t(`${(props.exercises[props.currentCardIndex].partOfSpeech as string).toLowerCase()}.${props.exercises[props.currentCardIndex].matchingTranslations.itemB.case}`, {ns: 'partOfSpeechCases'})}
                                    </Typography>
                                </Grid>
                            }
                            {getOptionsToDisplay(props.type)}
                        </Grid>
                        {(props.type === 'Text-Input') &&
                            <Grid
                                container={true}
                                justifyContent={'center'}
                                alignItems={'center'}
                                item={true}
                                sx={{
                                    // border: '4px solid green',
                                }}
                            >

                                <Grid
                                    item={true}
                                    xs={8}
                                    sx={{
                                        // border: '2px solid gray',
                                    }}
                                >
                                    <Button
                                        variant={'contained'}
                                        color={'success'}
                                        fullWidth={true}
                                        onClick={() => {
                                            checkIfCorrectAnswer(textInputAnswer)
                                        }}
                                        disabled={
                                            ((currentCardAnswer!!) && (currentCardAnswer?.answer !== ""))
                                            ||
                                            (textInputAnswer === "")
                                        }
                                    >
                                        Check
                                    </Button>
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                </Grid>
            }
            {/* BUTTON FORWARD */}
            <Grid
                container={true}
                item={true}
                justifyContent={'center'}
                alignItems={'center'}
                xs={'auto'}
                sx={{
                    // border: '4px solid red',
                }}
            >
                <Grid
                    item={true}
                    xs={true}
                    sx={{
                        // border: '4px solid yellow',
                    }}
                >
                    <IconButton
                        color={'primary'}
                        disabled={
                            (props.currentCardIndex === (props.exercises.length -1))
                            ||
                            !(currentCardAnswer!!)
                        }
                        onClick={() => {
                            if(props.currentCardIndex < (props.exercises.length -1)){
                                props.setCurrentCardIndex(props.currentCardIndex+1)
                            } else {
                                // Not possible, but TS requires it. Button is disabled.
                                props.setCurrentCardIndex(props.currentCardIndex)
                            }
                            resetCardState()
                        }}
                    >
                        <ChevronRightIcon
                            sx={{
                                fontSize: 100,
                                marginLeft: '-35px',
                                marginRight: '-35px'
                            }}
                        />
                    </IconButton>
                </Grid>
            </Grid>
            {/* BOTTOM ACTION BUTTONS */}
            <Grid
                container={true}
                justifyContent={'space-evenly'}
                item={true}
                xs={12}
                sx={{
                    // border: '4px solid red',
                    marginY: globalTheme.spacing(2)
                }}
            >
                <Grid
                    item={true}
                    xs={12}
                    md={3}
                >
                    <Button
                        variant={'contained'}
                        color={'warning'}
                        fullWidth={true}
                        disabled={props.isLoadingExercises}
                        onClick={() => {
                            props.onClickReset()
                        }}
                    >
                        Reset
                    </Button>
                </Grid>
                <Grid
                    item={true}
                    xs={12}
                    md={3}
                >
                    <Button
                        variant={'contained'}
                        color={'secondary'}
                        fullWidth={true}
                        disabled={props.isLoadingExercises}
                        onClick={() => {

                        }}
                    >
                        Finish
                    </Button>
                </Grid>
                <Grid
                    item={true}
                    xs={12}
                    md={3}
                >
                    <Button
                        variant={'contained'}
                        color={'primary'}
                        fullWidth={true}
                        disabled={props.isLoadingExercises}
                        onClick={() => {

                        }}
                    >
                        Clue
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}