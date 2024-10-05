import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {WordItem, TranslationItem} from "../../../ts/interfaces";
import {AdjectiveCases, Lang} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";
import {AutocompleteButtonWithStatus} from "../AutocompleteButtonWithStatus";
import LinearIndeterminate from "../../Spinner";
import {useDispatch, useSelector} from "react-redux";
import {setTimerTriggerFunction} from "../../generalUseFunctions";
import {
    getAutocompletedEstonianAdjectiveData
} from "../../../features/autocompletedTranslation/autocompletedTranslationSlice";
import {AppDispatch} from "../../../app/store";
import {useTranslation} from "react-i18next";

interface AdjectiveFormEEProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the estonian translation of a noun (and handles the validations)
export function AdjectiveFormEE(props: AdjectiveFormEEProps) {
    const { t } = useTranslation(['wordRelated'])
    const dispatch = useDispatch<AppDispatch>()
    const {autocompletedTranslationAdjectiveEE, isErrorAT, isSuccessAT, isLoadingAT, messageAT} = useSelector((state: any) => state.autocompletedTranslations)
    const {currentTranslationData} = props

    // Algvõrre (ordinary) grade, as in väike 'small'
    // Keskvõrre (higher) grade, as in väiksem 'smaller' => always {genitive}-m (if no vowel at the end of genitive => -a
    // Ülivõrre (highest) grade, as in väikseim 'smallest' =>
    const validationSchema = Yup.object().shape({
        algvorre: Yup.string()
            .required(t('wordForm.adjective.errors.formEE.algvorreFormRequired', { ns: 'wordRelated' }))
            .matches(/^[^0-9]+$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        keskvorre: Yup.string().nullable()
            .required(t('wordForm.adjective.errors.formEE.keskvorreFormRequired', { ns: 'wordRelated' }))
            .matches(/^[^0-9]+$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        // NB! Usually, same as "kõige"+keskvõrre, but there are irregular adjectives as:
        // ilus (ilusaim), uus (uusim), õnnelik (õnnelikem)
        ulivorre: Yup.string().nullable()
            .required(t('wordForm.adjective.errors.formEE.ulivorreFormRequired', { ns: 'wordRelated' }))
            .matches(/^[^0-9]+$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        // singularNimetav: Yup .string() // SAME AS ALGVÕRRE
        //     .required("Singular nimetav is required")
        //     .matches(/^[^0-9]+$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        pluralNimetav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        singularOmastav: Yup.string().nullable() // base for all remaining cases
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        pluralOmastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        singularOsastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        pluralOsastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
    })

    interface AdjectiveData {
        algvorre: string,
        keskvorre: string,
        ulivorre: string,
        pluralNimetav: string,
        singularOmastav: string,
        pluralOmastav: string,
        singularOsastav: string,
        pluralOsastav: string,
    }

    const {
        control, formState: {errors, isValid, isDirty}, setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [adjective, setAdjective] = useState<AdjectiveData>({
        algvorre: "",
        keskvorre: "",
        ulivorre: "",
        pluralNimetav: "",
        singularOmastav: "",
        pluralOmastav: "",
        singularOsastav: "",
        pluralOsastav: "",
    })
    const updateData = (field: string, value: string) => {
        setAdjective((prev) => {
            return ({
                ...prev,
                [field]: value
            })
        })
    }


    useEffect(() => {
        const currentCases: WordItem[] = [
            {
                caseName: AdjectiveCases.algvorreEE,
                word: adjective.algvorre.toLowerCase()
            },
            {
                caseName: AdjectiveCases.keskvorreEE,
                word: adjective.keskvorre.toLowerCase()
            },
            {
                caseName: AdjectiveCases.ulivorreEE,
                word: adjective.ulivorre.toLowerCase()
            },
            {
                caseName: AdjectiveCases.pluralNimetavEE,
                word: adjective.pluralNimetav.toLowerCase()
            },
            {
                caseName: AdjectiveCases.singularOmastavEE,
                word: adjective.singularOmastav.toLowerCase()
            },
            {
                caseName: AdjectiveCases.pluralOmastavEE,
                word: adjective.pluralOmastav.toLowerCase()
            },
            {
                caseName: AdjectiveCases.singularOsastavEE,
                word: adjective.singularOsastav.toLowerCase()
            },
            {
                caseName: AdjectiveCases.pluralOsastavEE,
                word: adjective.pluralOsastav.toLowerCase()
            }
        ]
        props.updateFormData({
            language: Lang.EE,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [adjective, isValid])

    const setValuesInForm = (translationDataToInsert: TranslationItem) => {
        const algvorreValue: string = getWordByCase(AdjectiveCases.algvorreEE, translationDataToInsert)
        const keskvorreValue: string = getWordByCase(AdjectiveCases.keskvorreEE, translationDataToInsert)
        const ulivorreValue: string = getWordByCase(AdjectiveCases.ulivorreEE, translationDataToInsert)
        const pluralNimetavValue: string = getWordByCase(AdjectiveCases.pluralNimetavEE, translationDataToInsert)
        const singularOmastavValue: string = getWordByCase(AdjectiveCases.singularOmastavEE, translationDataToInsert)
        const pluralOmastavValue: string = getWordByCase(AdjectiveCases.pluralOmastavEE, translationDataToInsert)
        const singularOsastavValue: string = getWordByCase(AdjectiveCases.singularOsastavEE, translationDataToInsert)
        const pluralOsastavValue: string = getWordByCase(AdjectiveCases.pluralOsastavEE, translationDataToInsert)

        setValue(
            'algvorre',
            algvorreValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setValue(
            'keskvorre',
            keskvorreValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setValue(
            'ulivorre',
            ulivorreValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setValue(
            'pluralNimetav',
            pluralNimetavValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setValue(
            'singularOmastav',
            singularOmastavValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setValue(
            'pluralOmastav',
            pluralOmastavValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setValue(
            'singularOsastav',
            singularOsastavValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setValue(
            'pluralOsastav',
            pluralOsastavValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setAdjective({
            algvorre: algvorreValue,
            keskvorre: keskvorreValue,
            ulivorre: ulivorreValue,
            pluralNimetav: pluralNimetavValue,
            singularOmastav: singularOmastavValue,
            pluralOmastav: pluralOmastavValue,
            singularOsastav: singularOsastavValue,
            pluralOsastav: pluralOsastavValue,
        })

    }

    // This will only be run on first render
    // we use it to populate the form fields with the previously added information
    useEffect(() => {
        if (currentTranslationData.cases!) {
            setValuesInForm(currentTranslationData)
        }
    }, [])

    const onAutocompleteClick = async () => {
        setValuesInForm(autocompletedTranslationAdjectiveEE)
    }

    // TODO: should this logic be replaced with a function that triggers alongside onChange for that field?
    // before making the request, we check if the query is correct according to the form's validation
    const validAutocompleteRequest = errors['infinitiveMa'] === undefined
    useEffect(() => {
        if((adjective.algvorre !== "") && (validAutocompleteRequest)){
            setTimerTriggerFunction(
                () => {
                    dispatch(getAutocompletedEstonianAdjectiveData(adjective.algvorre))
                },
                600
            )
        }
    },[adjective.algvorre, validAutocompleteRequest])

    return (
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
                                    emptyQuery: "Please input 'Algvõrre' first.",
                                    noMatch: "Sorry, we don't know this word!",
                                    foundMatch: "There is information about this word stored in our system."
                                }}
                                queryValue={adjective.algvorre}
                                autocompleteResponse={autocompletedTranslationAdjectiveEE}
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
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.algvorre)) &&
                        <Grid
                            item={true}
                            xs={12}
                            md={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Algvõrre"}
                                name={"algvorre"}
                                defaultValue={""}
                                fullWidth={true}
                                errors={errors.algvorre}
                                onChange={(value: string) => {
                                    updateData("algvorre", value)
                                }}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.keskvorre)) &&
                        <Grid
                            item={true}
                            xs={12}
                            md={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Keskvõrre"}
                                name={"keskvorre"}
                                defaultValue={""}
                                fullWidth={true}
                                errors={errors.keskvorre}
                                onChange={(value: string) => {
                                    updateData("keskvorre", value)
                                }}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.ulivorre)) &&
                        <Grid
                            item={true}
                            xs={12}
                            md={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Ülivõrre"}
                                name={"ulivorre"}
                                defaultValue={""}
                                fullWidth={true}
                                errors={errors.ulivorre}
                                onChange={(value: string) => {
                                    updateData("ulivorre", value)
                                }}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.pluralNimetav)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Plural nimetav"}
                                name={"pluralNimetav"}
                                defaultValue={""}
                                errors={errors.pluralNimetav}
                                onChange={(value: string) => {
                                    updateData("pluralNimetav", value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.singularOmastav)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Singular omastav"}
                                name={"singularOmastav"}
                                defaultValue={""}
                                errors={errors.singularOmastav}
                                onChange={(value: string) => {
                                    updateData("singularOmastav", value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.pluralOmastav)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Plural omastav"}
                                name={"pluralOmastav"}
                                defaultValue={""}
                                errors={errors.pluralOmastav}
                                onChange={(value: string) => {
                                    updateData("pluralOmastav", value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.singularOsastav)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Singular osastav"}
                                name={"singularOsastav"}
                                defaultValue={""}
                                errors={errors.singularOsastav}
                                onChange={(value: string) => {
                                    updateData("singularOsastav", value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.pluralOsastav)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Plural osastav"}
                                name={"pluralOsastav"}
                                defaultValue={""}
                                errors={errors.pluralOsastav}
                                onChange={(value: string) => {
                                    updateData("pluralOsastav", value)
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
