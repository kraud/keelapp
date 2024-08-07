import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid, InputAdornment} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {TranslationItem, WordItem} from "../../../ts/interfaces";
import {AuxVerbDE, Lang, VerbCases} from "../../../ts/enums";
import {
    getDisabledInputFieldDisplayLogic,
    getWordByCase,
    habenPresentAndPastJSON, seinPresentAndPastJSON,
    werdenPresentAndPastJSON
} from "../commonFunctions";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../../app/store";
import {
    getAutocompletedGermanVerbData,
} from "../../../features/autocompletedTranslation/autocompletedTranslationSlice";
import LinearIndeterminate from "../../Spinner";
import {setTimerTriggerFunction} from "../../generalUseFunctions";
import {AutocompleteButtonWithStatus} from "../AutocompleteButtonWithStatus";
import Typography from "@mui/material/Typography";
import {RadioGroupWithHook} from "../../RadioGroupFormHook";

interface VerbFormDEProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the estonian translation of a verb (and handles the validations)
export function VerbFormDE(props: VerbFormDEProps) {
    const dispatch = useDispatch<AppDispatch>()
    const {autocompletedTranslationVerbDE, isErrorAT, isSuccessAT, isLoadingAT, messageAT} = useSelector((state: any) => state.autocompletedTranslations)

    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        infinitive: Yup.string()
            .required("Infinitive non-finite is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers')
            .matches(/^(?!.*\d).*(en|ern|eln)$/, "Please input infinitive form (ends in '-en', '-ern' '-eln')."),
        auxiliaryVerb: Yup.string(), // TODO: should this be mandatory?
            // .oneOf([AuxVerbDE.H as string, AuxVerbDE.S as string, AuxVerbDE.W as string], "Required"),
        indicativePresent1s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativePresent2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativePresent3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativePresent1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativePresent2pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativePresent3pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        // SIMPLE PERFECT (PERFEKT)
        indicativePerfect1s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativePerfect2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativePerfect3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativePerfect1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativePerfect2pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativePerfect3pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        // SIMPLE FUTURE (FUTURE 1)
        indicativeSimpleFuture1s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativeSimpleFuture2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativeSimpleFuture3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativeSimpleFuture1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativeSimpleFuture2pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativeSimpleFuture3pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    // Mandatory fields: can't be autocompleted
    const [infinitive, setInfinitive] = useState("")
    const [auxiliaryVerb, setAuxiliaryVerb] = useState<"haben"|"sein"|"">("")
    // Optional fields: can be filled with autocomplete
    // Modo indicativo - tiempo simple - presente
    const [indicativePresent1s, setIndicativePresent1s] = useState("")
    const [indicativePresent2s, setIndicativePresent2s] = useState("")
    const [indicativePresent3s, setIndicativePresent3s] = useState("")
    const [indicativePresent1pl, setIndicativePresent1pl] = useState("")
    const [indicativePresent2pl, setIndicativePresent2pl] = useState("")
    const [indicativePresent3pl, setIndicativePresent3pl] = useState("")
    // Modo indicativo - tiempo simple - present perfect (Perfekt)
    const [indicativePerfect1s, setIndicativePerfect1s] = useState("")
    const [indicativePerfect2s, setIndicativePerfect2s] = useState("")
    const [indicativePerfect3s, setIndicativePerfect3s] = useState("")
    const [indicativePerfect1pl, setIndicativePerfect1pl] = useState("")
    const [indicativePerfect2pl, setIndicativePerfect2pl] = useState("")
    const [indicativePerfect3pl, setIndicativePerfect3pl] = useState("")
    // Modo indicativo - tiempo simple - simple future (Futur 1)
    const [indicativeSimpleFuture1s, setIndicativeSimpleFuture1s] = useState("")
    const [indicativeSimpleFuture2s, setIndicativeSimpleFuture2s] = useState("")
    const [indicativeSimpleFuture3s, setIndicativeSimpleFuture3s] = useState("")
    const [indicativeSimpleFuture1pl, setIndicativeSimpleFuture1pl] = useState("")
    const [indicativeSimpleFuture2pl, setIndicativeSimpleFuture2pl] = useState("")
    const [indicativeSimpleFuture3pl, setIndicativeSimpleFuture3pl] = useState("")

    useEffect(() => {
        const currentCases: WordItem[] = [
            {
                caseName: VerbCases.infinitiveDE,
                word: infinitive
            },
            {
                caseName: VerbCases.auxVerbDE,
                word: auxiliaryVerb
            },
            // Indicative: present
            {
                caseName: VerbCases.indicativePresent1sDE,
                word: indicativePresent1s
            },
            {
                caseName: VerbCases.indicativePresent2sDE,
                word: indicativePresent2s
            },
            {
                caseName: VerbCases.indicativePresent3sDE,
                word: indicativePresent3s
            },
            {
                caseName: VerbCases.indicativePresent1plDE,
                word: indicativePresent1pl
            },
            {
                caseName: VerbCases.indicativePresent2plDE,
                word: indicativePresent2pl
            },
            {
                caseName: VerbCases.indicativePresent3plDE,
                word: indicativePresent3pl
            },
            // Indicative: present perfect (Perfekt)
            {
                caseName: VerbCases.indicativePerfect1sDE,
                word: indicativePerfect1s
            },
            {
                caseName: VerbCases.indicativePerfect2sDE,
                word: indicativePerfect2s
            },
            {
                caseName: VerbCases.indicativePerfect3sDE,
                word: indicativePerfect3s
            },
            {
                caseName: VerbCases.indicativePerfect1plDE,
                word: indicativePerfect1pl
            },
            {
                caseName: VerbCases.indicativePerfect2plDE,
                word: indicativePerfect2pl
            },
            {
                caseName: VerbCases.indicativePerfect3plDE,
                word: indicativePerfect3pl
            },
            // Indicative: simple future (Futur 1)
            {
                caseName: VerbCases.indicativeSimpleFuture1sDE,
                word: indicativeSimpleFuture1s
            },
            {
                caseName: VerbCases.indicativeSimpleFuture2sDE,
                word: indicativeSimpleFuture2s
            },
            {
                caseName: VerbCases.indicativeSimpleFuture3sDE,
                word: indicativeSimpleFuture3s
            },
            {
                caseName: VerbCases.indicativeSimpleFuture1plDE,
                word: indicativeSimpleFuture1pl
            },
            {
                caseName: VerbCases.indicativeSimpleFuture2plDE,
                word: indicativeSimpleFuture2pl
            },
            {
                caseName: VerbCases.indicativeSimpleFuture3plDE,
                word: indicativeSimpleFuture3pl
            },
        ]
        props.updateFormData({
            language: Lang.DE,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [
        infinitive, indicativePresent1s, indicativePresent2s, indicativePresent3s,
        indicativePresent1pl, indicativePresent2pl, indicativePresent3pl,
        indicativePerfect1s,  indicativePerfect2s,  indicativePerfect3s,  indicativePerfect1pl,  indicativePerfect2pl,
        indicativePerfect3pl,
        indicativeSimpleFuture1s, indicativeSimpleFuture2s, indicativeSimpleFuture3s, indicativeSimpleFuture1pl,
        indicativeSimpleFuture2pl, indicativeSimpleFuture3pl,
        isValid, auxiliaryVerb
    ])

    const setValuesInForm = (translationDataToInsert: TranslationItem) => {
        const infinitiveValue: string = getWordByCase(VerbCases.infinitiveDE, translationDataToInsert)
        const auxiliaryVerbValue: string = getWordByCase(VerbCases.auxVerbDE, translationDataToInsert)
        // Indicative: present
        const indicativePresent1sValue: string = getWordByCase(VerbCases.indicativePresent1sDE, translationDataToInsert)
        const indicativePresent2sValue: string = getWordByCase(VerbCases.indicativePresent2sDE, translationDataToInsert)
        const indicativePresent3sValue: string = getWordByCase(VerbCases.indicativePresent3sDE, translationDataToInsert)
        const indicativePresent1plValue: string = getWordByCase(VerbCases.indicativePresent1plDE, translationDataToInsert)
        const indicativePresent2plValue: string = getWordByCase(VerbCases.indicativePresent2plDE, translationDataToInsert)
        const indicativePresent3plValue: string = getWordByCase(VerbCases.indicativePresent3plDE, translationDataToInsert)
        // Indicative: present perfect (Perfekt)
        const indicativePerfect1sValue: string = getWordByCase(VerbCases.indicativePerfect1sDE, translationDataToInsert)
        const indicativePerfect2sValue: string = getWordByCase(VerbCases.indicativePerfect2sDE, translationDataToInsert)
        const indicativePerfect3sValue: string = getWordByCase(VerbCases.indicativePerfect3sDE, translationDataToInsert)
        const indicativePerfect1plValue: string = getWordByCase(VerbCases.indicativePerfect1plDE, translationDataToInsert)
        const indicativePerfect2plValue: string = getWordByCase(VerbCases.indicativePerfect2plDE, translationDataToInsert)
        const indicativePerfect3plValue: string = getWordByCase(VerbCases.indicativePerfect3plDE, translationDataToInsert)
        // Indicative: simple future (Futur 1)
        const indicativeSimpleFuture1sValue: string = getWordByCase(VerbCases.indicativeSimpleFuture1sDE, translationDataToInsert)
        const indicativeSimpleFuture2sValue: string = getWordByCase(VerbCases.indicativeSimpleFuture2sDE, translationDataToInsert)
        const indicativeSimpleFuture3sValue: string = getWordByCase(VerbCases.indicativeSimpleFuture3sDE, translationDataToInsert)
        const indicativeSimpleFuture1plValue: string = getWordByCase(VerbCases.indicativeSimpleFuture1plDE, translationDataToInsert)
        const indicativeSimpleFuture2plValue: string = getWordByCase(VerbCases.indicativeSimpleFuture2plDE, translationDataToInsert)
        const indicativeSimpleFuture3plValue: string = getWordByCase(VerbCases.indicativeSimpleFuture3plDE, translationDataToInsert)

        setValue(
            'infinitive',
            infinitiveValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setInfinitive(infinitiveValue)
        setValue(
            'auxiliaryVerb',
            auxiliaryVerbValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setAuxiliaryVerb(auxiliaryVerbValue as "haben"|"sein"|"")
        // Indicative: present
        setValue(
            'indicativePresent1s',
            indicativePresent1sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePresent1s(indicativePresent1sValue)
        setValue(
            'indicativePresent2s',
            indicativePresent2sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePresent2s(indicativePresent2sValue)
        setValue(
            'indicativePresent3s',
            indicativePresent3sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePresent3s(indicativePresent3sValue)
        setValue(
            'indicativePresent1pl',
            indicativePresent1plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePresent1pl(indicativePresent1plValue)
        setValue(
            'indicativePresent2pl',
            indicativePresent2plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePresent2pl(indicativePresent2plValue)
        setValue(
            'indicativePresent3pl',
            indicativePresent3plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePresent3pl(indicativePresent3plValue)
        // Indicative: present perfect (Perfekt)
        setValue(
            'indicativePerfect1s',
            indicativePerfect1sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePerfect1s(indicativePerfect1sValue)
        setValue(
            'indicativePerfect2s',
            indicativePerfect2sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePerfect2s(indicativePerfect2sValue)
        setValue(
            'indicativePerfect3s',
            indicativePerfect3sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePerfect3s(indicativePerfect3sValue)
        setValue(
            'indicativePerfect1pl',
            indicativePerfect1plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePerfect1pl(indicativePerfect1plValue)
        setValue(
            'indicativePerfect2pl',
            indicativePerfect2plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePerfect2pl(indicativePerfect2plValue)
        setValue(
            'indicativePerfect3pl',
            indicativePerfect3plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePerfect3pl(indicativePerfect3plValue)
        // Indicative: simple future (Futur 1)
        setValue(
            'indicativeSimpleFuture1s',
            indicativeSimpleFuture1sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeSimpleFuture1s(indicativeSimpleFuture1sValue)
        setValue(
            'indicativeSimpleFuture2s',
            indicativeSimpleFuture2sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeSimpleFuture2s(indicativeSimpleFuture2sValue)
        setValue(
            'indicativeSimpleFuture3s',
            indicativeSimpleFuture3sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeSimpleFuture3s(indicativeSimpleFuture3sValue)
        setValue(
            'indicativeSimpleFuture1pl',
            indicativeSimpleFuture1plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeSimpleFuture1pl(indicativeSimpleFuture1plValue)
        setValue(
            'indicativeSimpleFuture2pl',
            indicativeSimpleFuture2plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeSimpleFuture2pl(indicativeSimpleFuture2plValue)
        setValue(
            'indicativeSimpleFuture3pl',
            indicativeSimpleFuture3plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeSimpleFuture3pl(indicativeSimpleFuture3plValue)
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
            ...autocompletedTranslationVerbDE,
            // NB! These fields are not included in BE autocomplete response, so we must manually include
            cases: [
                ...autocompletedTranslationVerbDE.cases,
                {
                    caseName: VerbCases.infinitiveDE,
                    word: infinitive
                },
                {
                    caseName: VerbCases.auxVerbDE,
                    word: auxiliaryVerb
                },
            ]
        }
        setValuesInForm(completeFormWithAutocomplete)
    }

    // before making the request, we check if the query is correct according to the form's validation
    const validAutocompleteRequest = errors['infinitive'] === undefined
    useEffect(() => {
        if((infinitive !== "") && (validAutocompleteRequest)){
            setTimerTriggerFunction(
                () => {
                    dispatch(getAutocompletedGermanVerbData(infinitive))
                },
                600
            )
        }
    },[infinitive, validAutocompleteRequest])

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
                                    emptyQuery: "Please input 'infinitive non-finite simple' first.",
                                    noMatch: "Sorry, we don't know this word!",
                                    foundMatch: "There is information about this word stored in our system."
                                }}
                                queryValue={infinitive}
                                autocompleteResponse={autocompletedTranslationVerbDE}
                                loadingState={isLoadingAT}
                                forceDisabled={!validAutocompleteRequest}
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
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, infinitive)) &&
                        <Grid
                            item={true}
                            xs
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Infinitive"}
                                name={"infinitive"}
                                defaultValue={""}
                                errors={errors.infinitive}
                                onChange={(value: any) => {
                                    setInfinitive(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    <Grid
                        container={true}
                        item={true}
                        xs={'auto'}
                    >
                        <Grid
                            item={true}
                        >
                            <RadioGroupWithHook
                                control={control}
                                label={"Auxiliary verb"}
                                name={"auxiliaryVerb"}
                                options={[AuxVerbDE.H, AuxVerbDE.S]}
                                defaultValue={""}
                                errors={errors.auxiliaryVerb}
                                onChange={(value: any) => {
                                    setAuxiliaryVerb(value)
                                }}
                                fullWidth={false}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    </Grid>
                    {/*
                        TODO: add multiselect for verb categories based on their grammatical and syntactic behavior?
                         (Transitive, Intransitive, Dative, Reflexive, Impersonal, Modal, Auxiliary, Separable and Inseparable Prefix)?
                    */}
                    {
                        (
                            indicativePresent1s!! || indicativePresent2s!! || indicativePresent3s!! ||
                            indicativePresent1pl!! || indicativePresent2pl!! || indicativePresent3pl!! ||
                            !props.displayOnly
                        ) &&
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
                                    Indicative:
                                </Typography>
                            </Grid>
                        </Grid>
                    }
                    {/* PRESENT */}
                    {
                        (
                            indicativePresent1s!! || indicativePresent2s!! || indicativePresent3s!! ||
                            indicativePresent1pl!! || indicativePresent2pl!! || indicativePresent3pl!! ||
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
                                xs={12}
                            >
                                <Typography
                                    variant={'h5'}
                                >
                                    Present:
                                </Typography>
                            </Grid>
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePresent1s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Ich'}
                                        name={"indicativePresent1s"}
                                        defaultValue={""}
                                        errors={errors.indicativePresent1s}
                                        onChange={(value: any) => {
                                            setIndicativePresent1s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePresent2s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Du'}
                                        name={"indicativePresent2s"}
                                        defaultValue={""}
                                        errors={errors.indicativePresent2s}
                                        onChange={(value: any) => {
                                            setIndicativePresent2s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePresent3s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Er/Sie/es'}
                                        name={"indicativePresent3s"}
                                        defaultValue={""}
                                        errors={errors.indicativePresent3s}
                                        onChange={(value: any) => {
                                            setIndicativePresent3s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePresent1pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Wir'}
                                        name={"indicativePresent1pl"}
                                        defaultValue={""}
                                        errors={errors.indicativePresent1pl}
                                        onChange={(value: any) => {
                                            setIndicativePresent1pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePresent2pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Ihr'}
                                        name={"indicativePresent2pl"}
                                        defaultValue={""}
                                        errors={errors.indicativePresent2pl}
                                        onChange={(value: any) => {
                                            setIndicativePresent2pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePresent3pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Sie'}
                                        name={"indicativePresent3pl"}
                                        defaultValue={""}
                                        errors={errors.indicativePresent3pl}
                                        onChange={(value: any) => {
                                            setIndicativePresent3pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                        </Grid>
                    }
                    {/* Present Perfect (Perfekt) */}
                    {
                        (
                            indicativePerfect1s!! || indicativePerfect2s!! || indicativePerfect3s!! ||
                            indicativePerfect1pl!! || indicativePerfect2pl!! || indicativePerfect3pl!! ||
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
                                xs={12}
                            >
                                <Typography
                                    variant={'h5'}
                                >
                                    Present Perfect (Perfekt):
                                </Typography>
                            </Grid>
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePerfect1s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Ich'}
                                        name={"indicativePerfect1s"}
                                        defaultValue={""}
                                        errors={errors.indicativePerfect1s}
                                        onChange={(value: any) => {
                                            setIndicativePerfect1s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment:
                                                <InputAdornment
                                                    position="start"
                                                >
                                                    {
                                                        `Ich 
                                                        ${(
                                                            // this way when not defined => still 'haben', because it's the most common.
                                                            (auxiliaryVerb !== 'haben')
                                                                ? seinPresentAndPastJSON
                                                                : habenPresentAndPastJSON
                                                        ).present.Sg1}`
                                                    }
                                                </InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePerfect2s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Du'}
                                        name={"indicativePerfect2s"}
                                        defaultValue={""}
                                        errors={errors.indicativePerfect2s}
                                        onChange={(value: any) => {
                                            setIndicativePerfect2s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment:
                                                <InputAdornment
                                                    position="start"
                                                >
                                                    {
                                                        `Du 
                                                        ${(
                                                            // this way when not defined => still 'haben', because it's the most common.
                                                            (auxiliaryVerb !== 'haben')
                                                                ? seinPresentAndPastJSON
                                                                : habenPresentAndPastJSON
                                                        ).present.Sg2}`
                                                    }
                                                </InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePerfect3s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Er/Sie/es'}
                                        name={"indicativePerfect3s"}
                                        defaultValue={""}
                                        errors={errors.indicativePerfect3s}
                                        onChange={(value: any) => {
                                            setIndicativePerfect3s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment:
                                                <InputAdornment
                                                    position="start"
                                                >
                                                    {
                                                        `Er/Sie/es 
                                                        ${(
                                                            // this way when not defined => still 'haben', because it's the most common.
                                                            (auxiliaryVerb !== 'haben')
                                                                ? seinPresentAndPastJSON
                                                                : habenPresentAndPastJSON
                                                        ).present.Sg3}`
                                                    }
                                                </InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePerfect1pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Wir'}
                                        name={"indicativePerfect1pl"}
                                        defaultValue={""}
                                        errors={errors.indicativePerfect1pl}
                                        onChange={(value: any) => {
                                            setIndicativePerfect1pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment:
                                                <InputAdornment
                                                    position="start"
                                                >
                                                    {
                                                        `Wir 
                                                        ${(
                                                            // this way when not defined => still 'haben', because it's the most common.
                                                            (auxiliaryVerb !== 'haben')
                                                                ? seinPresentAndPastJSON
                                                                : habenPresentAndPastJSON
                                                        ).present.Pl1}`
                                                    }
                                                </InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePerfect2pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Ihr'}
                                        name={"indicativePerfect2pl"}
                                        defaultValue={""}
                                        errors={errors.indicativePerfect2pl}
                                        onChange={(value: any) => {
                                            setIndicativePerfect2pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment:
                                                <InputAdornment
                                                    position="start"
                                                >
                                                    {
                                                        `Ihr 
                                                        ${(
                                                            // this way when not defined => still 'haben', because it's the most common. 
                                                            (auxiliaryVerb !== 'haben')
                                                                ? seinPresentAndPastJSON
                                                                : habenPresentAndPastJSON
                                                        ).present.Pl2}`
                                                    }
                                                </InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePerfect3pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Sie'}
                                        name={"indicativePerfect3pl"}
                                        defaultValue={""}
                                        errors={errors.indicativePerfect3pl}
                                        onChange={(value: any) => {
                                            setIndicativePerfect3pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment:
                                                <InputAdornment
                                                    position="start"
                                                >
                                                    {
                                                        `Sie 
                                                        ${(
                                                            // this way when not defined => still 'haben', because it's the most common.
                                                            (auxiliaryVerb !== 'haben')
                                                                ? seinPresentAndPastJSON
                                                                : habenPresentAndPastJSON
                                                        ).present.Pl3}`
                                                    }
                                                </InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            }
                        </Grid>
                    }
                    {/* Present Perfect (Perfekt) */}
                    {
                        (
                            indicativeSimpleFuture1s!! || indicativeSimpleFuture2s!! || indicativeSimpleFuture3s!! ||
                            indicativeSimpleFuture1pl!! || indicativeSimpleFuture2pl!! || indicativeSimpleFuture3pl!! ||
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
                                xs={12}
                            >
                                <Typography
                                    variant={'h5'}
                                >
                                    Simple future (Futur 1):
                                </Typography>
                            </Grid>
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeSimpleFuture1s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Ich'}
                                        name={"indicativeSimpleFuture1s"}
                                        defaultValue={""}
                                        errors={errors.indicativeSimpleFuture1sDE}
                                        onChange={(value: any) => {
                                            setIndicativeSimpleFuture1s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment:
                                                <InputAdornment
                                                    position="start"
                                                >
                                                    {`Ich ${werdenPresentAndPastJSON.present.Sg1}`}
                                                </InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeSimpleFuture2s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Du'}
                                        name={"indicativeSimpleFuture2s"}
                                        defaultValue={""}
                                        errors={errors.indicativeSimpleFuture2sDE}
                                        onChange={(value: any) => {
                                            setIndicativeSimpleFuture2s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment:
                                                <InputAdornment
                                                    position="start"
                                                >
                                                    {`Du ${werdenPresentAndPastJSON.present.Sg2}`}
                                                </InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeSimpleFuture3s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Er/Sie/es'}
                                        name={"indicativeSimpleFuture3s"}
                                        defaultValue={""}
                                        errors={errors.indicativeSimpleFuture3sDE}
                                        onChange={(value: any) => {
                                            setIndicativeSimpleFuture3s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment:
                                                <InputAdornment
                                                    position="start"
                                                >
                                                    {`Er/Sie/es ${werdenPresentAndPastJSON.present.Sg3}`}
                                                </InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeSimpleFuture1pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Wir'}
                                        name={"indicativeSimpleFuture1pl"}
                                        defaultValue={""}
                                        errors={errors.indicativeSimpleFuture1plDE}
                                        onChange={(value: any) => {
                                            setIndicativeSimpleFuture1pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment:
                                                <InputAdornment
                                                    position="start"
                                                >
                                                    {`Wir ${werdenPresentAndPastJSON.present.Pl1}`}
                                                </InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeSimpleFuture2pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Ihr'}
                                        name={"indicativeSimpleFuture2pl"}
                                        defaultValue={""}
                                        errors={errors.indicativeSimpleFuture2plDE}
                                        onChange={(value: any) => {
                                            setIndicativeSimpleFuture2pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment:
                                                <InputAdornment
                                                    position="start"
                                                >
                                                    {`Ihr ${werdenPresentAndPastJSON.present.Pl2}`}
                                                </InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeSimpleFuture3pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Sie'}
                                        name={"indicativeSimpleFuture3pl"}
                                        defaultValue={""}
                                        errors={errors.indicativeSimpleFuture3plDE}
                                        onChange={(value: any) => {
                                            setIndicativeSimpleFuture3pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment:
                                                <InputAdornment
                                                    position="start"
                                                >
                                                    {`Sie ${werdenPresentAndPastJSON.present.Pl3}`}
                                                </InputAdornment>,
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