import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {WordItem, TranslationItem} from "../../../ts/interfaces";
import {GenderDE, GenderES, Lang, NounCases, VerbCases, VerbRegularity} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";
import {RadioGroupWithHook} from "../../RadioGroupFormHook";
import {AutocompleteButtonWithStatus} from "../AutocompleteButtonWithStatus";
import LinearIndeterminate from "../../Spinner";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../../app/store";
import {setTimerTriggerFunction} from "../../generalUseFunctions";
import {getAutocompletedSpanishNounGender} from "../../../features/autocompletedTranslation/autocompletedTranslationSlice";
import {useTranslation} from "react-i18next";

interface NounFormESProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the spanish translation of a noun (and handles the validations)
export function NounFormES(props: NounFormESProps) {
    const { t } = useTranslation(['common', 'wordRelated'])
    const dispatch = useDispatch<AppDispatch>()
    const {autocompletedTranslationNounES, isErrorAT, isSuccessAT, isLoadingAT, messageAT} = useSelector((state: any) => state.autocompletedTranslations)
    const translatedGenderLabel = t('linguisticFeature.gender', {ns: 'common'})

    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        //  Properties
        regularity: Yup.string()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' }))
            .matches(/^(regular|irregular)?$/, t('wordForm.verb.errors.formEN.regularityRequired', { ns: 'wordRelated' })),
        gender: Yup.string()
            .required(t('wordForm.noun.errors.formES.genderRequired', { ns: 'wordRelated' }))
            .oneOf(["el", "la", "el/la"], t('wordForm.noun.errors.formES.genderRequired', { ns: 'wordRelated' })),
        singular: Yup.string()
            .required(t('wordForm.noun.errors.formES.singularFormRequired', { ns: 'wordRelated' }))
            .matches(/^[^0-9]+$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        plural: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' }))
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [regularity, setRegularity] = useState<"regular"|"irregular"|"">("")
    const [singularWord, setSingularWord] = useState("")
    const [pluralWord, setPluralWord] = useState("")
    const [genderWord, setGenderWord] = useState<"el"|"la"|"el/la"|"">("")

    useEffect(() => {
        const currentCases: WordItem[] = [
            {
                caseName: NounCases.regularityES,
                word: regularity
            },
            {
                caseName: NounCases.singularES,
                word: singularWord.toLowerCase()
            },
            {
                caseName: NounCases.pluralES,
                word: pluralWord.toLowerCase()
            },
            {
                caseName: NounCases.genderES,
                word: genderWord
            }
        ]
        props.updateFormData({
            language: Lang.ES,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [regularity, singularWord, pluralWord, genderWord, isValid])


    const setValuesInForm = (translationDataToInsert: TranslationItem) => {
        const regularityValue: string = getWordByCase(NounCases.regularityES, translationDataToInsert)
        const singularValue: string = getWordByCase(NounCases.singularES, translationDataToInsert)
        const pluralValue: string = getWordByCase(NounCases.pluralES, translationDataToInsert)
        const genderValue: string = getWordByCase(NounCases.genderES, translationDataToInsert)
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
            'singular',
            singularValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSingularWord(singularValue)
        setValue(
            'plural',
            pluralValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setPluralWord(pluralValue)
        setValue(
            'gender',
            genderValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setGenderWord(genderValue as "el"|"la"|"")
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
            ...autocompletedTranslationNounES,
            // NB! These fields are not included in BE autocomplete response, so we must manually include
            cases: [
                ...autocompletedTranslationNounES.cases, // only autocompletes gender
                {
                    caseName: NounCases.singularES,
                    word: singularWord
                },
                {
                    caseName: NounCases.pluralES,
                    word: pluralWord
                },
                {
                    caseName: VerbCases.regularityES,
                    word: regularity
                },
            ]
        }
        setValuesInForm(completeFormWithAutocomplete)
    }

    useEffect(() => {
        if(singularWord !== ""){
            setTimerTriggerFunction(
                () => {
                    dispatch(getAutocompletedSpanishNounGender(singularWord))
                },
                600
            )
        }
    },[singularWord])

    // if search query is the same as the stored response => hide loading bar
    const hideAutocompleteLoadingState = (
        (singularWord?.toLowerCase()) ===
        (
            autocompletedTranslationNounES?.cases?.find((potentialCase: WordItem) => {
                return(potentialCase.caseName === NounCases.singularES)
            })
        )?.word?.toLowerCase()
    )

    return(
        <Grid
            container={true}
            justifyContent={"center"}
        >
            <form
                style={{
                    width: '100%'
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
                                    emptyQuery: t('wordForm.autocompleteTranslationButton.emptyQuery', { ns: 'wordRelated', requiredField: "Singular palabra" }),
                                    noMatch: t('wordForm.autocompleteTranslationButton.noMatch', { ns: 'wordRelated' }),
                                    foundMatch: t('wordForm.autocompleteTranslationButton.foundMatch', { ns: 'wordRelated' }),
                                    partialMatch: (isSuccessAT && messageAT !== "") ?messageAT :undefined
                                }}
                                queryValue={singularWord}
                                autocompleteResponse={autocompletedTranslationNounES}
                                loadingState={isLoadingAT && !hideAutocompleteLoadingState}
                                onAutocompleteClick={() => onAutocompleteClick()}
                                actionButtonLabel={t('wordForm.autocompleteTranslationButton.label', { ns: 'wordRelated', wordType: translatedGenderLabel })}
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
                        item={true}
                        xs={12}
                        spacing={2}
                    >
                        <Grid
                            container={true}
                            justifyContent={'flex-start'}
                            item={true}
                            xs={'auto'}
                        >
                            <Grid
                                item={true}
                                xs={true}
                            >
                                <RadioGroupWithHook
                                    control={control}
                                    label={"Gender"}
                                    name={"gender"}
                                    options={[GenderES.M, GenderES.F, GenderES.N]}
                                    defaultValue={""}
                                    errors={errors.gender}
                                    onChange={(value: any) => {
                                        setGenderWord(value)
                                    }}
                                    fullWidth={true}
                                    disabled={props.displayOnly}
                                />
                            </Grid>
                        </Grid>
                        {(getDisabledInputFieldDisplayLogic(props.displayOnly!, regularity)) &&
                            <Grid
                                container={true}
                                justifyContent={'flex-start'}
                                item={true}
                                xs={'auto'}
                            >
                                <Grid
                                    item={true}
                                    xs={true}
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
                    </Grid>
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, singularWord)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Singular palabra"}
                                name={"singular"}
                                defaultValue={""}
                                errors={errors.singular}
                                onChange={(value: any) => {
                                    setSingularWord(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, pluralWord)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Plural palabra"}
                                name={"plural"}
                                defaultValue={""}
                                errors={errors.plural}
                                onChange={(value: any) => {
                                    setPluralWord(value)
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