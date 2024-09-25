import React, {useEffect, useState} from "react"
import {Collapse, Divider, Grid, Slider, Typography} from "@mui/material"
import {DnDLanguageOrderSelector} from "./DnDLanguageOrderSelector";
import {CardTypeSelection, ExerciseTypeSelection, Lang, PartOfSpeech} from "../ts/enums";
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

interface ExerciseParameterSelectorProps {
    defaultParameters: ExerciseParameters,
    onParametersChange: (data: ExerciseParameters) => void,
    onAccept: () => void
    availableLanguages: Lang[]
    availablePoS: PartOfSpeech[]
    disabled?: boolean
}

export const ExerciseParameterSelector = (props: ExerciseParameterSelectorProps) => {

    const { t } = useTranslation(['review', 'common'])
    // Languages currently displayed as columns on the selector
    const [allSelectedLanguages, setAllSelectedLanguages] = useState<string[]>(props.availableLanguages)
    // Languages currently not displayed as columns on the table
    const [otherLanguages, setOtherLanguages] = useState<string[]>([])
    const [displayAdvancedOptions, setDisplayAdvancedOptions] = useState<boolean>(false)
    const [difficultyMC, setDifficultyMC] = useState<number>(difficultyMCSliderMarks[1].value)

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
            rowSpacing={2}
            item={true}
            xs={12}
            sx={{
                border: '4px solid #0072CE',
                borderRadius: '25px',
                paddingX: globalTheme.spacing(2),
                paddingBottom: globalTheme.spacing(2)
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
                        Parameters:
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
                        <Tooltip
                            title={!(['Random', 'Multiple-Choice'].includes(props.defaultParameters.type))
                                ? "'Text-Input' exercises don't have advanced options yet"
                                : ""
                            }
                        >
                            {/* span required to display tooltip over disabled button */}
                            <span>
                                <Button
                                    variant={'text'}
                                    onClick={() => {
                                        setDisplayAdvancedOptions((prevValue: boolean) => !prevValue)
                                    }}
                                    disabled={!(['Random', 'Multiple-Choice'].includes(props.defaultParameters.type))}
                                >
                                    {(displayAdvancedOptions) ? "Hide advanced options" : "Display advanced options"}
                                </Button>
                            </span>
                        </Tooltip>
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
                        {(['Random', 'Multiple-Choice'].includes(props.defaultParameters.type)) &&
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
                                        <Typography
                                            variant={'body1'}
                                        >
                                            Multiple-Choice difficulty:
                                        </Typography>
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
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        }
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
                </Grid>
            </Grid>
        </Grid>
    )
}