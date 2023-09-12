import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {WordItem, TranslationItem} from "../../../ts/interfaces";
import {AdjectiveCases, Lang} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";

interface AdjectiveFormEEProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the estonian translation of a noun (and handles the validations)
export function AdjectiveFormEE(props: AdjectiveFormEEProps) {

    const {currentTranslationData} = props

    // Algvõrre (ordinary) grade, as in väike 'small'
    // Keskvõrre (higher) grade, as in väiksem 'smaller' => always {genitive}-m (if no vowel at the end of genitive => -a
    // Ülivõrre (highest) grade, as in väikseim 'smallest' =>
    const validationSchema = Yup.object().shape({
        algvorre: Yup.string()
            .required("Algvõrre form is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        keskvorre: Yup.string().nullable()
            .required("Keskvõrre form is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        // NB! Usually, same as "kõige"+keskvõrre, but there are irregular adjectives as:
        // ilus (ilusaim), uus (uusim), õnnelik (õnnelikem)
        ulivorre: Yup.string().nullable()
            .required("Ülivõrre form is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        // singularNimetav: Yup .string() // SAME AS ALGVÕRRE
        //     .required("Singular nimetav is required")
        //     .matches(/^[^0-9]+$/, 'Must not include numbers'),
        pluralNimetav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        singularOmastav: Yup.string().nullable() // base for all remaining cases
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        pluralOmastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        singularOsastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        pluralOsastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
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
    } = useForm<AdjectiveData>({
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
                word: adjective.algvorre
            },
            {
                caseName: AdjectiveCases.keskvorreEE,
                word: adjective.keskvorre
            },
            {
                caseName: AdjectiveCases.ulivorreEE,
                word: adjective.ulivorre
            },
            {
                caseName: AdjectiveCases.pluralNimetavEE,
                word: adjective.pluralNimetav
            },
            {
                caseName: AdjectiveCases.singularOmastavEE,
                word: adjective.singularOmastav
            },
            {
                caseName: AdjectiveCases.pluralOmastavEE,
                word: adjective.pluralOmastav
            },
            {
                caseName: AdjectiveCases.singularOsastavEE,
                word: adjective.singularOsastav
            },
            {
                caseName: AdjectiveCases.pluralOsastavEE,
                word: adjective.pluralOsastav
            }
        ]
        props.updateFormData({
            language: Lang.EE,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [adjective, isValid])

    // This will only be run on first render
    // we use it to populate the form fields with the previously added information
    useEffect(() => {
        if (currentTranslationData.cases!) {
            const algvorreValue: string = getWordByCase(AdjectiveCases.algvorreEE, currentTranslationData)
            const keskvorreValue: string = getWordByCase(AdjectiveCases.keskvorreEE, currentTranslationData)
            const ulivorreValue: string = getWordByCase(AdjectiveCases.ulivorreEE, currentTranslationData)
            const pluralNimetavValue: string = getWordByCase(AdjectiveCases.pluralNimetavEE, currentTranslationData)
            const singularOmastavValue: string = getWordByCase(AdjectiveCases.singularOmastavEE, currentTranslationData)
            const pluralOmastavValue: string = getWordByCase(AdjectiveCases.pluralOmastavEE, currentTranslationData)
            const singularOsastavValue: string = getWordByCase(AdjectiveCases.singularOsastavEE, currentTranslationData)
            const pluralOsastavValue: string = getWordByCase(AdjectiveCases.pluralOsastavEE, currentTranslationData)

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
    }, [])

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
