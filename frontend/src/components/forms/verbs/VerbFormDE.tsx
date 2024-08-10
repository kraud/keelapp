import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Button, Collapse, Grid, InputAdornment} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {TranslationItem, WordItem} from "../../../ts/interfaces";
import {AuxVerbDE, Lang, PrefixesVerbDE, VerbCases, VerbCaseTypeDE} from "../../../ts/enums";
import {
    getAcronymFromVerbCaseTypes, getVerbCaseTypesFromAcronym,
    getDisabledInputFieldDisplayLogic,
    getWordByCase,
    habenPresentAndPastJSON, seinPresentAndPastJSON,
    werdenPresentAndPastJSON, checkForPatternPrefixDE, CheckForPatternResponse
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
import {CheckboxGroupWithHook, CheckboxItemData} from "../../CheckboxGroupFormHook";

interface VerbFormDEProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the estonian translation of a verb (and handles the validations)
export function VerbFormDE(props: VerbFormDEProps) {
    const { currentTranslationData } = props
    const dispatch = useDispatch<AppDispatch>()
    const {autocompletedTranslationVerbDE, isErrorAT, isSuccessAT, isLoadingAT, messageAT} = useSelector((state: any) => state.autocompletedTranslations)

    const validationSchema = Yup.object().shape({
        infinitive: Yup.string()
            .required("Infinitive non-finite is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers')
            .matches(/^(?!.*\d).*(en|ern|eln)$/, "Please input infinitive form (ends in '-en', '-ern' '-eln')."),
        auxiliaryVerb: Yup.string(), // TODO: should this be mandatory?
        verbCases: Yup.array(),
        prefix: Yup.string(), // TODO: should this be mandatory?
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
        // SIMPLE PAST (FUTURE 1)
        indicativeSimplePast1s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativeSimplePast2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativeSimplePast3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativeSimplePast1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativeSimplePast2pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativeSimplePast3pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue,
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    // Mandatory fields: can't be autocompleted
    const [infinitive, setInfinitive] = useState("")
    const [auxiliaryVerb, setAuxiliaryVerb] = useState<"haben"|"sein"|"">("")
    const [prefix, setPrefix] = useState<PrefixesVerbDE | "">("")
    const [verbCases, setVerbCases] = useState<CheckboxItemData[]>([])
    // Optional fields: can be filled with autocomplete
    // Indicative Mode - present
    const [indicativePresent1s, setIndicativePresent1s] = useState("")
    const [indicativePresent2s, setIndicativePresent2s] = useState("")
    const [indicativePresent3s, setIndicativePresent3s] = useState("")
    const [indicativePresent1pl, setIndicativePresent1pl] = useState("")
    const [indicativePresent2pl, setIndicativePresent2pl] = useState("")
    const [indicativePresent3pl, setIndicativePresent3pl] = useState("")
    // Indicative Mode - present perfect (Perfekt)
    const [indicativePerfect1s, setIndicativePerfect1s] = useState("")
    const [indicativePerfect2s, setIndicativePerfect2s] = useState("")
    const [indicativePerfect3s, setIndicativePerfect3s] = useState("")
    const [indicativePerfect1pl, setIndicativePerfect1pl] = useState("")
    const [indicativePerfect2pl, setIndicativePerfect2pl] = useState("")
    const [indicativePerfect3pl, setIndicativePerfect3pl] = useState("")
    // Indicative Mode - simple future (Futur 1)
    const [indicativeSimpleFuture1s, setIndicativeSimpleFuture1s] = useState("")
    const [indicativeSimpleFuture2s, setIndicativeSimpleFuture2s] = useState("")
    const [indicativeSimpleFuture3s, setIndicativeSimpleFuture3s] = useState("")
    const [indicativeSimpleFuture1pl, setIndicativeSimpleFuture1pl] = useState("")
    const [indicativeSimpleFuture2pl, setIndicativeSimpleFuture2pl] = useState("")
    const [indicativeSimpleFuture3pl, setIndicativeSimpleFuture3pl] = useState("")
    // Indicative Mode - simple future (Futur 1)
    const [indicativeSimplePast1s, setIndicativeSimplePast1s] = useState("")
    const [indicativeSimplePast2s, setIndicativeSimplePast2s] = useState("")
    const [indicativeSimplePast3s, setIndicativeSimplePast3s] = useState("")
    const [indicativeSimplePast1pl, setIndicativeSimplePast1pl] = useState("")
    const [indicativeSimplePast2pl, setIndicativeSimplePast2pl] = useState("")
    const [indicativeSimplePast3pl, setIndicativeSimplePast3pl] = useState("")

    const [displayPrefixList, setDisplayPrefixList] = useState(prefix !== "")

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
            {
                caseName: VerbCases.caseTypeDE,
                word: getAcronymFromVerbCaseTypes(verbCases) // string consists of: acc: A, dat: D, gen: G
            },
            {
                caseName: VerbCases.prefixDE,
                word: prefix
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
            // Indicative: simple past (präteritum)
            {
                caseName: VerbCases.indicativeSimplePast1sDE,
                word: indicativeSimplePast1s
            },
            {
                caseName: VerbCases.indicativeSimplePast2sDE,
                word: indicativeSimplePast2s
            },
            {
                caseName: VerbCases.indicativeSimplePast3sDE,
                word: indicativeSimplePast3s
            },
            {
                caseName: VerbCases.indicativeSimplePast1plDE,
                word: indicativeSimplePast1pl
            },
            {
                caseName: VerbCases.indicativeSimplePast2plDE,
                word: indicativeSimplePast2pl
            },
            {
                caseName: VerbCases.indicativeSimplePast3plDE,
                word: indicativeSimplePast3pl
            },
        ]
        props.updateFormData({
            language: Lang.DE,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [
        isValid, auxiliaryVerb, verbCases, prefix,

        infinitive, indicativePresent1s, indicativePresent2s, indicativePresent3s,
        indicativePresent1pl, indicativePresent2pl, indicativePresent3pl,
        indicativePerfect1s,  indicativePerfect2s,  indicativePerfect3s,  indicativePerfect1pl,  indicativePerfect2pl,
        indicativePerfect3pl,
        indicativeSimpleFuture1s, indicativeSimpleFuture2s, indicativeSimpleFuture3s, indicativeSimpleFuture1pl,
        indicativeSimpleFuture2pl, indicativeSimpleFuture3pl,
        indicativeSimplePast1s, indicativeSimplePast2s, indicativeSimplePast3s, indicativeSimplePast1pl,
        indicativeSimplePast2pl, indicativeSimplePast3pl,
    ])

    const setValuesInForm = (translationDataToInsert: TranslationItem) => {
        const infinitiveValue: string = getWordByCase(VerbCases.infinitiveDE, translationDataToInsert)
        const auxiliaryVerbValue: string = getWordByCase(VerbCases.auxVerbDE, translationDataToInsert)
        const verbCasesValue = getVerbCaseTypesFromAcronym(getWordByCase(VerbCases.caseTypeDE, translationDataToInsert))
        const prefixValue: string = getWordByCase(VerbCases.prefixDE, translationDataToInsert)
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
        // Indicative: simple past (präteritum)
        const indicativeSimplePast1sValue: string = getWordByCase(VerbCases.indicativeSimplePast1sDE, translationDataToInsert)
        const indicativeSimplePast2sValue: string = getWordByCase(VerbCases.indicativeSimplePast2sDE, translationDataToInsert)
        const indicativeSimplePast3sValue: string = getWordByCase(VerbCases.indicativeSimplePast3sDE, translationDataToInsert)
        const indicativeSimplePast1plValue: string = getWordByCase(VerbCases.indicativeSimplePast1plDE, translationDataToInsert)
        const indicativeSimplePast2plValue: string = getWordByCase(VerbCases.indicativeSimplePast2plDE, translationDataToInsert)
        const indicativeSimplePast3plValue: string = getWordByCase(VerbCases.indicativeSimplePast3plDE, translationDataToInsert)

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
        setValue(
            'verbCases',
            verbCasesValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setVerbCases(verbCasesValue)
        setValue(
            'prefix',
            prefixValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setPrefix(prefixValue as PrefixesVerbDE)

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
        // Indicative: simple past (präteritum)
        setValue(
            'indicativeSimplePast1s',
            indicativeSimplePast1sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeSimplePast1s(indicativeSimplePast1sValue)
        setValue(
            'indicativeSimplePast2s',
            indicativeSimplePast2sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeSimplePast2s(indicativeSimplePast2sValue)
        setValue(
            'indicativeSimplePast3s',
            indicativeSimplePast3sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeSimplePast3s(indicativeSimplePast3sValue)
        setValue(
            'indicativeSimplePast1pl',
            indicativeSimplePast1plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeSimplePast1pl(indicativeSimplePast1plValue)
        setValue(
            'indicativeSimplePast2pl',
            indicativeSimplePast2plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeSimplePast2pl(indicativeSimplePast2plValue)
        setValue(
            'indicativeSimplePast3pl',
            indicativeSimplePast3plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeSimplePast3pl(indicativeSimplePast3plValue)
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
            // NB! These fields are not included in BE autocomplete response, so we must manually include them
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
                {
                    caseName: VerbCases.caseTypeDE,
                    // we need to create the acronym to match data-format from BE
                    word: getAcronymFromVerbCaseTypes(verbCases)
                },
                {
                    caseName: VerbCases.prefixDE,
                    word: prefix
                },
            ]
        }
        setValuesInForm(completeFormWithAutocomplete)
    }

    // before making the request, we check if the query is correct according to the form's validation
    const validAutocompleteRequest = errors['infinitive'] === undefined
    useEffect(() => {
        if((infinitive.length > 2) && (validAutocompleteRequest)){
            setTimerTriggerFunction(
                () => {
                    dispatch(getAutocompletedGermanVerbData(infinitive))
                },
                600
            )
        }
    },[infinitive, validAutocompleteRequest])

    const initialAutoDetectPrefixValue = {
        detected: false,
        prefixCase: "" as "" // to satisfy TS
    }
    const [autoDetectedPrefix, setAutoDetectedPrefix] = useState<CheckForPatternResponse>(initialAutoDetectPrefixValue)

    useEffect(() => {
        if(infinitive.length > 2){ // shortest verb in German: tun
            const timeoutId = setTimeout(() => {
                setAutoDetectedPrefix(checkForPatternPrefixDE(infinitive))
            }, 2000);

            return () => clearTimeout(timeoutId)
        } else {
            setAutoDetectedPrefix(initialAutoDetectPrefixValue)
        }
    }, [infinitive])

    useEffect(() => {
        if(autoDetectedPrefix.detected && !props.displayOnly){
            setDisplayPrefixList(true)
        }
    }, [autoDetectedPrefix])

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
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, (auxiliaryVerb))) &&
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
                    }
                    {!(props.displayOnly!) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <Button
                                variant={'text'}
                                onClick={() => {
                                    setDisplayPrefixList((prevValue) => !prevValue)
                                }}
                            >
                                {(displayPrefixList) ? "Hide prefixes" : "Display prefixes"}
                            </Button>
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, (prefix))) &&
                        <Grid
                            container={true}
                            item={true}
                            xs={12}
                        >
                            <Collapse
                                in={
                                    (displayPrefixList)
                                    ||
                                    (props.displayOnly!)
                                }
                            >
                                <Grid
                                    item={true}
                                >
                                    <RadioGroupWithHook
                                        control={control}
                                        label={"Prefix"}
                                        name={"prefix"}
                                        options={Object.values(PrefixesVerbDE)}
                                        defaultValue={""}
                                        errors={errors.prefix}
                                        onChange={(value: any) => {
                                            setPrefix(value)
                                        }}
                                        fullWidth={false}
                                        disabled={props.displayOnly}
                                        displayTooltip={
                                            (autoDetectedPrefix!! &&autoDetectedPrefix.detected)
                                                ? autoDetectedPrefix.prefixCase
                                                : undefined
                                        }
                                        suffix={'-'}
                                    />
                                </Grid>
                            </Collapse>
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, (verbCases.length>0) ?'-':"")) &&
                        <Grid
                            container={true}
                            item={true}
                            xs={12}
                        >
                            <Grid
                                item={true}
                            >
                                <CheckboxGroupWithHook
                                    control={control}
                                    groupLabel={"Verb case"}
                                    name={"verbCases"}
                                    options={[
                                        {label: 'Accusative', value: VerbCaseTypeDE.accusativeDE},
                                        {label: 'Dative', value: VerbCaseTypeDE.dativeDE},
                                        {label: 'Genitive', value: VerbCaseTypeDE.genitiveDE},
                                    ]}
                                    defaultValue={[]}
                                    errors={errors.auxiliaryVerb}
                                    onChange={(value: CheckboxItemData[]) => {
                                        setVerbCases(value)
                                    }}
                                    fullWidth={false}
                                    disabled={props.displayOnly}
                                />
                            </Grid>
                        </Grid>
                    }
                    {/*
                        TODO: add multiselect for verb categories based on their grammatical and syntactic behavior?
                         (Transitive, Intransitive, Dative, Reflexive, Impersonal, Modal, Auxiliary, Separable and Inseparable Prefix)?
                    */}
                    {/*
                        TODO: add select for separable-verb prefix? Could also autodetect if it matches and suggest it?
                         [ab, an, auf, aus, bei, da, dar, durch, ein, fern, fest, fort, gegen, her, hin, los, mit, nach,
                         nieder, um, vor, weg, wieder, zu, zurück, zusammen]
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
                    {/* Simple future (Futur I) */}
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
                                        errors={errors.indicativeSimpleFuture1s}
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
                                        errors={errors.indicativeSimpleFuture2s}
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
                                        errors={errors.indicativeSimpleFuture3s}
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
                                        errors={errors.indicativeSimpleFuture1pl}
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
                                        errors={errors.indicativeSimpleFuture2pl}
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
                                        errors={errors.indicativeSimpleFuture3pl}
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
                    {/* SIMPLE PAST (Präteritum) */}
                    {
                        (
                            indicativeSimplePast1s!! || indicativeSimplePast2s!! || indicativeSimplePast3s!! ||
                            indicativeSimplePast1pl!! || indicativeSimplePast2pl!! || indicativeSimplePast3pl!! ||
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
                                    Simple Past (präteritum):
                                </Typography>
                            </Grid>
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeSimplePast1s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Ich'}
                                        name={"indicativeSimplePast1s"}
                                        defaultValue={""}
                                        errors={errors.indicativeSimplePast1s}
                                        onChange={(value: any) => {
                                            setIndicativeSimplePast1s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeSimplePast2s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Du'}
                                        name={"indicativeSimplePast2s"}
                                        defaultValue={""}
                                        errors={errors.indicativeSimplePast2s}
                                        onChange={(value: any) => {
                                            setIndicativeSimplePast2s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeSimplePast3s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Er/Sie/es'}
                                        name={"indicativeSimplePast3s"}
                                        defaultValue={""}
                                        errors={errors.indicativeSimplePast3s}
                                        onChange={(value: any) => {
                                            setIndicativeSimplePast3s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeSimplePast1pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Wir'}
                                        name={"indicativeSimplePast1pl"}
                                        defaultValue={""}
                                        errors={errors.indicativeSimplePast1pl}
                                        onChange={(value: any) => {
                                            setIndicativeSimplePast1pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeSimplePast2pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Ihr'}
                                        name={"indicativeSimplePast2pl"}
                                        defaultValue={""}
                                        errors={errors.indicativeSimplePast2pl}
                                        onChange={(value: any) => {
                                            setIndicativeSimplePast2pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeSimplePast3pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Sie'}
                                        name={"indicativeSimplePast3pl"}
                                        defaultValue={""}
                                        errors={errors.indicativeSimplePast3pl}
                                        onChange={(value: any) => {
                                            setIndicativeSimplePast3pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
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