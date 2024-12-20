import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {WordItem, TranslationItem} from "../../../ts/interfaces";
import {GenderDE, Lang, NounCases, VerbCases, VerbRegularity} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";
import {RadioGroupWithHook} from "../../RadioGroupFormHook";
import {AutocompleteButtonWithStatus} from "../AutocompleteButtonWithStatus";
import LinearIndeterminate from "../../Spinner";
import {useDispatch, useSelector} from "react-redux";
import {setTimerTriggerFunction} from "../../generalUseFunctions";
import {
    getAutocompletedGermanNounData
} from "../../../features/autocompletedTranslation/autocompletedTranslationSlice";
import {AppDispatch} from "../../../app/store";
import {useTranslation} from "react-i18next";

interface NounFormDEProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the german translation of a noun (and handles the validations)
export function NounFormDE(props: NounFormDEProps) {
    const { t } = useTranslation(['wordRelated'])
    const dispatch = useDispatch<AppDispatch>()
    const {autocompletedTranslationNounDE, isErrorAT, isSuccessAT, isLoadingAT, messageAT} = useSelector((state: any) => state.autocompletedTranslations)

    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        //  Properties
        regularity: Yup.string()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' }))
            .matches(/^(regular|irregular)?$/, t('wordForm.verb.errors.formEN.regularityRequired', { ns: 'wordRelated' })),
        gender: Yup.string().required(t('wordForm.noun.errors.formDE.genderRequired', { ns: 'wordRelated' }))
            .oneOf(
                [GenderDE.M as string, GenderDE.F as string, GenderDE.N as string],
                t('wordForm.noun.errors.formDE.genderRequired', { ns: 'wordRelated' })
            ),
        singularNominativ: Yup.string()
            .required(t('wordForm.noun.errors.formDE.singularFormRequired', { ns: 'wordRelated' }))
            .matches(/^[^0-9]+$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        pluralNominativ: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        singularAkkusativ: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        pluralAkkusativ: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        singularGenitiv: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        pluralGenitiv: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        singularDativ: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        pluralDativ: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [regularity, setRegularity] = useState<"regular"|"irregular"|"">("")
    const [genderWord, setGenderWord] = useState<"der"|"die"|"das"|"">("")

    const [singularNominativ, setSingularNominativ] = useState("")
    const [singularAkkusativ, setSingularAkkusativ] = useState("")
    const [singularGenitiv, setSingularGenitiv] = useState("")
    const [singularDativ, setSingularDativ] = useState("")

    const [pluralNominativ, setPluralNominativ] = useState("")
    const [pluralAkkusativ, setPluralAkkusativ] = useState("")
    const [pluralGenitiv, setPluralGenitiv] = useState("")
    const [pluralDativ, setPluralDativ] = useState("")

    // if search query is the same as the stored response => hide loading bar
    const hideAutocompleteLoadingState = (
        (singularNominativ?.toLowerCase()) ===
        (
            autocompletedTranslationNounDE?.cases?.find((potentialCase: WordItem) => {
                return(potentialCase.caseName === NounCases.singularNominativDE)
            })
        )?.word?.toLowerCase()
    )

    useEffect(() => {
        const currentCases: WordItem[] = [
            {
                caseName: NounCases.regularityDE,
                word: regularity
            },
            {
                caseName: NounCases.genderDE,
                word: genderWord
            },
            {
                caseName: NounCases.singularNominativDE,
                word: singularNominativ
            },
            {
                caseName: NounCases.pluralNominativDE,
                word: pluralNominativ
            },
            {
                caseName: NounCases.singularAkkusativDE,
                word: singularAkkusativ
            },
            {
                caseName: NounCases.pluralAkkusativDE,
                word: pluralAkkusativ
            },
            {
                caseName: NounCases.singularGenitivDE,
                word: singularGenitiv
            },
            {
                caseName: NounCases.pluralGenitivDE,
                word: pluralGenitiv
            },
            {
                caseName: NounCases.singularDativDE,
                word: singularDativ
            },
            {
                caseName: NounCases.pluralDativDE,
                word: pluralDativ
            }
        ]
        props.updateFormData({
            language: Lang.DE,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [
        regularity, genderWord, singularNominativ, pluralNominativ, singularAkkusativ, pluralAkkusativ, singularGenitiv,
        pluralGenitiv, singularDativ, pluralDativ, isValid
    ])

    const setValuesInForm = (translationDataToInsert: TranslationItem) => {
        const regularityValue: string = getWordByCase(NounCases.regularityDE, translationDataToInsert)
        const genderValue: string = getWordByCase(NounCases.genderDE, translationDataToInsert)
        const singularNominativValue: string = getWordByCase(NounCases.singularNominativDE, translationDataToInsert)
        const pluralNominativValue: string = getWordByCase(NounCases.pluralNominativDE, translationDataToInsert)
        const singularAkkusativValue: string = getWordByCase(NounCases.singularAkkusativDE, translationDataToInsert)
        const pluralAkkusativValue: string = getWordByCase(NounCases.pluralAkkusativDE, translationDataToInsert)
        const singularGenitivValue: string = getWordByCase(NounCases.singularGenitivDE, translationDataToInsert)
        const pluralGenitivValue: string = getWordByCase(NounCases.pluralGenitivDE, translationDataToInsert)
        const singularDativValue: string = getWordByCase(NounCases.singularDativDE, translationDataToInsert)
        const pluralDativValue: string = getWordByCase(NounCases.pluralDativDE, translationDataToInsert)
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
            'gender',
            genderValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setGenderWord(genderValue as "der"|"die"|"das"|"")
        setValue(
            'singularNominativ',
            singularNominativValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSingularNominativ(singularNominativValue)
        setValue(
            'pluralNominativ',
            pluralNominativValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setPluralNominativ(pluralNominativValue)
        setValue(
            'singularAkkusativ',
            singularAkkusativValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSingularAkkusativ(singularAkkusativValue)
        setValue(
            'pluralAkkusativ',
            pluralAkkusativValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setPluralAkkusativ(pluralAkkusativValue)
        setValue(
            'singularGenitiv',
            singularGenitivValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSingularGenitiv(singularGenitivValue)
        setValue(
            'pluralGenitiv',
            pluralGenitivValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setPluralGenitiv(pluralGenitivValue)
        setValue(
            'singularDativ',
            singularDativValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSingularDativ(singularDativValue)
        setValue(
            'pluralDativ',
            pluralDativValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setPluralDativ(pluralDativValue)
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
            ...autocompletedTranslationNounDE,
            // NB! These fields are not included in BE autocomplete response, so we must manually include
            cases: [
                ...autocompletedTranslationNounDE.cases,
                {
                    caseName: VerbCases.regularityDE,
                    word: regularity
                },
            ]
        }
        setValuesInForm(completeFormWithAutocomplete)
    }

    useEffect(() => {
        if(singularNominativ !== ""){
            setTimerTriggerFunction(
                () => {
                    dispatch(getAutocompletedGermanNounData(singularNominativ))
                },
                600
            )
        }
    },[singularNominativ])


    return(
        <Grid
            container={true}
            justifyContent={"center"}
        >
            <form
                style={{
                    width: '100%',
                }}
            >
                <Grid
                    item={true}
                    container={true}
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
                                    emptyQuery: t('wordForm.autocompleteTranslationButton.emptyQuery', { ns: 'wordRelated', requiredField: "Singular nominativ" }),
                                    noMatch: t('wordForm.autocompleteTranslationButton.noMatch', { ns: 'wordRelated' }),
                                    foundMatch: t('wordForm.autocompleteTranslationButton.foundMatch', { ns: 'wordRelated' }),
                                }}
                                queryValue={singularNominativ}
                                autocompleteResponse={autocompletedTranslationNounDE}
                                loadingState={isLoadingAT && !hideAutocompleteLoadingState}
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
                                {(isLoadingAT && !hideAutocompleteLoadingState) && <LinearIndeterminate/>}
                            </Grid>
                        </Grid>
                    }
                    <Grid
                        container={true}
                        spacing={2}
                        item={true}
                        xs={12}
                    >
                        <Grid
                            item={true}
                            xs={'auto'}
                        >
                            <RadioGroupWithHook
                                control={control}
                                label={"Gender"}
                                name={"gender"}
                                options={[GenderDE.M, GenderDE.F, GenderDE.N]}
                                defaultValue={""}
                                errors={errors.gender}
                                onChange={(value: any) => {
                                    setGenderWord(value)
                                }}
                                fullWidth={false}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                        {(getDisabledInputFieldDisplayLogic(props.displayOnly!, regularity)) &&
                            <Grid
                                item={true}
                                xs={'auto'}
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
                        }
                    </Grid>
                    <Grid
                        item={true}
                        xs={6}
                    >
                        <TextInputFormWithHook
                            control={control}
                            label={"Singular nominativ"}
                            name={"singularNominativ"}
                            defaultValue={""}
                            errors={errors.singularNominativ}
                            onChange={(value: any) => {
                                setSingularNominativ(value)
                            }}
                            fullWidth={true}
                            disabled={props.displayOnly}
                        />
                    </Grid>
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, pluralNominativ)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Plural nominativ"}
                                name={"pluralNominativ"}
                                defaultValue={""}
                                errors={errors.pluralNominativ}
                                onChange={(value: any) => {
                                    setPluralNominativ(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, singularAkkusativ)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Singular akkusativ"}
                                name={"singularAkkusativ"}
                                defaultValue={""}
                                errors={errors.singularAkkusativ}
                                onChange={(value: any) => {
                                    setSingularAkkusativ(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, pluralAkkusativ)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Plural akkusativ"}
                                name={"pluralAkkusativ"}
                                defaultValue={""}
                                errors={errors.pluralAkkusativ}
                                onChange={(value: any) => {
                                    setPluralAkkusativ(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, singularGenitiv)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Singular genitiv"}
                                name={"singularGenitiv"}
                                defaultValue={""}
                                errors={errors.singularGenitiv}
                                onChange={(value: any) => {
                                    setSingularGenitiv(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, pluralGenitiv)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Plural genitiv"}
                                name={"pluralGenitiv"}
                                defaultValue={""}
                                errors={errors.pluralGenitiv}
                                onChange={(value: any) => {
                                    setPluralGenitiv(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, singularDativ)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Singular dativ"}
                                name={"singularDativ"}
                                defaultValue={""}
                                errors={errors.singularDativ}
                                onChange={(value: any) => {
                                    setSingularDativ(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, pluralDativ)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Plural dativ"}
                                name={"pluralDativ"}
                                defaultValue={""}
                                errors={errors.pluralDativ}
                                onChange={(value: any) => {
                                    setPluralDativ(value)
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