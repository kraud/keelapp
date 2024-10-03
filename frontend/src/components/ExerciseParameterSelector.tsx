import React, {useEffect, useState} from "react"
import {Collapse, Divider, Grid, Slider, Typography} from "@mui/material"
import {DnDLanguageOrderSelector} from "./DnDLanguageOrderSelector";
import {CardTypeSelection, ExerciseTypeSelection, Lang, PartOfSpeech, WordSortingSelection} from "../ts/enums";
import {useTranslation} from "react-i18next";
import {CheckboxGroupWithHook, CheckboxItemData} from "./CheckboxGroupFormHook";
import {Controller, useForm} from "react-hook-form";
import {TextInputFormWithHook} from "./TextInputFormHook";
import {ExerciseParameters} from "../pages/Practice";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {RadioGroupWithHook} from "./RadioGroupFormHook";
import globalTheme from "../theme/theme";
import Tooltip from "@mui/material/Tooltip";
import LinearIndeterminate from "./Spinner";

const difficultyMCSliderMarks = [
    {
        value: 0,
        label: 'Level 0',
        // label: '0️⃣',
        tooltipText: 'Any word-type - any language'
    },
    {
        value: 1,
        label: 'Level 1',
        // label: '1️⃣',
        tooltipText: 'Any word-type - same language'
    },
    {
        value: 2,
        label: 'Level 2',
        // label: '2️⃣',
        tooltipText: 'Same word-type - same language'
    },
    {
        value: 3,
        label: 'Level 3',
        // label: '3️⃣',
        tooltipText: 'Same word - same language - different cases'
    },
]

const difficultyTISliderMarks = [
    {
        value: 1,
        label: 'Level 1',
        // label: '1️⃣',
        tooltipText: 'Ignores capitalization, and special characters.'
    },
    {
        value: 2,
        label: 'Level 2',
        // label: '2️⃣',
        tooltipText: 'Only ignores capitalization.'
    },
    {
        value: 3,
        label: 'Level 3',
        // label: '3️⃣',
        tooltipText: 'Zero tolerance - input must match exactly.'
    },
]

interface ExerciseParameterSelectorProps {
    defaultParameters: ExerciseParameters,
    onParametersChange: (data: ExerciseParameters) => void,
    onAccept: () => void
    availableLanguages: Lang[]
    availablePoS: PartOfSpeech[]
    disabled?: boolean
    isLoading?: boolean
    preSelectedWordsDisplayed?: boolean
}

export const ExerciseParameterSelector = (props: ExerciseParameterSelectorProps) => {

    const { t } = useTranslation(['review', 'common'])
    // Languages currently displayed as columns on the selector
    const [allSelectedLanguages, setAllSelectedLanguages] = useState<string[]>(props.availableLanguages)
    // Languages currently not displayed as columns on the table
    const [otherLanguages, setOtherLanguages] = useState<string[]>([])
    const [displayAdvancedOptions, setDisplayAdvancedOptions] = useState<boolean>(false)
    const [difficultyMC, setDifficultyMC] = useState<number>(difficultyMCSliderMarks[1].value)
    const [difficultyTI, setDifficultyTI] = useState<number>(difficultyTISliderMarks[1].value)

    const validationSchema = Yup.object().shape({
        partsOfSpeech: Yup
            .array()
            .test({
                message: 'You must select at least one item',
                test: arr => {
                    return((arr !== undefined) && (arr.length > 0))
                },
            }),
        amountOfExercises: Yup
            .number()
            .required('Amount is required value')
            .typeError("Please enter a valid number")
            .integer('Only whole numbers are valid')
            // TODO: fix this test (+1 is still accepted)
            .test(
                "is-number-only",
                "Only numbers are allowed",
                (value) => (new RegExp(/^[0-9]+$/)).test(value.toString()) // Regex to allow only numbers
            )
            .test(
                "is-positive",
                "Please enter a positive number",
                (value) => value > 0 && 1 / value !== -Infinity
            ),
    })

    const runOnParametersChange = (newParameter?: Object) => {
        const updatedData = {
            languages: allSelectedLanguages as Lang[],
            partsOfSpeech: getPartsOfSpeechValueFromOptionElements(getValues('partsOfSpeech')),
            amountOfExercises: parseInt(getValues('amountOfExercises'), 10),
            //@ts-ignore
            type: getValues('type'),
            multiLang: getValues('multiLang'),
            mode: 'Single-Try',
            difficultyMC: difficultyMC,
            difficultyTI: difficultyTI,
            ...newParameter // name must much a property from ExerciseParameters, so it only overrides that matching property
        }
        props.onParametersChange(updatedData as ExerciseParameters)
    }

    const {
        control,
        formState: { errors, isValid, isDirty }, setValue, getValues,
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const getPartsOfSpeechOptionElements = (listPoS: PartOfSpeech[]) => {
        const formattedOptions = listPoS.map((partOfSpeech: PartOfSpeech) => {
            return({
                label: partOfSpeech,
                value: partOfSpeech
            })
        })
        return(formattedOptions)
    }
    const getPartsOfSpeechValueFromOptionElements = (listOptions: {value: string, label: string}[]) => {
        const valueList = listOptions.map((option: {value: string, label: string}) => {
            return(option.value)
        })
        return(valueList)
    }

    const setValuesInForm = () => {
        setValue(
            'partsOfSpeech',
            getPartsOfSpeechOptionElements(props.defaultParameters.partsOfSpeech),
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
    }

    useEffect(() => {
        setValuesInForm()
    },[props.defaultParameters.partsOfSpeech])

    return(
        <Grid
            container={true}
            direction={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            item={true}
            xs={12}
            sx={{
                border: '4px solid #0072CE',
                borderRadius: '25px',
                paddingX: {
                    xs: globalTheme.spacing(2),
                    lg: (props.preSelectedWordsDisplayed!!)
                        ? globalTheme.spacing(4)
                        : globalTheme.spacing(8)
                },
                paddingBottom: {
                    xs: globalTheme.spacing(2),
                    lg: (props.preSelectedWordsDisplayed!!)
                        ? globalTheme.spacing(3)
                        : globalTheme.spacing(6)
                },
                paddingTop: {
                    xs: globalTheme.spacing(2),
                    lg: (props.preSelectedWordsDisplayed!!)
                        ? globalTheme.spacing(2)
                        : globalTheme.spacing(4)
                },
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
                    <Typography
                        sx={{
                            typography: {
                                xs: 'h6',
                                md: 'h5',
                                lg: 'h4',
                            },
                        }}
                    >
                        Exercise parameters:
                    </Typography>
                </Grid>
            </Grid>
            <Grid
                container={true}
                justifyContent={'center'}
                item={true}
                rowSpacing={2}
            >
                {/* LANGUAGE SELECTION */}
                <Grid
                    item={true}
                    xs={12}
                >
                    <DnDLanguageOrderSelector
                        allSelectedItems={allSelectedLanguages}
                        setAllSelectedItems={(languages: string[]) => {
                            setAllSelectedLanguages(languages)
                            runOnParametersChange({languages: languages})
                        }}
                        otherItems={otherLanguages}
                        setOtherItems={(languages: string[]) => setOtherLanguages(languages)}
                        direction={"horizontal"}
                        selectedItemsTitle={t('fieldLabels.activeLanguages', { ns: 'review' })} // TODO: set custom text
                        otherItemsTitle={t('fieldLabels.hiddenLanguages', { ns: 'review' })} // TODO: set custom text
                        disabled={props.disabled!!}
                        displayItems={'both'}
                        hideIndex={true}
                        alwaysDoubleRow={true}
                    />
                </Grid>
                {/* PART OF SPEECH SELECTION */}
                <Grid
                    item={true}
                    xs={12}
                >
                    <CheckboxGroupWithHook
                        control={control}
                        groupLabel={"Parts of speech"}
                        name={"partsOfSpeech"}
                        options={getPartsOfSpeechOptionElements(props.availablePoS)}
                        defaultValue={[]} // add default items if pre-selected words?
                        // defaultValue={getPartsOfSpeechOptionElements(props.defaultParameters.partsOfSpeech)}
                        errors={errors.partsOfSpeech}
                        onChange={(selectionPoS: CheckboxItemData[]) => {
                            runOnParametersChange()
                        }}
                        fullWidth={false}
                        disabled={props.disabled!!}
                    />
                </Grid>
                {/* NUMBER OF EXERCISES */}
                <Grid
                    item={true}
                    xs={12}
                >
                    <TextInputFormWithHook
                        control={control}
                        label={'Amount of exercises'}
                        name={"amountOfExercises"}
                        defaultValue={(props.defaultParameters.amountOfExercises)}
                        disabled={props.disabled!!}
                        errors={errors.amountOfExercises}
                        onChange={(value: any) => {
                            const newAmount = parseInt(value, 10)
                            runOnParametersChange({amountOfExercises: newAmount})
                        }}
                        fullWidth={true}
                        type={'number'}
                        sxProps={{
                            borderRadius: '10px'
                        }}
                    />
                </Grid>
                {/* TYPE OF EXERCISES */}
                <Grid
                    item={true}
                    xs={12}
                >
                    <RadioGroupWithHook
                        control={control}
                        label={"Exercise type"}
                        name={"type"}
                        options={Object.values(ExerciseTypeSelection)}
                        defaultValue={ExerciseTypeSelection["Text-Input"]}
                        errors={errors.type}
                        onChange={(value: ExerciseTypeSelection) => {
                            runOnParametersChange({type: value})
                        }}
                        fullWidth={false}
                        disabled={props.disabled!!}
                        labelTooltipMessage={
                            'This will determine the type of card to be displayed'
                        }
                        disableUnselect={true}
                    />
                </Grid>
                {/* TYPE OF CARDS */}
                <Grid
                    item={true}
                    xs={12}
                >
                    <RadioGroupWithHook
                        control={control}
                        label={"Languages per card"}
                        name={"multiLang"}
                        options={Object.values(CardTypeSelection)}
                        defaultValue={CardTypeSelection["Random"]}
                        errors={errors.multiLang}
                        onChange={(value: ExerciseTypeSelection) => {
                            runOnParametersChange({multiLang: value})
                        }}
                        fullWidth={false}
                        disabled={props.disabled!!}
                        labelTooltipMessage={
                            'This will determine the amount of languages that will be part of the exercises displayed in an exercise card'
                        }
                        disableUnselect={true}
                    />
                </Grid>
                {/* TODO: add  RadioGroup to specify if words/translation should be selected by performance or at random */}

                <Grid
                    item={true}
                    xs={10}
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
                        <Button
                            variant={'text'}
                            onClick={() => {
                                setDisplayAdvancedOptions((prevValue: boolean) => !prevValue)
                            }}
                        >
                            {(displayAdvancedOptions) ? "Hide advanced settings" : "Display advanced settings"}
                        </Button>
                    </Divider>
                </Grid>
                <Grid
                    container={true}
                    item={true}
                    xs={12}
                >
                    <Collapse
                        in={displayAdvancedOptions}
                        sx={{
                            width: '100%'
                        }}
                    >
                        <Grid
                            container={true}
                            item={true}
                            xs={12}
                            sx={{
                                backgroundColor: '#e1e1e1',
                                borderRadius: '25px',
                                paddingY: globalTheme.spacing(2)
                            }}
                        >
                            <Grid
                                container={true}
                                item={true}
                                xs={12}
                                justifyContent={'center'}
                                spacing={1}
                            >
                                <Grid
                                    item={true}
                                >
                                    <Tooltip
                                        title={(props.defaultParameters.type === 'Text-Input') // only case where this would be disabled
                                            ? "Exercise type must be 'Multiple-Choice' or 'Random' to change this value"
                                            : ""
                                        }
                                    >
                                        <Typography
                                            variant={'body1'}
                                        >
                                            Multiple-Choice difficulty:
                                        </Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid
                                    item={true}
                                    xs={10}
                                >
                                    <Slider
                                        defaultValue={difficultyMCSliderMarks[1].value}
                                        step={null}
                                        valueLabelDisplay={"auto"}
                                        marks={difficultyMCSliderMarks}
                                        valueLabelFormat={(value: number, index: number) => {
                                            return(
                                                (difficultyMCSliderMarks.find((mark) => {
                                                    return (mark.value === value)
                                                }))?.tooltipText
                                            )
                                        }}
                                        onChangeCommitted={(event: React.SyntheticEvent | Event, value: number | number[]) => {
                                            setDifficultyMC(value as number)
                                            runOnParametersChange({difficultyMC: value as number})
                                        }}
                                        min={0}
                                        max={3}
                                        disabled={(props.defaultParameters.type === 'Text-Input')}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container={true}
                            item={true}
                            xs={12}
                            sx={{
                                backgroundColor: '#e1e1e1',
                                borderRadius: '25px',
                                paddingY: globalTheme.spacing(2),
                                marginTop: globalTheme.spacing(3)
                            }}
                        >
                            <Grid
                                container={true}
                                item={true}
                                xs={12}
                                justifyContent={'center'}
                                spacing={1}
                            >
                                <Grid
                                    item={true}
                                >
                                    <Tooltip
                                        title={(props.defaultParameters.type === 'Multiple-Choice') // only case where this would be disabled
                                            ? "Exercise type must be 'Text-Input' or 'Random' to change this value"
                                            : ""
                                        }
                                    >
                                        <Typography
                                            variant={'body1'}
                                        >
                                            Text-Input difficulty:
                                        </Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid
                                    item={true}
                                    xs={10}
                                >
                                    <Slider
                                        defaultValue={difficultyTISliderMarks[1].value}
                                        step={null}
                                        valueLabelDisplay={"auto"}
                                        marks={difficultyTISliderMarks}
                                        valueLabelFormat={(value: number, index: number) => {
                                            return(
                                                (difficultyTISliderMarks.find((mark) => {
                                                    return (mark.value === value)
                                                }))?.tooltipText
                                            )
                                        }}
                                        onChangeCommitted={(event: React.SyntheticEvent | Event, value: number | number[]) => {
                                            setDifficultyTI(value as number)
                                            runOnParametersChange({difficultyTI: value as number})
                                        }}
                                        min={1}
                                        max={3}
                                        disabled={(props.defaultParameters.type === 'Multiple-Choice')}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* WORD/TRANSLATION/CASE SELECTION/SORTING LOGIC */}
                        <Grid
                            container={true}
                            item={true}
                            xs={12}
                            sx={{
                                backgroundColor: '#e1e1e1',
                                borderRadius: '25px',
                                paddingY: globalTheme.spacing(2),
                                marginTop: globalTheme.spacing(3)
                            }}
                        >
                            <Grid
                                container={true}
                                item={true}
                                xs={12}
                                justifyContent={'center'}
                                spacing={1}
                            >
                                <Grid
                                    item={true}
                                    xs={'auto'}
                                >
                                    <RadioGroupWithHook
                                        control={control}
                                        label={"Word selection sorting"}
                                        name={"wordSelection"}
                                        options={Object.values(WordSortingSelection)}
                                        defaultValue={WordSortingSelection["Exercise-Performance"]}
                                        errors={errors.wordSelection}
                                        onChange={(value: ExerciseTypeSelection) => {
                                            runOnParametersChange({wordSelection: value})
                                        }}
                                        fullWidth={false}
                                        disabled={props.disabled!!}
                                        labelTooltipMessage={
                                            "This determines how we select the exercises to display. With 'Exercise-Performance' we prioritize words and translations you haven't practiced yet."
                                        }
                                        disableUnselect={true}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid>


                {/* ACTION BUTTONS */}
                <Grid
                    item={true}
                    xs={8}
                >
                    <Button
                        variant={'contained'}
                        color={'success'}
                        fullWidth={true}
                        disabled={!isValid || props.disabled!!}
                        onClick={() => {
                            props.onAccept()
                        }}
                    >
                        Create exercises
                    </Button>
                    {(props.isLoading!!) && <LinearIndeterminate/>}
                </Grid>
            </Grid>
        </Grid>
    )
}