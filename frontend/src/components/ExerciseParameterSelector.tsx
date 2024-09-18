import React, {useEffect, useState} from "react"
import {Grid, InputAdornment, Typography} from "@mui/material"
import {DnDLanguageOrderSelector} from "./DnDLanguageOrderSelector";
import {Lang, PartOfSpeech, VerbCaseTypeDE} from "../ts/enums";
import {useTranslation} from "react-i18next";
import {CheckboxGroupWithHook, CheckboxItemData} from "./CheckboxGroupFormHook";
import {useForm} from "react-hook-form";
import {TextInputFormWithHook} from "./TextInputFormHook";
import {ExerciseParameters} from "../pages/Practice";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";

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
    const [amountOfExercises, setAmountOfExercises] = useState<number>(10)
    const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState<PartOfSpeech[]>(props.defaultParameters.partsOfSpeech)


    const validationSchema = Yup.object().shape({
        partsOfSpeech: Yup
            .array()
            .test({
                message: 'You must select at least one item',
                test: arr => {
                    return((arr !== undefined) && (arr.length > 0))
                },
            }),
        amountExercises: Yup
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

    useEffect(() => {
        props.onParametersChange({
            languages: allSelectedLanguages as Lang[],
            partsOfSpeech: selectedPartOfSpeech, // TODO: keep adding PoS as we create the GroupedCategories JSON objects
            amountOfExercises: amountOfExercises,
            input: 'Text-Input',
            mode: 'Single-Try'
        })
    },[allSelectedLanguages, selectedPartOfSpeech, amountOfExercises])

    const {
        control,
        formState: { errors, isValid, isDirty }, setValue,
    } = useForm({
        resolver: yupResolver(validationSchema), // TODO: create Schema later, to support PoS selection and exercise amount number
        mode: "all", // Triggers validation/errors without having to submit
    })

    const getPartsOfSpeechOptionElements = (listPoS: PartOfSpeech[]) => {
        const formattedOptions = listPoS.map((partOfSpeech: PartOfSpeech) => {
            return({
                label: partOfSpeech,
                value:PartOfSpeech[(partOfSpeech).toLowerCase()]
            })
        })
        return(formattedOptions)
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
        // setSelectedPartOfSpeech(props.defaultParameters.partsOfSpeech)
    }

    useEffect(() => {
        setValuesInForm()
    },[props.defaultParameters])

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
                        setAllSelectedItems={(languages: string[]) => setAllSelectedLanguages(languages)}
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
                        errors={errors.partsOfSpeech}
                        onChange={(selectionPoS: CheckboxItemData[]) => {
                            setSelectedPartOfSpeech(
                                selectionPoS.map((selection) => {
                                    return(selection.value)
                                })
                            )
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
                        name={"amountExercises"}
                        defaultValue={"10"}
                        disabled={props.disabled!!}
                        errors={errors.amountExercises}
                        onChange={(value: any) => {
                            setAmountOfExercises(parseInt(value, 10))
                        }}
                        fullWidth={true}
                        type={'number'}
                        // disabled={props.displayOnly}
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