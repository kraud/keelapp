import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Checkbox, Grid, InputAdornment} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {TranslationItem, WordItem} from "../../../ts/interfaces";
import {Lang, VerbCases, VerbRegularity} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../../app/store";
import {
    getAutocompletedEstonianVerbData,
} from "../../../features/autocompletedTranslation/autocompletedTranslationSlice";
import LinearIndeterminate from "../../Spinner";
import {setTimerTriggerFunction} from "../../generalUseFunctions";
import {AutocompleteButtonWithStatus} from "../AutocompleteButtonWithStatus";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import globalTheme from "../../../theme/theme";
import Tooltip from "@mui/material/Tooltip";
import {useTranslation} from "react-i18next";
import {RadioGroupWithHook} from "../../RadioGroupFormHook";

interface VerbFormEEProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the estonian translation of a verb (and handles the validations)
export function VerbFormEE(props: VerbFormEEProps) {
    const { t } = useTranslation(['wordRelated'])
    const dispatch = useDispatch<AppDispatch>()
    const {autocompletedTranslationVerbEE, isErrorAT, isSuccessAT, isLoadingAT, messageAT} = useSelector((state: any) => state.autocompletedTranslations)
    const [searchInEnglish, setSearchInEnglish] = useState(false)

    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        regularity: Yup.string()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' }))
            .matches(/^(regular|irregular)?$/, t('wordForm.verb.errors.formEN.regularityRequired', { ns: 'wordRelated' })),
        infinitiveMa: (searchInEnglish)
            ? Yup.string()
                .required(t('wordForm.verb.errors.formEE.infinitiveMaRequired', { ns: 'wordRelated' }))
                .matches(/^[^0-9]+$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' }))
            : Yup.string()
                .required(t('wordForm.verb.errors.formEE.infinitiveMaRequired', { ns: 'wordRelated' }))
                .matches(/^[^0-9]+$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' }))
                .matches(/^(?!.*\d).*(ma)$/, t('wordForm.verb.errors.formEE.infinitiveMaNotMatching', { ns: 'wordRelated' })),
        infinitiveDa: Yup.string()
            .required(t('wordForm.verb.errors.formEE.infinitiveDaRequired', { ns: 'wordRelated' }))
            .matches(/^[^0-9]+$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        // KINDEL: PRESENT
        kindelPresent1s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        kindelPresent2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        kindelPresent3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        kindelPresent1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        kindelPresent2pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        kindelPresent3pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        // KINDEL: SIMPLE PAST
        kindelSimplePast1s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        kindelSimplePast2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        kindelSimplePast3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        kindelSimplePast1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        kindelSimplePast2pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        kindelSimplePast3pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        // KINDEL: PAST PERFECT
        kindelPastPerfect1s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        kindelPastPerfect2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        kindelPastPerfect3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        kindelPastPerfect1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        kindelPastPerfect2pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        kindelPastPerfect3pl: Yup.string().nullable()
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
    const [infinitiveMa, setInfinitiveMa] = useState("")
    const [infinitiveDa, setInfinitiveDa] = useState("")
    // Optional fields: can be filled with autocomplete
    // Kindel - Present
    const [kindelPresent1s, setKindelPresent1s] = useState("")
    const [kindelPresent2s, setKindelPresent2s] = useState("")
    const [kindelPresent3s, setKindelPresent3s] = useState("")
    const [kindelPresent1pl, setKindelPresent1pl] = useState("")
    const [kindelPresent2pl, setKindelPresent2pl] = useState("")
    const [kindelPresent3pl, setKindelPresent3pl] = useState("")
    // Kindel - Simple past
    const [kindelSimplePast1s, setKindelSimplePast1s] = useState("")
    const [kindelSimplePast2s, setKindelSimplePast2s] = useState("")
    const [kindelSimplePast3s, setKindelSimplePast3s] = useState("")
    const [kindelSimplePast1pl, setKindelSimplePast1pl] = useState("")
    const [kindelSimplePast2pl, setKindelSimplePast2pl] = useState("")
    const [kindelSimplePast3pl, setKindelSimplePast3pl] = useState("")
    // Kindel - Past perfect
    const [kindelPastPerfect1s, setKindelPastPerfect1s] = useState("")
    const [kindelPastPerfect2s, setKindelPastPerfect2s] = useState("")
    const [kindelPastPerfect3s, setKindelPastPerfect3s] = useState("")
    const [kindelPastPerfect1pl, setKindelPastPerfect1pl] = useState("")
    const [kindelPastPerfect2pl, setKindelPastPerfect2pl] = useState("")
    const [kindelPastPerfect3pl, setKindelPastPerfect3pl] = useState("")

    useEffect(() => {
        const currentCases: WordItem[] = [
            {
                caseName: VerbCases.regularityEE,
                word: regularity
            },
            {
                caseName: VerbCases.infinitiveMaEE,
                word: infinitiveMa.toLowerCase()
            },
            {
                caseName: VerbCases.infinitiveDaEE,
                word: infinitiveDa.toLowerCase()
            },
            // Kindel: Present
            {
                caseName: VerbCases.kindelPresent1sEE,
                word: kindelPresent1s.toLowerCase()
            },
            {
                caseName: VerbCases.kindelPresent2sEE,
                word: kindelPresent2s.toLowerCase()
            },
            {
                caseName: VerbCases.kindelPresent3sEE,
                word: kindelPresent3s.toLowerCase()
            },
            {
                caseName: VerbCases.kindelPresent1plEE,
                word: kindelPresent1pl.toLowerCase()
            },
            {
                caseName: VerbCases.kindelPresent2plEE,
                word: kindelPresent2pl.toLowerCase()
            },
            {
                caseName: VerbCases.kindelPresent3plEE,
                word: kindelPresent3pl.toLowerCase()
            },
            // Kindel: Simple past
            {
                caseName: VerbCases.kindelSimplePast1sEE,
                word: kindelSimplePast1s.toLowerCase()
            },
            {
                caseName: VerbCases.kindelSimplePast2sEE,
                word: kindelSimplePast2s.toLowerCase()
            },
            {
                caseName: VerbCases.kindelSimplePast3sEE,
                word: kindelSimplePast3s.toLowerCase()
            },
            {
                caseName: VerbCases.kindelSimplePast1plEE,
                word: kindelSimplePast1pl.toLowerCase()
            },
            {
                caseName: VerbCases.kindelSimplePast2plEE,
                word: kindelSimplePast2pl.toLowerCase()
            },
            {
                caseName: VerbCases.kindelSimplePast3plEE,
                word: kindelSimplePast3pl.toLowerCase()
            },
            // Kindel: Past perfect
            {
                caseName: VerbCases.kindelPastPerfect1sEE,
                word: kindelPastPerfect1s.toLowerCase()
            },
            {
                caseName: VerbCases.kindelPastPerfect2sEE,
                word: kindelPastPerfect2s.toLowerCase()
            },
            {
                caseName: VerbCases.kindelPastPerfect3sEE,
                word: kindelPastPerfect3s.toLowerCase()
            },
            {
                caseName: VerbCases.kindelPastPerfect1plEE,
                word: kindelPastPerfect1pl.toLowerCase()
            },
            {
                caseName: VerbCases.kindelPastPerfect2plEE,
                word: kindelPastPerfect2pl.toLowerCase()
            },
            {
                caseName: VerbCases.kindelPastPerfect3plEE,
                word: kindelPastPerfect3pl.toLowerCase()
            },
        ]
        props.updateFormData({
            language: Lang.EE,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [
        regularity, infinitiveMa, infinitiveDa,
        kindelPresent1s, kindelPresent2s, kindelPresent3s, kindelPresent1pl, kindelPresent2pl, kindelPresent3pl,
        kindelSimplePast1s, kindelSimplePast2s, kindelSimplePast3s, kindelSimplePast1pl, kindelSimplePast2pl, kindelSimplePast3pl,
        kindelPastPerfect1s, kindelPastPerfect2s, kindelPastPerfect3s, kindelPastPerfect1pl, kindelPastPerfect2pl, kindelPastPerfect3pl,
        isValid
    ])

    const setValuesInForm = (translationDataToInsert: TranslationItem) => {
        const regularityValue: string = getWordByCase(VerbCases.regularityEE, translationDataToInsert)
        const infinitiveMaValue: string = getWordByCase(VerbCases.infinitiveMaEE, translationDataToInsert)
        const infinitiveDaValue: string = getWordByCase(VerbCases.infinitiveDaEE, translationDataToInsert)
        // Kindel: Present
        const kindelPresent1sValue: string = getWordByCase(VerbCases.kindelPresent1sEE, translationDataToInsert)
        const kindelPresent2sValue: string = getWordByCase(VerbCases.kindelPresent2sEE, translationDataToInsert)
        const kindelPresent3sValue: string = getWordByCase(VerbCases.kindelPresent3sEE, translationDataToInsert)
        const kindelPresent1plValue: string = getWordByCase(VerbCases.kindelPresent1plEE, translationDataToInsert)
        const kindelPresent2plValue: string = getWordByCase(VerbCases.kindelPresent2plEE, translationDataToInsert)
        const kindelPresent3plValue: string = getWordByCase(VerbCases.kindelPresent3plEE, translationDataToInsert)
        // Kindel: Simple past
        const kindelSimplePast1sValue: string = getWordByCase(VerbCases.kindelSimplePast1sEE, translationDataToInsert)
        const kindelSimplePast2sValue: string = getWordByCase(VerbCases.kindelSimplePast2sEE, translationDataToInsert)
        const kindelSimplePast3sValue: string = getWordByCase(VerbCases.kindelSimplePast3sEE, translationDataToInsert)
        const kindelSimplePast1plValue: string = getWordByCase(VerbCases.kindelSimplePast1plEE, translationDataToInsert)
        const kindelSimplePast2plValue: string = getWordByCase(VerbCases.kindelSimplePast2plEE, translationDataToInsert)
        const kindelSimplePast3plValue: string = getWordByCase(VerbCases.kindelSimplePast3plEE, translationDataToInsert)
        // Kindel: Past perfect
        const kindelPastPerfect1sValue: string = getWordByCase(VerbCases.kindelPastPerfect1sEE, translationDataToInsert)
        const kindelPastPerfect2sValue: string = getWordByCase(VerbCases.kindelPastPerfect2sEE, translationDataToInsert)
        const kindelPastPerfect3sValue: string = getWordByCase(VerbCases.kindelPastPerfect3sEE, translationDataToInsert)
        const kindelPastPerfect1plValue: string = getWordByCase(VerbCases.kindelPastPerfect1plEE, translationDataToInsert)
        const kindelPastPerfect2plValue: string = getWordByCase(VerbCases.kindelPastPerfect2plEE, translationDataToInsert)
        const kindelPastPerfect3plValue: string = getWordByCase(VerbCases.kindelPastPerfect3plEE, translationDataToInsert)

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
            'infinitiveMa',
            infinitiveMaValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setInfinitiveMa(infinitiveMaValue)
        setValue(
            'infinitiveDa',
            infinitiveDaValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setInfinitiveDa(infinitiveDaValue)
        // Kindel: Present
        setValue(
            'kindelPresent1s',
            kindelPresent1sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPresent1s(kindelPresent1sValue)
        setValue(
            'kindelPresent2s',
            kindelPresent2sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPresent2s(kindelPresent2sValue)
        setValue(
            'kindelPresent3s',
            kindelPresent3sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPresent3s(kindelPresent3sValue)
        setValue(
            'kindelPresent1pl',
            kindelPresent1plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPresent1pl(kindelPresent1plValue)
        setValue(
            'kindelPresent2pl',
            kindelPresent2plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPresent2pl(kindelPresent2plValue)
        setValue(
            'kindelPresent3pl',
            kindelPresent3plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPresent3pl(kindelPresent3plValue)
        // Kindel: Simple past
        setValue(
            'kindelSimplePast1s',
            kindelSimplePast1sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelSimplePast1s(kindelSimplePast1sValue)
        setValue(
            'kindelSimplePast2s',
            kindelSimplePast2sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelSimplePast2s(kindelSimplePast2sValue)
        setValue(
            'kindelSimplePast3s',
            kindelSimplePast3sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelSimplePast3s(kindelSimplePast3sValue)
        setValue(
            'kindelSimplePast1pl',
            kindelSimplePast1plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelSimplePast1pl(kindelSimplePast1plValue)
        setValue(
            'kindelSimplePast2pl',
            kindelSimplePast2plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelSimplePast2pl(kindelSimplePast2plValue)
        setValue(
            'kindelSimplePast3pl',
            kindelSimplePast3plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelSimplePast3pl(kindelSimplePast3plValue)
        // Kindel: Past perfect
        setValue(
            'kindelPastPerfect1s',
            kindelPastPerfect1sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPastPerfect1s(kindelPastPerfect1sValue)
        setValue(
            'kindelPastPerfect2s',
            kindelPastPerfect2sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPastPerfect2s(kindelPastPerfect2sValue)
        setValue(
            'kindelPastPerfect3s',
            kindelPastPerfect3sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPastPerfect3s(kindelPastPerfect3sValue)
        setValue(
            'kindelPastPerfect1pl',
            kindelPastPerfect1plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPastPerfect1pl(kindelPastPerfect1plValue)
        setValue(
            'kindelPastPerfect2pl',
            kindelPastPerfect2plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPastPerfect2pl(kindelPastPerfect2plValue)
        setValue(
            'kindelPastPerfect3pl',
            kindelPastPerfect3plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPastPerfect3pl(kindelPastPerfect3plValue)
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
            ...autocompletedTranslationVerbEE,
            // NB! These fields are not included in BE autocomplete response, so we must manually include them
            cases: [
                ...autocompletedTranslationVerbEE.cases,
                {
                    caseName: VerbCases.regularityEE,
                    word: regularity
                },
            ]
        }
        setValuesInForm(completeFormWithAutocomplete)
        setSearchInEnglish(false)
    }

    const validAutocompleteRequest = errors['infinitiveMa'] === undefined
    useEffect(() => {
        if((infinitiveMa !== "") && (validAutocompleteRequest)){
            setTimerTriggerFunction(
                () => {
                    dispatch(getAutocompletedEstonianVerbData({
                        query: infinitiveMa,
                        searchInEnglish: searchInEnglish
                    }))
                },
                600
            )
        }
    },[infinitiveMa, validAutocompleteRequest])

    // if search query is the same as the stored response => hide loading bar
    const hideAutocompleteLoadingState = (
        (infinitiveMa?.toLowerCase()) ===
        (
            autocompletedTranslationVerbEE?.cases?.find((potentialCase: WordItem) => {
                return(potentialCase.caseName === VerbCases.infinitiveMaEE)
            })
        )?.word?.toLowerCase()
    )

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
                                    emptyQuery: t('wordForm.autocompleteTranslationButton.emptyQuery', { ns: 'wordRelated', requiredField: "-ma infinitive" }),
                                    noMatch: t('wordForm.autocompleteTranslationButton.noMatch', { ns: 'wordRelated' }),
                                    foundMatch: t('wordForm.autocompleteTranslationButton.foundMatch', { ns: 'wordRelated' }),
                                }}
                                actionButtonLabel={t('wordForm.autocompleteTranslationButton.label', { ns: 'wordRelated', wordType: "" })}
                                queryValue={infinitiveMa}
                                autocompleteResponse={autocompletedTranslationVerbEE}
                                loadingState={isLoadingAT && !hideAutocompleteLoadingState}
                                forceDisabled={!validAutocompleteRequest}
                                onAutocompleteClick={() => onAutocompleteClick()}
                                sxProps={{
                                    marginRight: globalTheme.spacing(2)
                                }}
                            />
                            <FormControlLabel
                                value="end"
                                control={
                                    <Tooltip
                                        title={t('wordForm.verb.errors.formEE.searchInEnglishWarning', { ns: 'wordRelated' })}
                                    >
                                        <Checkbox
                                            checked={searchInEnglish}
                                            onChange={(event: React.ChangeEvent) => {
                                                //@ts-ignore
                                                setSearchInEnglish(event.target.checked)
                                            }}
                                        />
                                    </Tooltip>
                                }
                                label={t('wordForm.verb.errors.formEE.searchInEnglishLabel', { ns: 'wordRelated' })}
                                labelPlacement="end"
                            />
                            <Grid
                                item={true}
                                xs
                                sx={{
                                    maxHeight: 'max-content'
                                }}
                            >
                                {(isLoadingAT && !hideAutocompleteLoadingState) && <LinearIndeterminate/>}
                            </Grid>
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, infinitiveMa)) &&
                        <Grid
                            item={true}
                            xs={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"-ma infinitive"}
                                name={"infinitiveMa"}
                                defaultValue={""}
                                errors={errors.infinitiveMa}
                                onChange={(value: any) => {
                                    setInfinitiveMa(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, infinitiveDa)) &&
                        <Grid
                            item={true}
                            xs={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"-da infinitive"}
                                name={"infinitiveDa"}
                                defaultValue={""}
                                errors={errors.infinitiveDa}
                                onChange={(value: any) => {
                                    setInfinitiveDa(value)
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
                            alignItems={'flex-start'}
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
                    {
                        (
                            kindelPresent1s!! || kindelPresent2s!! || kindelPresent3s!! ||
                            kindelPresent1pl!! || kindelPresent2pl!! || kindelPresent3pl!! ||
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
                                    Kindel:
                                </Typography>
                            </Grid>
                        </Grid>
                    }
                    {
                        (
                            kindelPresent1s!! || kindelPresent2s!! || kindelPresent3s!! ||
                            kindelPresent1pl!! || kindelPresent2pl!! || kindelPresent3pl!! ||
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
                                    Present:
                                </Typography>
                            </Grid>
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPresent1s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Mina'}
                                        name={"kindelPresent1s"}
                                        defaultValue={""}
                                        errors={errors.kindelPresent1s}
                                        onChange={(value: any) => {
                                            setKindelPresent1s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPresent2s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Sina'}
                                        name={"kindelPresent2s"}
                                        defaultValue={""}
                                        errors={errors.kindelPresent2s}
                                        onChange={(value: any) => {
                                            setKindelPresent2s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPresent3s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Tema'}
                                        name={"kindelPresent3s"}
                                        defaultValue={""}
                                        errors={errors.kindelPresent3s}
                                        onChange={(value: any) => {
                                            setKindelPresent3s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPresent1pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Meie'}
                                        name={"kindelPresent1pl"}
                                        defaultValue={""}
                                        errors={errors.kindelPresent1pl}
                                        onChange={(value: any) => {
                                            setKindelPresent1pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPresent2pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Teie'}
                                        name={"kindelPresent2pl"}
                                        defaultValue={""}
                                        errors={errors.kindelPresent2pl}
                                        onChange={(value: any) => {
                                            setKindelPresent2pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPresent3pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Nad'}
                                        name={"kindelPresent3pl"}
                                        defaultValue={""}
                                        errors={errors.kindelPresent3pl}
                                        onChange={(value: any) => {
                                            setKindelPresent3pl(value)
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
                            kindelSimplePast1s!! || kindelSimplePast2s!! || kindelSimplePast3s!! ||
                            kindelSimplePast1pl!! || kindelSimplePast2pl!! || kindelSimplePast3pl!! ||
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
                                    Simple past:
                                </Typography>
                            </Grid>
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelSimplePast1s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Mina'}
                                        name={"kindelSimplePast1s"}
                                        defaultValue={""}
                                        errors={errors.kindelPresent1s}
                                        onChange={(value: any) => {
                                            setKindelSimplePast1s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelSimplePast2s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Sina'}
                                        name={"kindelSimplePast2s"}
                                        defaultValue={""}
                                        errors={errors.kindelPresent2s}
                                        onChange={(value: any) => {
                                            setKindelSimplePast2s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelSimplePast3s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Tema'}
                                        name={"kindelSimplePast3s"}
                                        defaultValue={""}
                                        errors={errors.kindelPresent3s}
                                        onChange={(value: any) => {
                                            setKindelSimplePast3s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelSimplePast1pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Meie'}
                                        name={"kindelSimplePast1pl"}
                                        defaultValue={""}
                                        errors={errors.kindelPresent1pl}
                                        onChange={(value: any) => {
                                            setKindelSimplePast1pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelSimplePast2pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Teie'}
                                        name={"kindelSimplePast2pl"}
                                        defaultValue={""}
                                        errors={errors.kindelPresent2pl}
                                        onChange={(value: any) => {
                                            setKindelSimplePast2pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelSimplePast3pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Nad'}
                                        name={"kindelSimplePast3pl"}
                                        defaultValue={""}
                                        errors={errors.kindelPresent3pl}
                                        onChange={(value: any) => {
                                            setKindelSimplePast3pl(value)
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
                            kindelPastPerfect1s!! || kindelPastPerfect2s!! || kindelPastPerfect3s!! ||
                            kindelPastPerfect1pl!! || kindelPastPerfect2pl!! || kindelPastPerfect3pl!! ||
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
                                    Past perfect:
                                </Typography>
                            </Grid>
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPastPerfect1s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Mina'}
                                        name={"kindelPastPerfect1s"}
                                        defaultValue={""}
                                        errors={errors.kindelPastPerfect1s}
                                        onChange={(value: any) => {
                                            setKindelPastPerfect1s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment: <InputAdornment position="start">Ma olen</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPastPerfect2s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Sina'}
                                        name={"kindelPastPerfect2s"}
                                        defaultValue={""}
                                        errors={errors.kindelPastPerfect2s}
                                        onChange={(value: any) => {
                                            setKindelPastPerfect2s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment: <InputAdornment position="start">Sa oled</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPastPerfect3s)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Tema'}
                                        name={"kindelPastPerfect3s"}
                                        defaultValue={""}
                                        errors={errors.kindelPastPerfect3s}
                                        onChange={(value: any) => {
                                            setKindelPastPerfect3s(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment: <InputAdornment position="start">Ta on</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPastPerfect1pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Meie'}
                                        name={"kindelPastPerfect1pl"}
                                        defaultValue={""}
                                        errors={errors.kindelPastPerfect1pl}
                                        onChange={(value: any) => {
                                            setKindelPastPerfect1pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment: <InputAdornment position="start">Me oleme</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPastPerfect2pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Teie'}
                                        name={"kindelPastPerfect2pl"}
                                        defaultValue={""}
                                        errors={errors.kindelPastPerfect2pl}
                                        onChange={(value: any) => {
                                            setKindelPastPerfect2pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment: <InputAdornment position="start">Te olete</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            }
                            {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPastPerfect3pl)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <TextInputFormWithHook
                                        control={control}
                                        label={'Nad'}
                                        name={"kindelPastPerfect3pl"}
                                        defaultValue={""}
                                        errors={errors.kindelPastPerfect3pl}
                                        onChange={(value: any) => {
                                            setKindelPastPerfect3pl(value)
                                        }}
                                        fullWidth={true}
                                        disabled={props.displayOnly}
                                        inputProps={{
                                            startAdornment: <InputAdornment position="start">Nad olevad</InputAdornment>,
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