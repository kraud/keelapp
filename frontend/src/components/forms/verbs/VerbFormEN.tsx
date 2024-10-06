import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid, InputAdornment} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {TranslationItem, WordItem} from "../../../ts/interfaces";
import {Lang, VerbCases, VerbRegularity} from "../../../ts/enums";
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
import {RadioGroupWithHook} from "../../RadioGroupFormHook";
import {useTranslation} from "react-i18next";

interface VerbFormENProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the english translation of a verb (and handles the validations)
export function VerbFormEN(props: VerbFormENProps) {
    const { t } = useTranslation(['wordRelated'])
    const dispatch = useDispatch<AppDispatch>()
    const {autocompletedTranslationVerbEN, isErrorAT, isSuccessAT, isLoadingAT, messageAT} = useSelector((state: any) => state.autocompletedTranslations)

    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        //  Properties
        regularity: Yup.string()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' }))
            .matches(/^(regular|irregular)?$/, t('wordForm.verb.errors.formEN.regularityRequired', { ns: 'wordRelated' })),
        //  Simple time - present
        simplePresent1s: Yup.string()
            .required(t('wordForm.verb.errors.formEN.simplePresentRequired', { ns: 'wordRelated' }))
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        simplePresent2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        simplePresent3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        simplePresent1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        simplePresent3pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        //  Simple time - past
        simplePast1s: Yup.string()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        simplePast2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        simplePast3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        simplePast1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        simplePast3pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        //  Simple time - future
        simpleFuture1s: Yup.string()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        simpleFuture2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        simpleFuture3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        simpleFuture1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        simpleFuture3pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        //  Simple time - conditional
        simpleConditional1s: Yup.string()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        simpleConditional2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        simpleConditional3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        simpleConditional1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        simpleConditional3pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [regularity, setRegularity] = useState<"regular"|"irregular"|"">("")
    // Optional fields: can be filled with autocomplete
    //  Simple time - present
    const [simplePresent1s, setSimplePresent1s] = useState("")
    const [simplePresent2s, setSimplePresent2s] = useState("")
    const [simplePresent3s, setSimplePresent3s] = useState("")
    const [simplePresent1pl, setSimplePresent1pl] = useState("")
    const [simplePresent3pl, setSimplePresent3pl] = useState("")
    //  Simple time - past
    const [simplePast1s, setSimplePast1s] = useState("")
    const [simplePast2s, setSimplePast2s] = useState("")
    const [simplePast3s, setSimplePast3s] = useState("")
    const [simplePast1pl, setSimplePast1pl] = useState("")
    const [simplePast3pl, setSimplePast3pl] = useState("")
    //  Simple time - future
    const [simpleFuture1s, setSimpleFuture1s] = useState("")
    const [simpleFuture2s, setSimpleFuture2s] = useState("")
    const [simpleFuture3s, setSimpleFuture3s] = useState("")
    const [simpleFuture1pl, setSimpleFuture1pl] = useState("")
    const [simpleFuture3pl, setSimpleFuture3pl] = useState("")
    //  Simple time - conditional
    const [simpleConditional1s, setSimpleConditional1s] = useState("")
    const [simpleConditional2s, setSimpleConditional2s] = useState("")
    const [simpleConditional3s, setSimpleConditional3s] = useState("")
    const [simpleConditional1pl, setSimpleConditional1pl] = useState("")
    const [simpleConditional3pl, setSimpleConditional3pl] = useState("")

    useEffect(() => {
        const currentCases: WordItem[] = [
            {
                caseName: VerbCases.regularityEN,
                word: regularity
            },
            // PRESENT
            {
                caseName: VerbCases.simplePresent1sEN,
                word: simplePresent1s.toLowerCase()
            },
            {
                caseName: VerbCases.simplePresent2sEN,
                word: simplePresent2s.toLowerCase()
            },
            {
                caseName: VerbCases.simplePresent3sEN,
                word: simplePresent3s.toLowerCase()
            },
            {
                caseName: VerbCases.simplePresent1plEN,
                word: simplePresent1pl.toLowerCase()
            },
            {
                caseName: VerbCases.simplePresent3plEN,
                word: simplePresent3pl.toLowerCase()
            },
            // PAST
            {
                caseName: VerbCases.simplePast1sEN,
                word: simplePast1s.toLowerCase()
            },
            {
                caseName: VerbCases.simplePast2sEN,
                word: simplePast2s.toLowerCase()
            },
            {
                caseName: VerbCases.simplePast3sEN,
                word: simplePast3s.toLowerCase()
            },
            {
                caseName: VerbCases.simplePast1plEN,
                word: simplePast1pl.toLowerCase()
            },
            {
                caseName: VerbCases.simplePast3plEN,
                word: simplePast3pl.toLowerCase()
            },
            // PAST
            {
                caseName: VerbCases.simpleFuture1sEN,
                word: simpleFuture1s.toLowerCase()
            },
            {
                caseName: VerbCases.simpleFuture2sEN,
                word: simpleFuture2s.toLowerCase()
            },
            {
                caseName: VerbCases.simpleFuture3sEN,
                word: simpleFuture3s.toLowerCase()
            },
            {
                caseName: VerbCases.simpleFuture1plEN,
                word: simpleFuture1pl.toLowerCase()
            },
            {
                caseName: VerbCases.simpleFuture3plEN,
                word: simpleFuture3pl.toLowerCase()
            },
            // PAST
            {
                caseName: VerbCases.simpleConditional1sEN,
                word: simpleConditional1s.toLowerCase()
            },
            {
                caseName: VerbCases.simpleConditional2sEN,
                word: simpleConditional2s.toLowerCase()
            },
            {
                caseName: VerbCases.simpleConditional3sEN,
                word: simpleConditional3s.toLowerCase()
            },
            {
                caseName: VerbCases.simpleConditional1plEN,
                word: simpleConditional1pl.toLowerCase()
            },
            {
                caseName: VerbCases.simpleConditional3plEN,
                word: simpleConditional3pl.toLowerCase()
            },
        ]
        props.updateFormData({
            language: Lang.EN,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [
        simplePresent1s, simplePresent2s, simplePresent3s, simplePresent1pl, simplePresent3pl,
        simplePast1s, simplePast2s, simplePast3s, simplePast1pl, simplePast3pl,
        simpleFuture1s, simpleFuture2s, simpleFuture3s, simpleFuture1pl, simpleFuture3pl,
        simpleConditional1s, simpleConditional2s, simpleConditional3s, simpleConditional1pl, simpleConditional3pl,

        regularity, isValid
    ])

    const setValuesInForm = (translationDataToInsert: TranslationItem) => {
        const regularityValue: string = getWordByCase(VerbCases.regularityEN, translationDataToInsert)

        const simplePresent1sValue: string = getWordByCase(VerbCases.simplePresent1sEN, translationDataToInsert)
        const simplePresent2sValue: string = getWordByCase(VerbCases.simplePresent2sEN, translationDataToInsert)
        const simplePresent3sValue: string = getWordByCase(VerbCases.simplePresent3sEN, translationDataToInsert)
        const simplePresent1plValue: string = getWordByCase(VerbCases.simplePresent1plEN, translationDataToInsert)
        const simplePresent3plValue: string = getWordByCase(VerbCases.simplePresent3plEN, translationDataToInsert)

        const simplePast1sValue: string = getWordByCase(VerbCases.simplePast1sEN, translationDataToInsert)
        const simplePast2sValue: string = getWordByCase(VerbCases.simplePast2sEN, translationDataToInsert)
        const simplePast3sValue: string = getWordByCase(VerbCases.simplePast3sEN, translationDataToInsert)
        const simplePast1plValue: string = getWordByCase(VerbCases.simplePast1plEN, translationDataToInsert)
        const simplePast3plValue: string = getWordByCase(VerbCases.simplePast3plEN, translationDataToInsert)

        const simpleFuture1sValue: string = getWordByCase(VerbCases.simpleFuture1sEN, translationDataToInsert)
        const simpleFuture2sValue: string = getWordByCase(VerbCases.simpleFuture2sEN, translationDataToInsert)
        const simpleFuture3sValue: string = getWordByCase(VerbCases.simpleFuture3sEN, translationDataToInsert)
        const simpleFuture1plValue: string = getWordByCase(VerbCases.simpleFuture1plEN, translationDataToInsert)
        const simpleFuture3plValue: string = getWordByCase(VerbCases.simpleFuture3plEN, translationDataToInsert)

        const simpleConditional1sValue: string = getWordByCase(VerbCases.simpleConditional1sEN, translationDataToInsert)
        const simpleConditional2sValue: string = getWordByCase(VerbCases.simpleConditional2sEN, translationDataToInsert)
        const simpleConditional3sValue: string = getWordByCase(VerbCases.simpleConditional3sEN, translationDataToInsert)
        const simpleConditional1plValue: string = getWordByCase(VerbCases.simpleConditional1plEN, translationDataToInsert)
        const simpleConditional3plValue: string = getWordByCase(VerbCases.simpleConditional3plEN, translationDataToInsert)

        setValue(
            'regularity',
            regularityValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setRegularity(regularityValue as "regular"|"irregular")
        // PRESENT
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
        // SIMPLE
        setValue(
            'simplePast1s',
            simplePast1sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimplePast1s(simplePast1sValue)
        setValue(
            'simplePast2s',
            simplePast2sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimplePast2s(simplePast2sValue)
        setValue(
            'simplePast3s',
            simplePast3sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimplePast3s(simplePast3sValue)
        setValue(
            'simplePast1pl',
            simplePast1plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimplePast1pl(simplePast1plValue)
        setValue(
            'simplePast3pl',
            simplePast3plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimplePast3pl(simplePast3plValue)
        // FUTURE
        setValue(
            'simpleFuture1s',
            simpleFuture1sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimpleFuture1s(simpleFuture1sValue)
        setValue(
            'simpleFuture2s',
            simpleFuture2sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimpleFuture2s(simpleFuture2sValue)
        setValue(
            'simpleFuture3s',
            simpleFuture3sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimpleFuture3s(simpleFuture3sValue)
        setValue(
            'simpleFuture1pl',
            simpleFuture1plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimpleFuture1pl(simpleFuture1plValue)
        setValue(
            'simpleFuture3pl',
            simpleFuture3plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimpleFuture3pl(simpleFuture3plValue)
        // CONDITIONAL
        setValue(
            'simpleConditional1s',
            simpleConditional1sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimpleConditional1s(simpleConditional1sValue)
        setValue(
            'simpleConditional2s',
            simpleConditional2sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimpleConditional2s(simpleConditional2sValue)
        setValue(
            'simpleConditional3s',
            simpleConditional3sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimpleConditional3s(simpleConditional3sValue)
        setValue(
            'simpleConditional1pl',
            simpleConditional1plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimpleConditional1pl(simpleConditional1plValue)
        setValue(
            'simpleConditional3pl',
            simpleConditional3plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSimpleConditional3pl(simpleConditional3plValue)
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
        const completeFormWithAutocomplete = {
            ...autocompletedTranslationVerbEN,
            // NB! These fields are not included in BE autocomplete response, so we must manually include them
            cases: [
                ...autocompletedTranslationVerbEN.cases,
                {
                    caseName: VerbCases.regularityEN,
                    word: regularity
                },
            ]
        }
        setValuesInForm(completeFormWithAutocomplete)
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
                    {/* TODO: add matching border-colors to conjugations that are the same => add switch to active them */}
                    {/* TODO: remove small title from TextFields when there is an adornment inside */}
                    {!(props.displayOnly) &&
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
                                    emptyQuery: t('wordForm.autocompleteTranslationButton.emptyQuery', { ns: 'wordRelated', requiredField: "simple present first person singular" }),
                                    noMatch: t('wordForm.autocompleteTranslationButton.noMatch', { ns: 'wordRelated' }),
                                    foundMatch: t('wordForm.autocompleteTranslationButton.foundMatch', { ns: 'wordRelated' }),
                                }}
                                queryValue={simplePresent1s}
                                autocompleteResponse={autocompletedTranslationVerbEN}
                                loadingState={isLoadingAT}
                                forceDisabled={!validAutocompleteRequest}
                                onAutocompleteClick={() => onAutocompleteClick()}
                                actionButtonLabel={t('wordForm.autocompleteTranslationButton.label', { ns: 'wordRelated', wordType: "" })}
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
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, regularity)) &&
                        <Grid
                            container={true}
                            item={true}
                            xs={'auto'}
                        >
                            <Grid
                                item={true}
                            >
                                {/* TODO: auto-detect regularity? (and suggest it with tooltip. */}
                                <RadioGroupWithHook
                                    control={control}
                                    label={"Regularity"}
                                    name={"regularity"}
                                    options={[VerbRegularity.regular, VerbRegularity.irregular]}
                                    defaultValue={""}
                                    errors={errors.regularity}
                                    onChange={(value: any) => {
                                        setRegularity(value)
                                    }}
                                    fullWidth={false}
                                    disabled={props.displayOnly}
                                />
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
                    </Grid>
                    {/* PRESENT */}
                    {
                        (
                            simplePresent1s!! || simplePresent2s!! || simplePresent3s!! ||
                            simplePresent1pl!! || simplePresent3pl!! ||
                            !props.displayOnly
                        ) &&
                        <Grid
                            container={true}
                            item={true}
                            justifyContent={"space-evenly"}
                            xs={6}
                            md
                            spacing={2}
                        >
                            <Grid
                                item={true}
                            >
                                <Typography
                                    variant={'h5'}
                                >
                                    Present:
                                </Typography>
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
                                        // TODO: create logic to group cases by border color.
                                        // sxProps={{
                                        //     "& .MuiOutlinedInput-notchedOutline": {
                                        //         borderColor: '#17dd17 !important',
                                        //     }
                                        // }}
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
                    }
                    {/* PAST */}
                    {
                        (
                            simplePast1s!! || simplePast2s!! || simplePast3s!! ||
                            simplePast1pl!! || simplePast3pl!! ||
                            !props.displayOnly
                        ) &&
                        <Grid
                            container={true}
                            item={true}
                            justifyContent={"space-evenly"}
                            xs={6}
                            md
                            spacing={2}
                        >
                            <Grid
                                item={true}
                            >
                                <Typography
                                    variant={'h5'}
                                >
                                    Past:
                                </Typography>
                            </Grid>
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simplePast1s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"I"}
                                        name={"simplePast1s"}
                                        defaultValue={""}
                                        errors={errors.simplePast1s}
                                        onChange={(value: any) => {
                                            setSimplePast1s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simplePast2s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"You"} // TODO: should change if user picks other spanish style
                                        name={"simplePast2s"}
                                        defaultValue={""}
                                        errors={errors.simplePast2s}
                                        onChange={(value: any) => {
                                            setSimplePast2s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simplePast3s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"He/She/it"}
                                        name={"simplePast3s"}
                                        defaultValue={""}
                                        errors={errors.simplePast3s}
                                        onChange={(value: any) => {
                                            setSimplePast3s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simplePast1pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"We"}
                                        name={"simplePast1pl"}
                                        defaultValue={""}
                                        errors={errors.simplePast1pl}
                                        onChange={(value: any) => {
                                            setSimplePast1pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simplePast3pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"They"}
                                        name={"simplePast3pl"}
                                        defaultValue={""}
                                        errors={errors.simplePast3pl}
                                        onChange={(value: any) => {
                                            setSimplePast3pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                        </Grid>
                    }
                {/* FUTURE */}
                {
                    (
                        simpleFuture1s!! || simpleFuture2s!! || simpleFuture3s!! ||
                        simpleFuture1pl!! || simpleFuture3pl!! ||
                        !props.displayOnly
                    ) &&
                    <Grid
                        container={true}
                        item={true}
                        justifyContent={"space-evenly"}
                        xs={6}
                        md
                        spacing={2}
                    >
                        <Grid
                            item={true}
                        >
                            <Typography
                                variant={'h5'}
                            >
                                Future:
                            </Typography>
                        </Grid>
                        {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simpleFuture1s)) &&
                            <Grid
                                item={true}
                                xs={12}
                            >
                                <TextInputFormWithHook
                                    control={control}
                                    label={"I"}
                                    name={"simpleFuture1s"}
                                    defaultValue={""}
                                    errors={errors.simpleFuture1s}
                                    onChange={(value: any) => {
                                        setSimpleFuture1s(value)
                                    }}
                                    fullWidth={true}
                                    disabled={props.displayOnly}
                                    inputProps={{
                                        startAdornment: <InputAdornment position="start">I will</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        }
                        {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simpleFuture2s)) &&
                            <Grid
                                item={true}
                                xs={12}
                            >
                                <TextInputFormWithHook
                                    control={control}
                                    label={"You"} // TODO: should change if user picks other spanish style
                                    name={"simpleFuture2s"}
                                    defaultValue={""}
                                    errors={errors.simpleFuture2s}
                                    onChange={(value: any) => {
                                        setSimpleFuture2s(value)
                                    }}
                                    fullWidth={true}
                                    disabled={props.displayOnly}
                                    inputProps={{
                                        startAdornment: <InputAdornment position="start">You will</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        }
                        {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simpleFuture3s)) &&
                            <Grid
                                item={true}
                                xs={12}
                            >
                                <TextInputFormWithHook
                                    control={control}
                                    label={"He/She/it"}
                                    name={"simpleFuture3s"}
                                    defaultValue={""}
                                    errors={errors.simpleFuture3s}
                                    onChange={(value: any) => {
                                        setSimpleFuture3s(value)
                                    }}
                                    fullWidth={true}
                                    disabled={props.displayOnly}
                                    inputProps={{
                                        startAdornment: <InputAdornment position="start">He/she/it will</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        }
                        {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simpleFuture1pl)) &&
                            <Grid
                                item={true}
                                xs={12}
                            >
                                <TextInputFormWithHook
                                    control={control}
                                    label={"We"}
                                    name={"simpleFuture1pl"}
                                    defaultValue={""}
                                    errors={errors.simpleFuture1pl}
                                    onChange={(value: any) => {
                                        setSimpleFuture1pl(value)
                                    }}
                                    fullWidth={true}
                                    disabled={props.displayOnly}
                                    inputProps={{
                                        startAdornment: <InputAdornment position="start">We will</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        }
                        {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simpleFuture3pl)) &&
                            <Grid
                                item={true}
                                xs={12}
                            >
                                <TextInputFormWithHook
                                    control={control}
                                    label={"They"} // TODO: should change if user picks other spanish style
                                    name={"simpleFuture3pl"}
                                    defaultValue={""}
                                    errors={errors.simpleFuture3pl}
                                    onChange={(value: any) => {
                                        setSimpleFuture3pl(value)
                                    }}
                                    fullWidth={true}
                                    disabled={props.displayOnly}
                                    inputProps={{
                                        startAdornment: <InputAdornment position="start">They will</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        }
                    </Grid>
                }
                {/* CONDITIONAL */}
                {
                    (
                        simpleConditional1s!! || simpleConditional2s!! || simpleConditional3s!! ||
                        simpleConditional1pl!! || simpleConditional3pl!! ||
                        !props.displayOnly
                    ) &&
                    <Grid
                        container={true}
                        item={true}
                        justifyContent={"space-evenly"}
                        xs={6}
                        md
                        spacing={2}
                    >
                        <Grid
                            item={true}
                        >
                            <Typography
                                variant={'h5'}
                            >
                                Conditional:
                            </Typography>
                        </Grid>
                        {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simpleConditional1s)) &&
                            <Grid
                                item={true}
                                xs={12}
                            >
                                <TextInputFormWithHook
                                    control={control}
                                    label={"I"}
                                    name={"simpleConditional1s"}
                                    defaultValue={""}
                                    errors={errors.simpleConditional1s}
                                    onChange={(value: any) => {
                                        setSimpleConditional1s(value)
                                    }}
                                    fullWidth={true}
                                    disabled={props.displayOnly}
                                    inputProps={{
                                        startAdornment: <InputAdornment position="start">I would</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        }
                        {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simpleConditional2s)) &&
                            <Grid
                                item={true}
                                xs={12}
                            >
                                <TextInputFormWithHook
                                    control={control}
                                    label={"You"} // TODO: should change if user picks other spanish style
                                    name={"simpleConditional2s"}
                                    defaultValue={""}
                                    errors={errors.simpleConditional2s}
                                    onChange={(value: any) => {
                                        setSimpleConditional2s(value)
                                    }}
                                    fullWidth={true}
                                    disabled={props.displayOnly}
                                    inputProps={{
                                        startAdornment: <InputAdornment position="start">You would</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        }
                        {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simpleConditional3s)) &&
                            <Grid
                                item={true}
                                xs={12}
                            >
                                <TextInputFormWithHook
                                    control={control}
                                    label={"He/She/it"}
                                    name={"simpleConditional3s"}
                                    defaultValue={""}
                                    errors={errors.simpleConditional3s}
                                    onChange={(value: any) => {
                                        setSimpleConditional3s(value)
                                    }}
                                    fullWidth={true}
                                    disabled={props.displayOnly}
                                    inputProps={{
                                        startAdornment: <InputAdornment position="start">He/she/it would</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        }
                        {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simpleConditional1pl)) &&
                            <Grid
                                item={true}
                                xs={12}
                            >
                                <TextInputFormWithHook
                                    control={control}
                                    label={"We"}
                                    name={"simpleConditional1pl"}
                                    defaultValue={""}
                                    errors={errors.simpleConditional1pl}
                                    onChange={(value: any) => {
                                        setSimpleConditional1pl(value)
                                    }}
                                    fullWidth={true}
                                    disabled={props.displayOnly}
                                    inputProps={{
                                        startAdornment: <InputAdornment position="start">We would</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        }
                        {(getDisabledInputFieldDisplayLogic(props.displayOnly!, simpleConditional3pl)) &&
                            <Grid
                                item={true}
                                xs={12}
                            >
                                <TextInputFormWithHook
                                    control={control}
                                    label={"They"} // TODO: should change if user picks other spanish style
                                    name={"simpleConditional3pl"}
                                    defaultValue={""}
                                    errors={errors.simpleConditional3pl}
                                    onChange={(value: any) => {
                                        setSimpleConditional3pl(value)
                                    }}
                                    fullWidth={true}
                                    disabled={props.displayOnly}
                                    inputProps={{
                                        startAdornment: <InputAdornment position="start">They would</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        }
                    </Grid>
                }
                </Grid>
            </form>
        </Grid>
    )
}