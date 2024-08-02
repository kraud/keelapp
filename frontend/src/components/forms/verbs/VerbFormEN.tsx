import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {TranslationItem, WordItem} from "../../../ts/interfaces";
import {Lang, VerbCases} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../../app/store";
import {
    getAutocompletedEnglishVerbData,
} from "../../../features/autocompletedTranslation/autocompletedTranslationSlice";
import LinearIndeterminate from "../../Spinner";
import {setTimerTriggerFunction} from "../../generalUseFunctions";
import {AutocompleteButtonWithStatus} from "../AutocompleteButtonWithStatus";
import Typography from "@mui/material/Typography";

interface VerbFormENProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the english translation of a verb (and handles the validations)
export function VerbFormEN(props: VerbFormENProps) {
    const dispatch = useDispatch<AppDispatch>()
    const {autocompletedTranslationVerbEN, isErrorAT, isSuccessAT, isLoadingAT, messageAT} = useSelector((state: any) => state.autocompletedTranslations)

    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        simplePresent1s: Yup.string()
            .required("This simple present field is required")
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        simplePresent2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        simplePresent3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        simplePresent1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        simplePresent3pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    // Optional fields: can be filled with autocomplete
    //  Simple time - present
    // Mandatory fields: can't be autocompleted
    const [simplePresent1s, setSimplePresent1s] = useState("")
    const [simplePresent2s, setSimplePresent2s] = useState("")
    const [simplePresent3s, setSimplePresent3s] = useState("")
    const [simplePresent1pl, setSimplePresent1pl] = useState("")
    const [simplePresent3pl, setSimplePresent3pl] = useState("")

    useEffect(() => {
        const currentCases: WordItem[] = [
            {
                caseName: VerbCases.simplePresent1sEN,
                word: simplePresent1s
            },
            {
                caseName: VerbCases.simplePresent2sEN,
                word: simplePresent2s
            },
            {
                caseName: VerbCases.simplePresent3sEN,
                word: simplePresent3s
            },
            {
                caseName: VerbCases.simplePresent1plEN,
                word: simplePresent1pl
            },
            {
                caseName: VerbCases.simplePresent3plEN,
                word: simplePresent3pl
            },
        ]
        props.updateFormData({
            language: Lang.EN,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [
        simplePresent1s, simplePresent2s, simplePresent3s, simplePresent1pl, simplePresent3pl, isValid
    ])

    const setValuesInForm = (translationDataToInsert: TranslationItem) => {
        const simplePresent1sValue: string = getWordByCase(VerbCases.simplePresent1sEN, translationDataToInsert)
        const simplePresent2sValue: string = getWordByCase(VerbCases.simplePresent2sEN, translationDataToInsert)
        const simplePresent3sValue: string = getWordByCase(VerbCases.simplePresent3sEN, translationDataToInsert)
        const simplePresent1plValue: string = getWordByCase(VerbCases.simplePresent1plEN, translationDataToInsert)
        const simplePresent3plValue: string = getWordByCase(VerbCases.simplePresent3plEN, translationDataToInsert)

        setValue(
            'simplePresent1s',
            simplePresent1sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimplePresent1s(simplePresent1sValue)
        setValue(
            'simplePresent2s',
            simplePresent2sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimplePresent2s(simplePresent2sValue)
        setValue(
            'simplePresent3s',
            simplePresent3sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimplePresent3s(simplePresent3sValue)
        setValue(
            'simplePresent1pl',
            simplePresent1plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimplePresent1pl(simplePresent1plValue)
        setValue(
            'simplePresent3pl',
            simplePresent3plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimplePresent3pl(simplePresent3plValue)
    }

    // This will only be run on first render
    // we use it to populate the form fields with the previously added information
    useEffect(() => {
        if(currentTranslationData.cases!){
            setValuesInForm(currentTranslationData)
        }
    },[])


    // ------------------ AUTOCOMPLETE LOGIC ------------------

    const onAutocompleteClick = async () => {
        setValuesInForm(autocompletedTranslationVerbEN)
    }

    // before making the request, we check if the query is correct according to the form's validation
    const validAutocompleteRequest = errors['simplePresent1s'] === undefined
    useEffect(() => {
        if((simplePresent1s !== "") && (validAutocompleteRequest)){
            setTimerTriggerFunction(
                () => {
                    dispatch(getAutocompletedEnglishVerbData(simplePresent1s))
                },
                600
            )
        }
    },[simplePresent1s, validAutocompleteRequest])

    return(
        <Grid
            container={true}
        >
            <form
                style={{
                    width: '100%'
                }}
            >
                <Grid
                    container={true}
                    justifyContent={"left"}
                    item={true}
                    spacing={2}
                >
                    {/*{!(props.displayOnly) &&*/}
                    {(false) && // TODO: change once verbEN autocomplete implemented
                        <Grid
                            container={true}
                            item={true}
                            xs={12}
                            rowSpacing={1}
                            spacing={1}
                            justifyContent={'center'}
                            alignItems={"flex-end"}
                        >
                            <AutocompleteButtonWithStatus
                                tooltipLabels={{
                                    emptyQuery: "Please input 'infinitive non-finite simple' first.",
                                    noMatch: "Sorry, we don't know this word!",
                                    foundMatch: "There is information about this word stored in our system."
                                }}
                                queryValue={simplePresent1s}
                                autocompleteResponse={autocompletedTranslationVerbEN}
                                loadingState={isLoadingAT}
                                forceDisabled={true} // TODO: change once verbEN autocomplete implemented
                                onAutocompleteClick={() => onAutocompleteClick()}
                            />
                            <Grid
                                item={true}
                                xs={9}
                                sx={{
                                    maxHeight: 'max-content'
                                }}
                            >
                                {(isLoadingAT) && <LinearIndeterminate/>}
                            </Grid>
                        </Grid>
                    }
                    <Grid
                        container={true}
                        item={true}
                        justifyContent={"center"}
                    >
                        <Grid
                            item={true}
                            xs={'auto'}
                        >
                            <Typography
                                variant={'h4'}
                                alignContent={'center'}
                                sx={{
                                    textDecoration: 'underline',
                                }}
                            >
                                Simple:
                            </Typography>
                        </Grid>
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <Typography
                                variant={'h5'}
                            >
                                Present:
                            </Typography>
                        </Grid>
                    </Grid>
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simplePresent1s)) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"I"}
                                name={"simplePresent1s"}
                                defaultValue={""}
                                errors={errors.simplePresent1s}
                                onChange={(value: any) => {
                                    setSimplePresent1s(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simplePresent2s)) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"You"} // TODO: should change if user picks other spanish style
                                name={"simplePresent2s"}
                                defaultValue={""}
                                errors={errors.simplePresent2s}
                                onChange={(value: any) => {
                                    setSimplePresent2s(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simplePresent3s)) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"He/She/it"}
                                name={"simplePresent3s"}
                                defaultValue={""}
                                errors={errors.simplePresent3s}
                                onChange={(value: any) => {
                                    setSimplePresent3s(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simplePresent1pl)) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"We"}
                                name={"simplePresent1pl"}
                                defaultValue={""}
                                errors={errors.simplePresent1pl}
                                onChange={(value: any) => {
                                    setSimplePresent1pl(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simplePresent3pl)) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"They"} // TODO: should change if user picks other spanish style
                                name={"simplePresent3pl"}
                                defaultValue={""}
                                errors={errors.simplePresent3pl}
                                onChange={(value: any) => {
                                    setSimplePresent3pl(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                </Grid>
            </form>
        </Grid>
    )
}