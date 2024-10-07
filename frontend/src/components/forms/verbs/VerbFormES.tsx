import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {TranslationItem, WordItem} from "../../../ts/interfaces";
import {Lang, VerbCases, VerbRegularity} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../../app/store";
import {getAutocompletedSpanishVerbData} from "../../../features/autocompletedTranslation/autocompletedTranslationSlice";
import LinearIndeterminate from "../../Spinner";
import {setTimerTriggerFunction} from "../../generalUseFunctions";
import {AutocompleteButtonWithStatus} from "../AutocompleteButtonWithStatus";
import Typography from "@mui/material/Typography";
import {RadioGroupWithHook} from "../../RadioGroupFormHook";
import {useTranslation} from "react-i18next";

interface VerbFormESProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the Spanish translation of a verb (and handles the validations)
export function VerbFormES(props: VerbFormESProps) {
    const { t } = useTranslation(['wordRelated'])
    const dispatch = useDispatch<AppDispatch>()
    const {autocompletedTranslationVerbES, isErrorAT, isSuccessAT, isLoadingAT, messageAT} = useSelector((state: any) => state.autocompletedTranslations)

    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        //  Properties
        regularity: Yup.string()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' }))
            .matches(/^(regular|irregular)?$/, t('wordForm.verb.errors.formES.regularityRequired', { ns: 'wordRelated' })),
        // Infinitives
        infinitiveNonFiniteSimple: Yup.string()
            .required(t('wordForm.verb.errors.formES.infinitiveNonFiniteRequired', { ns: 'wordRelated' }))
            .matches(/^[^0-9]+$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' }))
            .matches(/^(?!.*\d).*(ar|er|ir)$/, "Please input infinitive form (ends in '-ar', '-er' or '-ir')."),
        gerundNonFiniteSimple: Yup.string()
            .required(t('wordForm.verb.errors.formES.gerundNonFiniteRequired', { ns: 'wordRelated' }))
            .matches(/^[^0-9]+$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        participleNonFiniteSimple: Yup.string()
            .required(t('wordForm.verb.errors.formES.participleNonFiniteRequired', { ns: 'wordRelated' }))
            .matches(/^[^0-9]+$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        // INDICATIVE - SIMPLE TIME - PRESENT
        indicativePresent1s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativePresent2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativePresent3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativePresent1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativePresent2pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativePresent3pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        // INDICATIVE - SIMPLE TIME - PRET. IMPERFECTO
        indicativeImperfectPast1s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativeImperfectPast2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativeImperfectPast3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativeImperfectPast1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativeImperfectPast2pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativeImperfectPast3pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        // INDICATIVE - SIMPLE TIME - PRET. PERFECTO
        indicativePerfectSimplePast1s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativePerfectSimplePast2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativePerfectSimplePast3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativePerfectSimplePast1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativePerfectSimplePast2pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativePerfectSimplePast3pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        // INDICATIVE - SIMPLE TIME - FUTURE
        indicativeFuture1s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativeFuture2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativeFuture3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativeFuture1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativeFuture2pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        indicativeFuture3pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [regularity, setRegularity] = useState<"regular"|"irregular"|"">("")
    // Mandatory fields: can't be autocompleted
    const [infinitiveNonFiniteSimple, setInfinitiveNonFiniteSimple] = useState("")
    const [gerundNonFiniteSimple, setGerundNonFiniteSimple] = useState("")
    const [participleNonFiniteSimple, setParticipleNonFiniteSimple] = useState("")
    // Optional fields: can be filled with autocomplete
    // Modo indicativo - tiempo simple - presente
    const [indicativePresent1s, setIndicativePresent1s] = useState("")
    const [indicativePresent2s, setIndicativePresent2s] = useState("")
    const [indicativePresent3s, setIndicativePresent3s] = useState("")
    const [indicativePresent1pl, setIndicativePresent1pl] = useState("")
    const [indicativePresent2pl, setIndicativePresent2pl] = useState("")
    const [indicativePresent3pl, setIndicativePresent3pl] = useState("")
    // Modo indicativo - tiempo simple - preterito imperfecto
    const [indicativeImperfectPast1s, setIndicativeImperfectPast1s] = useState("")
    const [indicativeImperfectPast2s, setIndicativeImperfectPast2s] = useState("")
    const [indicativeImperfectPast3s, setIndicativeImperfectPast3s] = useState("")
    const [indicativeImperfectPast1pl, setIndicativeImperfectPast1pl] = useState("")
    const [indicativeImperfectPast2pl, setIndicativeImperfectPast2pl] = useState("")
    const [indicativeImperfectPast3pl, setIndicativeImperfectPast3pl] = useState("")
    // Modo indicativo - tiempo simple - preterito perfecto
    const [indicativePerfectSimplePast1s, setIndicativePerfectSimplePast1s] = useState("")
    const [indicativePerfectSimplePast2s, setIndicativePerfectSimplePast2s] = useState("")
    const [indicativePerfectSimplePast3s, setIndicativePerfectSimplePast3s] = useState("")
    const [indicativePerfectSimplePast1pl, setIndicativePerfectSimplePast1pl] = useState("")
    const [indicativePerfectSimplePast2pl, setIndicativePerfectSimplePast2pl] = useState("")
    const [indicativePerfectSimplePast3pl, setIndicativePerfectSimplePast3pl] = useState("")
    // Modo indicativo - tiempo simple - preterito perfecto
    const [indicativeFuture1s, setIndicativeFuture1s] = useState("")
    const [indicativeFuture2s, setIndicativeFuture2s] = useState("")
    const [indicativeFuture3s, setIndicativeFuture3s] = useState("")
    const [indicativeFuture1pl, setIndicativeFuture1pl] = useState("")
    const [indicativeFuture2pl, setIndicativeFuture2pl] = useState("")
    const [indicativeFuture3pl, setIndicativeFuture3pl] = useState("")

    useEffect(() => {
        const currentCases: WordItem[] = [
            {
                caseName: VerbCases.regularityES,
                word: regularity
            },
            // infinitives
            {
                caseName: VerbCases.infinitiveNonFiniteSimpleES,
                word: infinitiveNonFiniteSimple.toLowerCase()
            },
            {
                caseName: VerbCases.gerundNonFiniteSimpleES,
                word: gerundNonFiniteSimple.toLowerCase()
            },
            {
                caseName: VerbCases.participleNonFiniteSimpleES,
                word: participleNonFiniteSimple.toLowerCase()
            },
            // INDICATIVO - TIEMPO SIMPLE - PRESENTE
            {
                caseName: VerbCases.indicativePresent1sES,
                word: indicativePresent1s.toLowerCase()
            },
            {
                caseName: VerbCases.indicativePresent2sES,
                word: indicativePresent2s.toLowerCase()
            },
            {
                caseName: VerbCases.indicativePresent3sES,
                word: indicativePresent3s.toLowerCase()
            },
            {
                caseName: VerbCases.indicativePresent1plES,
                word: indicativePresent1pl.toLowerCase()
            },
            {
                caseName: VerbCases.indicativePresent2plES,
                word: indicativePresent2pl.toLowerCase()
            },
            {
                caseName: VerbCases.indicativePresent3plES,
                word: indicativePresent3pl.toLowerCase()
            },
            // INDICATIVO - TIEMPO SIMPLE - PRET. IMPERFECTO
            {
                caseName: VerbCases.indicativeImperfectPast1sES,
                word: indicativeImperfectPast1s.toLowerCase()
            },
            {
                caseName: VerbCases.indicativeImperfectPast2sES,
                word: indicativeImperfectPast2s.toLowerCase()
            },
            {
                caseName: VerbCases.indicativeImperfectPast3sES,
                word: indicativeImperfectPast3s.toLowerCase()
            },
            {
                caseName: VerbCases.indicativeImperfectPast1plES,
                word: indicativeImperfectPast1pl.toLowerCase()
            },
            {
                caseName: VerbCases.indicativeImperfectPast2plES,
                word: indicativeImperfectPast2pl.toLowerCase()
            },
            {
                caseName: VerbCases.indicativeImperfectPast3plES,
                word: indicativeImperfectPast3pl.toLowerCase()
            },
            // INDICATIVO - TIEMPO SIMPLE - PRET. PERFECTO
            {
                caseName: VerbCases.indicativePerfectSimplePast1sES,
                word: indicativePerfectSimplePast1s.toLowerCase()
            },
            {
                caseName: VerbCases.indicativePerfectSimplePast2sES,
                word: indicativePerfectSimplePast2s.toLowerCase()
            },
            {
                caseName: VerbCases.indicativePerfectSimplePast3sES,
                word: indicativePerfectSimplePast3s.toLowerCase()
            },
            {
                caseName: VerbCases.indicativePerfectSimplePast1plES,
                word: indicativePerfectSimplePast1pl.toLowerCase()
            },
            {
                caseName: VerbCases.indicativePerfectSimplePast2plES,
                word: indicativePerfectSimplePast2pl.toLowerCase()
            },
            {
                caseName: VerbCases.indicativePerfectSimplePast3plES,
                word: indicativePerfectSimplePast3pl.toLowerCase()
            },
            // INDICATIVO - TIEMPO SIMPLE - PRET. PERFECTO
            {
                caseName: VerbCases.indicativePerfectSimplePast1sES,
                word: indicativePerfectSimplePast1s.toLowerCase()
            },
            {
                caseName: VerbCases.indicativePerfectSimplePast2sES,
                word: indicativePerfectSimplePast2s.toLowerCase()
            },
            {
                caseName: VerbCases.indicativePerfectSimplePast3sES,
                word: indicativePerfectSimplePast3s.toLowerCase()
            },
            {
                caseName: VerbCases.indicativePerfectSimplePast1plES,
                word: indicativePerfectSimplePast1pl.toLowerCase()
            },
            {
                caseName: VerbCases.indicativePerfectSimplePast2plES,
                word: indicativePerfectSimplePast2pl.toLowerCase()
            },
            {
                caseName: VerbCases.indicativePerfectSimplePast3plES,
                word: indicativePerfectSimplePast3pl.toLowerCase()
            },
            // INDICATIVO - TIEMPO SIMPLE - FUTURE
            {
                caseName: VerbCases.indicativeFuture1sES,
                word: indicativeFuture1s.toLowerCase()
            },
            {
                caseName: VerbCases.indicativeFuture2sES,
                word: indicativeFuture2s.toLowerCase()
            },
            {
                caseName: VerbCases.indicativeFuture3sES,
                word: indicativeFuture3s.toLowerCase()
            },
            {
                caseName: VerbCases.indicativeFuture1plES,
                word: indicativeFuture1pl.toLowerCase()
            },
            {
                caseName: VerbCases.indicativeFuture2plES,
                word: indicativeFuture2pl.toLowerCase()
            },
            {
                caseName: VerbCases.indicativeFuture3plES,
                word: indicativeFuture3pl.toLowerCase()
            },
        ]
        props.updateFormData({
            language: Lang.ES,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [
        infinitiveNonFiniteSimple, gerundNonFiniteSimple, participleNonFiniteSimple,
        indicativePresent1s, indicativePresent2s, indicativePresent3s, indicativePresent1pl,
        indicativePresent2pl, indicativePresent3pl,
        indicativeImperfectPast1s, indicativeImperfectPast2s, indicativeImperfectPast3s, indicativeImperfectPast1pl,
        indicativeImperfectPast2pl, indicativeImperfectPast3pl,
        indicativePerfectSimplePast1s, indicativePerfectSimplePast2s, indicativePerfectSimplePast3s,
        indicativePerfectSimplePast1pl, indicativePerfectSimplePast2pl, indicativePerfectSimplePast3pl,
        indicativeFuture1s, indicativeFuture2s, indicativeFuture3s, indicativeFuture1pl, indicativeFuture2pl,
        indicativeFuture3pl,
        regularity, isValid
    ])

    const setValuesInForm = (translationDataToInsert: TranslationItem) => {
        const regularityValue: string = getWordByCase(VerbCases.regularityES, translationDataToInsert)

        const infinitiveNonFiniteSimpleValue: string = getWordByCase(VerbCases.infinitiveNonFiniteSimpleES, translationDataToInsert)
        const gerundNonFiniteSimpleValue: string = getWordByCase(VerbCases.gerundNonFiniteSimpleES, translationDataToInsert)
        const participleNonFiniteSimpleValue: string = getWordByCase(VerbCases.participleNonFiniteSimpleES, translationDataToInsert)

        const indicativePresent1sValue: string = getWordByCase(VerbCases.indicativePresent1sES, translationDataToInsert)
        const indicativePresent2sValue: string = getWordByCase(VerbCases.indicativePresent2sES, translationDataToInsert)
        const indicativePresent3sValue: string = getWordByCase(VerbCases.indicativePresent3sES, translationDataToInsert)
        const indicativePresent1plValue: string = getWordByCase(VerbCases.indicativePresent1plES, translationDataToInsert)
        const indicativePresent2plValue: string = getWordByCase(VerbCases.indicativePresent2plES, translationDataToInsert)
        const indicativePresent3plValue: string = getWordByCase(VerbCases.indicativePresent3plES, translationDataToInsert)

        const indicativeImperfectPast1sValue: string = getWordByCase(VerbCases.indicativeImperfectPast1sES, translationDataToInsert)
        const indicativeImperfectPast2sValue: string = getWordByCase(VerbCases.indicativeImperfectPast2sES, translationDataToInsert)
        const indicativeImperfectPast3sValue: string = getWordByCase(VerbCases.indicativeImperfectPast3sES, translationDataToInsert)
        const indicativeImperfectPast1plValue: string = getWordByCase(VerbCases.indicativeImperfectPast1plES, translationDataToInsert)
        const indicativeImperfectPast2plValue: string = getWordByCase(VerbCases.indicativeImperfectPast2plES, translationDataToInsert)
        const indicativeImperfectPast3plValue: string = getWordByCase(VerbCases.indicativeImperfectPast3plES, translationDataToInsert)

        const indicativePerfectSimplePast1sValue: string = getWordByCase(VerbCases.indicativePerfectSimplePast1sES, translationDataToInsert)
        const indicativePerfectSimplePast2sValue: string = getWordByCase(VerbCases.indicativePerfectSimplePast2sES, translationDataToInsert)
        const indicativePerfectSimplePast3sValue: string = getWordByCase(VerbCases.indicativePerfectSimplePast3sES, translationDataToInsert)
        const indicativePerfectSimplePast1plValue: string = getWordByCase(VerbCases.indicativePerfectSimplePast1plES, translationDataToInsert)
        const indicativePerfectSimplePast2plValue: string = getWordByCase(VerbCases.indicativePerfectSimplePast2plES, translationDataToInsert)
        const indicativePerfectSimplePast3plValue: string = getWordByCase(VerbCases.indicativePerfectSimplePast3plES, translationDataToInsert)

        const indicativeFuture1sValue: string = getWordByCase(VerbCases.indicativeFuture1sES, translationDataToInsert)
        const indicativeFuture2sValue: string = getWordByCase(VerbCases.indicativeFuture2sES, translationDataToInsert)
        const indicativeFuture3sValue: string = getWordByCase(VerbCases.indicativeFuture3sES, translationDataToInsert)
        const indicativeFuture1plValue: string = getWordByCase(VerbCases.indicativeFuture1plES, translationDataToInsert)
        const indicativeFuture2plValue: string = getWordByCase(VerbCases.indicativeFuture2plES, translationDataToInsert)
        const indicativeFuture3plValue: string = getWordByCase(VerbCases.indicativeFuture3plES, translationDataToInsert)

        setValue(
            'regularity',
            regularityValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setRegularity(regularityValue as "regular"|"irregular")
        setValue(
            'infinitiveNonFiniteSimple',
            infinitiveNonFiniteSimpleValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setInfinitiveNonFiniteSimple(infinitiveNonFiniteSimpleValue)
        setValue(
            'gerundNonFiniteSimple',
            gerundNonFiniteSimpleValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setGerundNonFiniteSimple(gerundNonFiniteSimpleValue)
        setValue(
            'participleNonFiniteSimple',
            participleNonFiniteSimpleValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setParticipleNonFiniteSimple(participleNonFiniteSimpleValue)
        // optional fields:
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
        // INDICATIVE - SIMPLE TIME - PRET. IMPERFECTO
        setValue(
            'indicativeImperfectPast1s',
            indicativeImperfectPast1sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeImperfectPast1s(indicativeImperfectPast1sValue)
        setValue(
            'indicativeImperfectPast2s',
            indicativeImperfectPast2sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeImperfectPast2s(indicativeImperfectPast2sValue)
        setValue(
            'indicativeImperfectPast3s',
            indicativeImperfectPast3sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeImperfectPast3s(indicativeImperfectPast3sValue)
        setValue(
            'indicativeImperfectPast1pl',
            indicativeImperfectPast1plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeImperfectPast1pl(indicativeImperfectPast1plValue)
        setValue(
            'indicativeImperfectPast2pl',
            indicativeImperfectPast2plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeImperfectPast2pl(indicativeImperfectPast2plValue)
        setValue(
            'indicativeImperfectPast3pl',
            indicativeImperfectPast3plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeImperfectPast3pl(indicativeImperfectPast3plValue)
        // INDICATIVE - SIMPLE TIME - PRET. PERFECTO
        setValue(
            'indicativePerfectSimplePast1s',
            indicativePerfectSimplePast1sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePerfectSimplePast1s(indicativePerfectSimplePast1sValue)
        setValue(
            'indicativePerfectSimplePast2s',
            indicativePerfectSimplePast2sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePerfectSimplePast2s(indicativePerfectSimplePast2sValue)
        setValue(
            'indicativePerfectSimplePast3s',
            indicativePerfectSimplePast3sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePerfectSimplePast3s(indicativePerfectSimplePast3sValue)
        setValue(
            'indicativePerfectSimplePast1pl',
            indicativePerfectSimplePast1plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePerfectSimplePast1pl(indicativePerfectSimplePast1plValue)
        setValue(
            'indicativePerfectSimplePast2pl',
            indicativePerfectSimplePast2plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePerfectSimplePast2pl(indicativePerfectSimplePast2plValue)
        setValue(
            'indicativePerfectSimplePast3pl',
            indicativePerfectSimplePast3plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePerfectSimplePast3pl(indicativePerfectSimplePast3plValue)
        // INDICATIVE - SIMPLE TIME - FUTURE
        setValue(
            'indicativeFuture1s',
            indicativeFuture1sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeFuture1s(indicativeFuture1sValue)
        setValue(
            'indicativeFuture2s',
            indicativeFuture2sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeFuture2s(indicativeFuture2sValue)
        setValue(
            'indicativeFuture3s',
            indicativeFuture3sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeFuture3s(indicativeFuture3sValue)
        setValue(
            'indicativeFuture1pl',
            indicativeFuture1plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeFuture1pl(indicativeFuture1plValue)
        setValue(
            'indicativeFuture2pl',
            indicativeFuture2plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeFuture2pl(indicativeFuture2plValue)
        setValue(
            'indicativeFuture3pl',
            indicativeFuture3plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativeFuture3pl(indicativeFuture3plValue)
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
            ...autocompletedTranslationVerbES,
            // NB! These fields are not included in BE autocomplete response, so we must manually include
            cases: [
                ...autocompletedTranslationVerbES.cases,
                {
                    caseName: VerbCases.infinitiveNonFiniteSimpleES,
                    word: infinitiveNonFiniteSimple
                },
                {
                    caseName: VerbCases.gerundNonFiniteSimpleES,
                    word: gerundNonFiniteSimple
                },
                {
                    caseName: VerbCases.participleNonFiniteSimpleES,
                    word: participleNonFiniteSimple
                }
            ]
        }
        setValuesInForm(completeFormWithAutocomplete)
    }

    // before making the request, we check if the query is correct according to the form's validation
    const validAutocompleteRequest = errors['infinitiveNonFiniteSimple'] === undefined
    useEffect(() => {
        if((infinitiveNonFiniteSimple !== "") && (validAutocompleteRequest)){
            setTimerTriggerFunction(
                () => {
                    dispatch(getAutocompletedSpanishVerbData(infinitiveNonFiniteSimple))
                },
                600
            )
        }
    },[infinitiveNonFiniteSimple, validAutocompleteRequest])

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
                                    emptyQuery: t('wordForm.autocompleteTranslationButton.emptyQuery', { ns: 'wordRelated', requiredField: "infinitive non-finite simple" }),
                                    noMatch: t('wordForm.autocompleteTranslationButton.noMatch', { ns: 'wordRelated' }),
                                    foundMatch: t('wordForm.autocompleteTranslationButton.foundMatch', { ns: 'wordRelated' }),
                                }}
                                queryValue={infinitiveNonFiniteSimple}
                                autocompleteResponse={autocompletedTranslationVerbES}
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
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, infinitiveNonFiniteSimple)) &&
                        <Grid
                            item={true}
                            xs={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Infinitive non-finite simple"}
                                name={"infinitiveNonFiniteSimple"}
                                defaultValue={""}
                                errors={errors.infinitiveNonFiniteSimple}
                                onChange={(value: any) => {
                                    setInfinitiveNonFiniteSimple(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, gerundNonFiniteSimple)) &&
                        <Grid
                            item={true}
                            xs={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Gerund non-finite simple"}
                                name={"gerundNonFiniteSimple"}
                                defaultValue={""}
                                errors={errors.gerundNonFiniteSimple}
                                onChange={(value: any) => {
                                    setGerundNonFiniteSimple(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, participleNonFiniteSimple)) &&
                        <Grid
                            item={true}
                            xs={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Participle non-finite simple"}
                                name={"participleNonFiniteSimple"}
                                defaultValue={""}
                                errors={errors.participleNonFiniteSimple}
                                onChange={(value: any) => {
                                    setParticipleNonFiniteSimple(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
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
                                    errors={errors.auxiliaryVerb}
                                    onChange={(value: any) => {
                                        setRegularity(value)
                                    }}
                                    fullWidth={false}
                                    disabled={props.displayOnly}
                                />
                            </Grid>
                        </Grid>
                    }
                    {/* OPTIONAL FIELDS */}
                    {
                        (
                            indicativePresent1s!! || indicativePresent2s!! || indicativePresent3s!! ||
                            indicativePresent1pl!! || indicativePresent2pl!! || indicativePresent3pl!! ||
                            indicativeImperfectPast1s!! || indicativeImperfectPast2s!! || indicativeImperfectPast3s!! ||
                            indicativeImperfectPast1pl!! || indicativeImperfectPast2pl!! || indicativeImperfectPast3pl!! ||
                            indicativePerfectSimplePast1s!! || indicativePerfectSimplePast2s!! || indicativePerfectSimplePast3s!! ||
                            indicativePerfectSimplePast1pl!! || indicativePerfectSimplePast2pl!! || indicativePerfectSimplePast3pl!! ||
                            indicativeFuture1s!! || indicativeFuture2s!! || indicativeFuture3s!! ||
                            indicativeFuture1pl!! || indicativeFuture2pl!! || indicativeFuture3pl!! ||
                            !props.displayOnly
                        ) &&
                        <Grid
                            container={true}
                            item={true}
                            direction={"column"}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            <Grid
                                item={true}
                                xs={'auto'}
                            >
                                <Typography
                                    variant={'h3'}
                                    alignContent={'center'}
                                    sx={{
                                        textDecoration: 'underline',
                                    }}
                                >
                                    Modo indicativo:
                                </Typography>
                            </Grid>
                        </Grid>
                    }
                    {
                        (
                            indicativePresent1s!! || indicativePresent2s!! || indicativePresent3s!! ||
                            indicativePresent1pl!! || indicativePresent2pl!! || indicativePresent3pl!! ||

                            !props.displayOnly
                        ) &&
                        <Grid
                            container={true}
                            item={true}
                            direction={"column"}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            <Grid
                                item={true}
                                xs={'auto'}
                            >
                                <Typography
                                    variant={'h4'}
                                >
                                    Tiempo simple:
                                </Typography>
                            </Grid>
                        </Grid>
                    }
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
                            >
                                <Typography
                                    variant={'h6'}
                                >
                                    Presente:
                                </Typography>
                            </Grid>
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePresent1s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Yo"}
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
                                        label={"Vos"} // TODO: should change if user picks other spanish style
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
                                        label={"Él/Ella/eso"}
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
                                        label={"Nosotros/as"}
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
                                        label={"Ustedes"} // TODO: should change if user picks other spanish style
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
                                        label={"Ellos/as"}
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
                    {
                        (
                            indicativeImperfectPast1s!! || indicativeImperfectPast2s!! || indicativeImperfectPast3s!! ||
                            indicativeImperfectPast1pl!! || indicativeImperfectPast2pl!! || indicativeImperfectPast3pl!! ||
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
                                    variant={'h6'}
                                >
                                    Pret. imperfecto:
                                </Typography>
                            </Grid>
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeImperfectPast1s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Yo"}
                                        name={"indicativeImperfectPast1s"}
                                        defaultValue={""}
                                        errors={errors.indicativeImperfectPast1s}
                                        onChange={(value: any) => {
                                            setIndicativeImperfectPast1s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeImperfectPast2s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Vos"} // TODO: should change if user picks other spanish style
                                        name={"indicativeImperfectPast2s"}
                                        defaultValue={""}
                                        errors={errors.indicativeImperfectPast2s}
                                        onChange={(value: any) => {
                                            setIndicativeImperfectPast2s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeImperfectPast3s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Él/Ella/eso"}
                                        name={"indicativeImperfectPast3s"}
                                        defaultValue={""}
                                        errors={errors.indicativeImperfectPast3s}
                                        onChange={(value: any) => {
                                            setIndicativeImperfectPast3s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeImperfectPast1pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Nosotros/as"}
                                        name={"indicativeImperfectPast1pl"}
                                        defaultValue={""}
                                        errors={errors.indicativeImperfectPast1pl}
                                        onChange={(value: any) => {
                                            setIndicativeImperfectPast1pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeImperfectPast2pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Ustedes"} // TODO: should change if user picks other spanish style
                                        name={"indicativeImperfectPast2pl"}
                                        defaultValue={""}
                                        errors={errors.indicativeImperfectPast2pl}
                                        onChange={(value: any) => {
                                            setIndicativeImperfectPast2pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeImperfectPast3pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Ellos/as"}
                                        name={"indicativeImperfectPast3pl"}
                                        defaultValue={""}
                                        errors={errors.indicativeImperfectPast3pl}
                                        onChange={(value: any) => {
                                            setIndicativeImperfectPast3pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                        </Grid>
                    }
                    {
                        (
                            indicativePerfectSimplePast1s!! || indicativePerfectSimplePast2s!! || indicativePerfectSimplePast3s!! ||
                            indicativePerfectSimplePast1pl!! || indicativePerfectSimplePast2pl!! || indicativePerfectSimplePast3pl!! ||
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
                                    variant={'h6'}
                                >
                                    Pret. perfecto:
                                </Typography>
                            </Grid>
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePerfectSimplePast1s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Yo"}
                                        name={"indicativePerfectSimplePast1s"}
                                        defaultValue={""}
                                        errors={errors.indicativePerfectSimplePast1s}
                                        onChange={(value: any) => {
                                            setIndicativePerfectSimplePast1s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePerfectSimplePast2s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Vos"} // TODO: should change if user picks other spanish style
                                        name={"indicativePerfectSimplePast2s"}
                                        defaultValue={""}
                                        errors={errors.indicativePerfectSimplePast2s}
                                        onChange={(value: any) => {
                                            setIndicativePerfectSimplePast2s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePerfectSimplePast3s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Él/Ella/eso"}
                                        name={"indicativePerfectSimplePast3s"}
                                        defaultValue={""}
                                        errors={errors.indicativePerfectSimplePast3s}
                                        onChange={(value: any) => {
                                            setIndicativePerfectSimplePast3s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePerfectSimplePast1pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Nosotros/as"}
                                        name={"indicativePerfectSimplePast1pl"}
                                        defaultValue={""}
                                        errors={errors.indicativePerfectSimplePast1pl}
                                        onChange={(value: any) => {
                                            setIndicativePerfectSimplePast1pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePerfectSimplePast2pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Ustedes"} // TODO: should change if user picks other spanish style
                                        name={"indicativePerfectSimplePast2pl"}
                                        defaultValue={""}
                                        errors={errors.indicativePerfectSimplePast2pl}
                                        onChange={(value: any) => {
                                            setIndicativePerfectSimplePast2pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePerfectSimplePast3pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Ellos/as"}
                                        name={"indicativePerfectSimplePast3pl"}
                                        defaultValue={""}
                                        errors={errors.indicativePerfectSimplePast3pl}
                                        onChange={(value: any) => {
                                            setIndicativePerfectSimplePast3pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                        </Grid>
                    }
                    {
                        (
                            indicativeFuture1s!! || indicativeFuture2s!! || indicativeFuture3s!! ||
                            indicativeFuture1pl!! || indicativeFuture2pl!! || indicativeFuture3pl!! ||
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
                                    variant={'h6'}
                                >
                                    Future:
                                </Typography>
                            </Grid>
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeFuture1s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Yo"}
                                        name={"indicativeFuture1s"}
                                        defaultValue={""}
                                        errors={errors.indicativeFuture1s}
                                        onChange={(value: any) => {
                                            setIndicativeFuture1s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeFuture2s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Vos"} // TODO: should change if user picks other spanish style
                                        name={"indicativeFuture2s"}
                                        defaultValue={""}
                                        errors={errors.indicativeFuture2s}
                                        onChange={(value: any) => {
                                            setIndicativeFuture2s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeFuture3s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Él/Ella/eso"}
                                        name={"indicativeFuture3s"}
                                        defaultValue={""}
                                        errors={errors.indicativeFuture3s}
                                        onChange={(value: any) => {
                                            setIndicativeFuture3s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeFuture1pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Nosotros/as"}
                                        name={"indicativeFuture1pl"}
                                        defaultValue={""}
                                        errors={errors.indicativeFuture1pl}
                                        onChange={(value: any) => {
                                            setIndicativeFuture1pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeFuture2pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Ustedes"} // TODO: should change if user picks other spanish style
                                        name={"indicativeFuture2pl"}
                                        defaultValue={""}
                                        errors={errors.indicativeFuture2pl}
                                        onChange={(value: any) => {
                                            setIndicativeFuture2pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativeFuture3pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={"Ellos/as"}
                                        name={"indicativeFuture3pl"}
                                        defaultValue={""}
                                        errors={errors.indicativeFuture3pl}
                                        onChange={(value: any) => {
                                            setIndicativeFuture3pl(value)
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