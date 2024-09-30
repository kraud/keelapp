import {Chip, Divider, Grid, InputAdornment, TextField, Typography} from "@mui/material";
import ForgetIcon from '@mui/icons-material/Block';
import SchoolIcon from '@mui/icons-material/School';
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {CountryFlag, getIconByEnvironment} from "./GeneralUseComponents";
import Button from "@mui/material/Button";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {deterministicSort, getVerbPronoun} from "./generalUseFunctions";
import {ExerciseTypeSelection, PartOfSpeech} from "../ts/enums";
import {EquivalentTranslationValues, ExerciseResult, PerformanceParameters} from "../ts/interfaces";
import {Bounce, toast} from "react-toastify";
import globalTheme from "../theme/theme";
import {saveTranslationPerformance} from "../features/exercisePerformance/exercisePerformanceSlice";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../app/store";
import {ExerciseParameters} from "../pages/Practice";
import {NounCasesData, VerbCasesData, WordCasesData} from "../ts/wordCasesDataByPoS";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";

interface InfoChipData {
    label: string,
    value: string
}

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
    parameters: ExerciseParameters
}

export const ExerciseCard = (props: ExerciseCardProps) => {
    const {user} = useSelector((state: any) => state.auth)
    const { t } = useTranslation(['partOfSpeechCases'])
    const wordCasesDescriptions = WordCasesData
    const lessThanSm = useMediaQuery(globalTheme.breakpoints.down("sm"))
    const dispatch = useDispatch<AppDispatch>()

    // TODO: maybe this should filter the list and the element with to 'indexInList' that matches?
    const currentExerciseData = (props.exercises[props.currentCardIndex])
    const currentCardAnswer: ExerciseResult = props.exercisesResults[props.currentCardIndex]
    const correctValue = currentExerciseData?.matchingTranslations.itemB.value

    const [textInputAnswer, setTextInputAnswer] = useState<string>("")

    const disableCheckButton = (
        ((currentCardAnswer!!) && (currentCardAnswer?.answer !== ""))
        ||
        (textInputAnswer === "")
    )

    const componentStyles = {
        textField: {
            fieldset: {
                border: 'none',
            },
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

    const checkTextInputAnswerByDifficulty = (currentAnswer: string, correctValue: string, difficulty: number) => {
        switch(difficulty){
            case(1): {
                const currentAnswerNormalized = currentAnswer.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
                const correctValueNormalized = correctValue.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
                if(
                    (correctValue !== currentAnswer) &&
                    (currentAnswerNormalized === correctValueNormalized)
                ) {
                    return('partially-correct')
                }
                return((correctValueNormalized === currentAnswerNormalized) ? 'correct' : 'wrong')
            }
            case(2): {
                const currentAnswerNoUppercases = currentAnswer.toLowerCase()
                const correctValueNoUppercases = correctValue.toLowerCase()
                if(
                    (correctValue !== currentAnswer) &&
                    (currentAnswerNoUppercases === correctValueNoUppercases)
                ) {
                    return('partially-correct')
                }
                return((currentAnswerNoUppercases === correctValueNoUppercases) ? 'correct' : 'wrong')
            }
            case(3): {
                return((currentAnswer === correctValue) ? 'correct' : 'wrong')
            }
            default: {
                return('wrong')
            }
        }
    }

    const checkIfCorrectAnswer = (answer: string) => {
        let answerStatus: 'wrong' | 'correct' | 'partially-correct' = 'wrong' // partially-correct applies to (TI-difficulty: 1)
        const sanitizedAnswer = answer.trim() // removes whitespace from both ends of this string and returns a new string
        switch (props.type){
            case('Text-Input'):{
                const difficultyTI: number = (props.parameters.type !== 'Multiple-Choice')
                    ? props.parameters.difficultyTI
                    : 2
                answerStatus = checkTextInputAnswerByDifficulty(sanitizedAnswer, correctValue, difficultyTI)
                break
            }
            case('Multiple-Choice'):{
                answerStatus = (correctValue.toLowerCase() === sanitizedAnswer.toLowerCase()) ? 'correct' : 'wrong'
                break
            }
            default:{
                break
            }
        }
        let performanceParameters : PerformanceParameters = {
            translationLanguage: currentExerciseData?.matchingTranslations.itemB.language,
            caseName: currentExerciseData?.matchingTranslations.itemB.case,
        }
        if (currentExerciseData?.performance === undefined){
            performanceParameters = {
                ...performanceParameters,
                user: user._id,
                translationId: currentExerciseData?.matchingTranslations.itemB.translationId,
                word: currentExerciseData?.wordId,
            }
        }
        else{
            performanceParameters = {
                ...performanceParameters,
                performanceId: currentExerciseData?.performance._id,
            }
        }
        // TODO: improve content in toasts
        switch(answerStatus){
            case('correct'): {
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
                performanceParameters = {
                    ...performanceParameters,
                    record: true
                }
                break
            }
            case("wrong"): {
                toast.error(`Incorrect! ❌ - Correct answer: ${correctValue}`, {
                    position: "bottom-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                })
                performanceParameters = {
                    ...performanceParameters,
                    record: false
                }
                break
            }
            case("partially-correct"): {
                toast.warning(`Partially correct! ⚠ - Correct answer: ${correctValue}`, {
                    position: "bottom-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                })
                performanceParameters = {
                    ...performanceParameters,
                    record: true
                }
                break
            }
        }

        const newExerciseResult = {
            answer: answer,
            correct: (answerStatus !== 'wrong'), // partially-correct is still "correct"
            indexInList: props.currentCardIndex,
            time: Date.now(),
        }

        props.setExercisesResults(newExerciseResult)
        dispatch(saveTranslationPerformance(performanceParameters))
    }

    const getOptionsToDisplay = (type: ExerciseTypeSelection) => {
        switch(type){
            case(ExerciseTypeSelection["Multiple-Choice"]): {
                let allOptions: string[] = []
                if(currentExerciseData?.type === 'Multiple-Choice'){
                    allOptions = [
                        currentExerciseData?.matchingTranslations.itemB.value,
                        // we filter here so in case this is a (multiLang:false) exercise, we don't display the correct option twice
                        ...(currentExerciseData?.matchingTranslations.itemB.otherValues).filter((otherValue: string) => {
                            return(otherValue !== currentExerciseData?.matchingTranslations.itemB.value)
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
                                >
                                    <Button
                                        variant={'contained'}
                                        fullWidth={true}
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
                                        sx={{
                                            borderRadius: (currentExerciseData?.multiLang) ? '10px' :'50px'
                                        }}
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
                const shouldDisplayVerbPronoun = (
                    (questionWordDescriptionData !== undefined) &&
                    (isVerbCasesData(questionWordDescriptionData)) &&
                    !(questionWordDescriptionData.isVerbProperty) &&
                    (currentExerciseData?.partOfSpeech === 'Verb')
                )

                return(
                    <Grid
                        item={true}
                        xs={10}
                    >
                        <TextField
                            id={"filled-basic"}
                            placeholder={"Answer here..."}
                            inputProps={{
                                min: 0,
                                style: {
                                    textAlign: (shouldDisplayVerbPronoun) ?'left' :'center',
                                    fontSize: '2.25rem',
                                    paddingLeft: globalTheme.spacing((shouldDisplayVerbPronoun) ?1 :0)
                                }
                            }}
                            variant={"outlined"}
                            size={"medium"}
                            fullWidth={true}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setTextInputAnswer(event.target.value)
                            }}
                            onKeyDown={(e: any) => {
                                if(
                                    (e.key === 'Enter') &&
                                    !disableCheckButton
                                ){
                                    checkIfCorrectAnswer(textInputAnswer)
                                }
                            }}
                            autoComplete={'off'}
                            InputProps={{
                                readOnly: (currentCardAnswer!!) && (currentCardAnswer?.answer !== ""),
                                autoComplete: 'off',
                                startAdornment: (shouldDisplayVerbPronoun)
                                    ?
                                        <InputAdornment
                                            position="start"
                                            sx={{
                                                fontSize: "1.25rem",
                                                paddingLeft: globalTheme.spacing(2)
                                            }}
                                        >
                                            [ {getVerbPronoun(questionWordDescriptionData.person, questionWordDescriptionData.plurality, questionWordDescriptionData.language)} ]
                                        </InputAdornment>
                                    : undefined,
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

    function handleAcknowledgeClick() {
      // const parameters: PerformanceParameters= {
      //     action: "acknowledge",
      //     word: "word",
      //     translation: "translation",
      // }
      //
      // dispatch(saveTranslationPerformance(parameters))
    }

    function handleMasterClick() {
        // const parameters: PerformanceParameters= {
        //     action: "master",
        //     word: ,
        //     translation: ,
        // }
        //
        // dispatch(saveTranslationPerformance(parameters))
    }

    function handleForgetClick() {
        // const parameters: PerformanceParameters= {
        //     action: "forget",
        //     word: "a",
        //     translation: "b",
        // }
        //
        // dispatch(saveTranslationPerformance(parameters))
    }

    const [displayedWordDescriptionData, setDisplayedWordDescriptionData] = useState<NounCasesData | VerbCasesData | undefined>(undefined)
    const [questionWordDescriptionData, setQuestionWordDescriptionData] = useState<NounCasesData | VerbCasesData | undefined>(undefined)
    const getDisplayedWordDescription = () => {
        const currentRelevantPoSData: NounCasesData[] | VerbCasesData[] = wordCasesDescriptions[currentExerciseData?.partOfSpeech as string]
        // @ts-ignore
        const relevantWordDetails = (currentRelevantPoSData).find((currentPoSCaseList: NounCasesData | VerbCasesData) => {
            return(currentPoSCaseList.caseName === currentExerciseData?.matchingTranslations.itemA.case)
        })
        setDisplayedWordDescriptionData(relevantWordDetails)
    }
    const getQuestionWordDescription = () => {
        const currentRelevantPoSData: NounCasesData[] | VerbCasesData[] = wordCasesDescriptions[currentExerciseData?.partOfSpeech as string]
        // @ts-ignore
        const relevantWordDetails = (currentRelevantPoSData).find((currentPoSCaseList: NounCasesData | VerbCasesData) => {
            return(currentPoSCaseList.caseName === currentExerciseData?.matchingTranslations.itemB.case)
        })
        setQuestionWordDescriptionData(relevantWordDetails)
    }

    useEffect(() => {
        if(currentExerciseData !== undefined){
            getDisplayedWordDescription()
            getQuestionWordDescription()
        }
    }, [props.currentCardIndex])

    const getChipListOfWordDetails = (relevantWordDescription: NounCasesData | VerbCasesData, chipColor: 'primary' | 'secondary' | 'info',) => {
        let chips: InfoChipData[] = [{label: 'error', value: 'no data'}]
        if(relevantWordDescription !== undefined){
            chips = getChipFieldsByPoS(relevantWordDescription, currentExerciseData?.partOfSpeech)
        }

        return(
            <Grid
                item={true}
                container={true}
                justifyContent={'center'}
                spacing={1}
            >
                {chips.map((chip: InfoChipData, index: number) => {
                    return(
                         <Grid
                             item={true}
                             key={index}
                         >
                             <Chip
                                 variant={"filled"}
                                 color={chipColor}
                                 label={chip.value}
                                 size={"small"}
                                 sx={{
                                     paddingX: globalTheme.spacing(1),
                                     borderRadius: '10px',
                                 }}
                             />
                         </Grid>
                    )
                })}
            </Grid>
        )
    }

    // Type guard for VerbCasesData
    const isVerbCasesData = (data: NounCasesData | VerbCasesData): data is VerbCasesData => {
        return (data as VerbCasesData).isVerbProperty !== undefined;
    }

    // Type guard for NounCasesData
    const isNounCasesData = (data: NounCasesData | VerbCasesData): data is NounCasesData => {
        return (data as NounCasesData).isNounProperty !== undefined;
    }

    // TODO: some chips could display additional info in Tooltip on hover?
    const getChipFieldsByPoS = (relevantWordDetails: NounCasesData | VerbCasesData, currentPartOfSpeech: PartOfSpeech) => {

        let returnList: InfoChipData[] = []
        switch(currentPartOfSpeech){
            case (PartOfSpeech.verb): {
                if (isVerbCasesData(relevantWordDetails)) {
                    const verbData: VerbCasesData = relevantWordDetails; // Now TypeScript knows this is VerbCasesData
                    if (verbData.isVerbProperty) { // is information about a conjugated verb
                        returnList = [
                            {
                                label: '-',
                                value: verbData.verbPropertyCategory,
                            },
                        ]
                    } else { // is a conjugated verb
                        returnList = [
                            {
                                label: 'Type',
                                value: PartOfSpeech.verb,
                            },
                            {
                                label: 'person',
                                value: t('verbPersonCardinal.number', {ns: 'partOfSpeechCases', count: verbData.person, ordinal: true}),
                            },
                            {
                                label: 'plurality',
                                value: verbData.plurality, // TODO: translate (singular/plural) for all languages
                            },
                            {
                                label: 'tense',
                                value: verbData.tense, // TODO: translate for all languages (later)
                            },
                            ...(verbData.mood !== undefined)
                                ? [{ label: 'mood', value: verbData.mood}]
                                : [],
                        ]
                    }
                }
                break
            }
            case (PartOfSpeech.noun): {
                if (isNounCasesData(relevantWordDetails)) {
                    const nounData: NounCasesData = relevantWordDetails; // Now TypeScript knows this is NounCasesData
                    if (nounData.isNounProperty) { // is information about a noun
                        returnList = [
                            {
                                label: '-',
                                value: nounData.nounPropertyCategory,
                            },
                        ]
                    } else { // is a noun
                        returnList = [
                            {
                                label: 'Type',
                                value: PartOfSpeech.noun,
                            },
                            {
                                label: 'declination',
                                value: nounData.declination,
                            },
                            {
                                label: 'plurality',
                                value: nounData.plurality, // TODO: translate (singular/plural) for all languages
                            },
                        ]
                    }
                }
                break
            }
            default: {

            }
        }
        return(returnList)
    }

    const addPronounToVerbDisplayed = (
        (displayedWordDescriptionData !== undefined) &&
        (isVerbCasesData(displayedWordDescriptionData)) &&
        !(displayedWordDescriptionData.isVerbProperty) &&
        (currentExerciseData?.partOfSpeech === 'Verb')
    )

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
            {
                // If there are no exercises AND we're on a small screen => DON'T DISPLAY BUTTON BACK
                !(
                    (props.exercises.length === 0) &&
                    (lessThanSm)
                ) &&
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
            }
            {!(props.exercises.length > 0)
                ? <Grid
                    container={true}
                    justifyContent={'center'}
                    item={true}
                    xs={10}
                    sx={{
                        paddingX: globalTheme.spacing(2)
                    }}
                >
                    <Grid
                        container={true}
                        justifyContent={"center"}
                        item={true}
                    >
                        <Grid
                            item={true}
                        >
                            <Typography
                                sx={{
                                    typography: {
                                        xs: 'h6',
                                        sm: 'h5',
                                        md: 'h4',
                                    },
                                }}
                            >
                                No match
                            </Typography>
                        </Grid>
                        <Grid
                            container={true}
                            item={true}
                            xs={12}
                            justifyContent={"center"}
                        >
                            <Grid
                                item={true}
                                xs={8}
                            >
                                <Divider
                                    orientation="horizontal"
                                    flexItem={true}
                                    sx={{
                                        "&::before, &::after": {
                                            borderColor: "black",
                                        },
                                    }}
                                >
                                    {getIconByEnvironment({})}
                                </Divider>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid
                        item={true}
                    >
                        <Typography
                            align={'center'}
                            sx={{
                                typography: {
                                    xs: 'body2',
                                    sm: 'body1',
                                    md: 'h6',
                                },
                            }}
                        >
                            Please try again with different settings.
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
                        height: {xs: '40vh', md: '55vh'},
                        background: '#d3d3d3',
                    }}
                >
                    <Grid
                        container={true}
                        item={true}
                        direction={'column'}
                        justifyContent={'space-around'}
                        xs={true}
                        alignItems={'center'}
                        sx={{
                            height: '100%'
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
                            >
                                <CountryFlag
                                    country={currentExerciseData?.matchingTranslations.itemA.language}
                                    border={true}
                                    size={lessThanSm ?2 :3}
                                />
                            </Grid>
                            <Grid
                                container={true}
                                justifyContent={'center'}
                                alignItems={'center'}
                                item={true}
                            >
                                {(addPronounToVerbDisplayed) &&
                                    <Grid
                                        item={true}
                                        xs={'auto'}
                                    >
                                        <Typography
                                            sx={{
                                                typography: {
                                                    xs: 'body1',
                                                    sm: 'h6',
                                                    md: 'h4',
                                                },
                                                paddingRight: globalTheme.spacing(2),
                                                color: 'gray',
                                            }}
                                            align={"center"}
                                        >
                                            [ {getVerbPronoun(displayedWordDescriptionData.person, displayedWordDescriptionData.plurality, displayedWordDescriptionData.language)} ]
                                        </Typography>
                                    </Grid>
                                }
                                <Grid
                                    item={true}
                                    xs={'auto'}
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
                                        {currentExerciseData?.matchingTranslations.itemA.value}
                                    </Typography>
                                </Grid>
                            </Grid>
                            {(displayedWordDescriptionData !== undefined) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                    sx={{
                                        marginTop: globalTheme.spacing(1)
                                    }}
                                >
                                    {getChipListOfWordDetails(displayedWordDescriptionData, "primary")}
                                </Grid>
                            }
                        </Grid>
                        <Grid
                            container={true}
                            justifyContent={'center'}
                            spacing={1}
                            item={true}
                        >
                            <Grid
                                container={true}
                                justifyContent={'center'}
                                item={true}
                            >
                                <Grid
                                    item={true}
                                    xs={'auto'}
                                >
                                    <CountryFlag
                                        country={currentExerciseData?.matchingTranslations.itemB.language}
                                        border={true}
                                        size={lessThanSm ?2 :3}
                                    />
                                </Grid>
                            </Grid>
                            {/* This help should only be visible for (multiLang:false)+(type:Text-Input) exercises */}
                            {(
                                (props.type === 'Text-Input') &&
                                !(currentExerciseData?.multiLang) &&
                                (questionWordDescriptionData !== undefined)
                            ) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    {getChipListOfWordDetails(
                                        questionWordDescriptionData,
                                        'secondary'
                                    )}
                                </Grid>
                            }
                            {getOptionsToDisplay(props.type)}
                            <Grid
                                container={true}
                                item={true}
                                xs={12}
                                justifyContent={"center"}
                            >
                                <Grid
                                    item={true}
                                    xs={'auto'}
                                >
                                    <Tooltip
                                        title={(currentCardAnswer === undefined) ?"Check answer first" :"I don't know this, show me again!"}
                                    >
                                        <span>
                                            <IconButton
                                                disabled={currentCardAnswer === undefined}
                                                color={'success'}
                                                onClick={() => {
                                                    handleMasterClick()
                                                }}
                                            >
                                                <SchoolIcon />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Grid>
                                <Grid
                                    item={true}
                                    xs={'auto'}
                                >
                                    <Tooltip
                                        title={(currentCardAnswer === undefined) ?"Check answer first" :"Don't show this translation again!"}
                                    >
                                        <span>
                                            <IconButton
                                                disabled={currentCardAnswer === undefined}
                                                color={'error'}
                                                onClick={() => {
                                                    handleForgetClick()
                                                }}
                                            >
                                                <ForgetIcon />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            {(props.type === 'Text-Input') &&
                                <Grid
                                    container={true}
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    item={true}
                                >
                                    <Grid
                                        item={true}
                                        xs={8}
                                    >
                                        <Tooltip
                                            title={(disableCheckButton && (currentCardAnswer === undefined)) ?"Input answer first" :""}
                                        >
                                            <span>
                                                <Button
                                                    variant={'contained'}
                                                    color={'success'}
                                                    fullWidth={true}
                                                    onClick={() => {
                                                        checkIfCorrectAnswer(textInputAnswer)
                                                    }}
                                                    disabled={disableCheckButton}
                                                >
                                                    Check
                                                </Button>
                                            </span>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            }
            {/* BUTTON FORWARD */}
            {
                // If there are no exercises AND we're on a small screen => DON'T DISPLAY BUTTON FORWARD
                !(
                    (props.exercises.length === 0) &&
                    (lessThanSm)
                ) &&
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
            }
            {/* BOTTOM ACTION BUTTONS */}
            <Grid
                container={true}
                justifyContent={'space-evenly'}
                item={true}
                xs={12}
                spacing={2}
                sx={{
                    marginY: globalTheme.spacing(2)
                }}
            >
                <Grid
                    item={true}
                    xs={12}
                    // When it's the only button => occupy whole line
                    md={(!(props.exercises.length > 0)) ?10 :4}
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
                {/* If no exercises => error message and oly reset button available */}
                {(props.exercises.length > 0) &&
                    <Grid
                        item={true}
                        xs={12}
                        md={4}
                    >
                        <Button
                            variant={'contained'}
                            color={'primary'}
                            fullWidth={true}
                            disabled={ true || props.isLoadingExercises}
                            onClick={() => {

                            }}
                        >
                            Clue
                        </Button>
                    </Grid>
                }
            </Grid>
        </Grid>
    )
}