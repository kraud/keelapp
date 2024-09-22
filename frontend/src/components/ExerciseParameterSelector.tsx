import React, {useEffect, useState} from "react"
import {Grid, Typography} from "@mui/material"
import {DnDLanguageOrderSelector} from "./DnDLanguageOrderSelector";
import {CardTypeSelection, ExerciseTypeSelection, Lang, PartOfSpeech} from "../ts/enums";
import {useTranslation} from "react-i18next";
import {CheckboxGroupWithHook, CheckboxItemData} from "./CheckboxGroupFormHook";
import {useForm} from "react-hook-form";
import {TextInputFormWithHook} from "./TextInputFormHook";
import {ExerciseParameters} from "../pages/Practice";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {RadioGroupWithHook} from "./RadioGroupFormHook";

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
                border: '2px solid black'
            }}
        >
            <Grid
                container={true}
                justifyContent={'center'}
                item={true}
                sx={{
                    border: '2px solid blue'
                }}
            >
                <Grid
                    item={true}
                    xs={'auto'}
                    sx={{
                        border: '2px solid red'
                    }}
                >
                    <Typography
                        variant={'h6'}
                    >
                        Parameters:
                    </Typography>
                </Grid>
            </Grid>
            <Grid
                container={true}
                justifyContent={'center'}
                item={true}
                sx={{
                    border: '2px solid blue'
                }}
            >
                {/* LANGUAGE SELECTION */}
                <Grid
                    item={true}
                    xs={12}
                    sx={{
                        border: '2px solid red'
                    }}
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
                    />
                </Grid>
                {/* PART OF SPEECH SELECTION */}
                <Grid
                    item={true}
                    xs={12}
                    sx={{
                        border: '2px solid red'
                    }}
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
                    sx={{
                        border: '2px solid red'
                    }}
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
                    />
                </Grid>
                {/* TYPE OF EXERCISES */}
                <Grid
                    item={true}
                    xs={12}
                    sx={{
                        border: '2px solid red'
                    }}
                >
                    <RadioGroupWithHook
                        control={control}
                        label={"Type"}
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
                    sx={{
                        border: '2px solid red'
                    }}
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

                {/* ACTION BUTTONS */}
                <Grid
                    item={true}
                    xs={8}
                    sx={{
                        border: '2px solid red'
                    }}
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
                        Continue
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}