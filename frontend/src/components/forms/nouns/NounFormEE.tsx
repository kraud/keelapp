import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {WordItem, TranslationItem} from "../../../ts/interfaces";
import {Lang, NounCases} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";

interface NounFormEEProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the estonian translation of a noun (and handles the validations)
export function NounFormEE(props: NounFormEEProps) {

    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        singularNimetav: Yup.string()
            .required("Singular nimetav is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        pluralNimetav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        singularOmastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        pluralOmastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        singularOsastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        pluralOsastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        shortForm: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm<
        {
            singularNimetav: string,
            pluralNimetav: string,
            singularOmastav: string,
            pluralOmastav: string,
            singularOsastav: string,
            pluralOsastav: string,
            shortForm: string,
        }
        >({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [singularNimetav, setSingularNimetav] = useState("")
    const [singularOmastav, setSingularOmastav] = useState("")
    const [singularOsastav, setSingularOsastav] = useState("")
    const [shortForm, setShortForm] = useState("")

    const [pluralNimetav, setPluralNimetav] = useState("")
    const [pluralOmastav, setPluralOmastav] = useState("")
    const [pluralOsastav, setPluralOsastav] = useState("")

    useEffect(() => {
        const currentCases: WordItem[] = [
            {
                caseName: NounCases.singularNimetavEE,
                word: singularNimetav
            },
            {
                caseName: NounCases.pluralNimetavEE,
                word: pluralNimetav
            },
            {
                caseName: NounCases.singularOmastavEE,
                word: singularOmastav
            },
            {
                caseName: NounCases.pluralOmastavEE,
                word: pluralOmastav
            },
            {
                caseName: NounCases.singularOsastavEE,
                word: singularOsastav
            },
            {
                caseName: NounCases.pluralOsastavEE,
                word: pluralOsastav
            },
            {
                caseName: NounCases.shortFormEE,
                word: shortForm
            },
        ]
        props.updateFormData({
            language: Lang.EE,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [
        singularNimetav, pluralNimetav, singularOmastav, pluralOmastav, singularOsastav,
        pluralOsastav, shortForm, isValid,
    ])

    // This will only be run on first render
    // we use it to populate the form fields with the previously added information
    useEffect(() => {
        if(currentTranslationData.cases!){
            const singularNimetavValue: string = getWordByCase(NounCases.singularNimetavEE, currentTranslationData)
            const pluralNimetavValue: string = getWordByCase(NounCases.pluralNimetavEE, currentTranslationData)
            const singularOmastavValue: string = getWordByCase(NounCases.singularOmastavEE, currentTranslationData)
            const pluralOmastavValue: string = getWordByCase(NounCases.pluralOmastavEE, currentTranslationData)
            const singularOsastavValue: string = getWordByCase(NounCases.singularOsastavEE, currentTranslationData)
            const pluralOsastavValue: string = getWordByCase(NounCases.pluralOsastavEE, currentTranslationData)
            const shortFormValue: string = getWordByCase(NounCases.shortFormEE, currentTranslationData)
            setValue(
                'singularNimetav',
                singularNimetavValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setSingularNimetav(singularNimetavValue)
            setValue(
                'pluralNimetav',
                pluralNimetavValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setPluralNimetav(pluralNimetavValue)
            setValue(
                'singularOmastav',
                singularOmastavValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setSingularOmastav(singularOmastavValue)
            setValue(
                'pluralOmastav',
                pluralOmastavValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setPluralOmastav(pluralOmastavValue)
            setValue(
                'singularOsastav',
                singularOsastavValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setSingularOsastav(singularOsastavValue)
            setValue(
                'pluralOsastav',
                pluralOsastavValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setPluralOsastav(pluralOsastavValue)
            setValue(
                'shortForm',
                shortFormValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setShortForm(shortFormValue)
        }
    },[])

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
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, singularNimetav)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Ainsus nimetav"}
                                name={"singularNimetav"}
                                defaultValue={""}
                                errors={errors.singularNimetav}
                                onChange={(value: any) => {
                                    setSingularNimetav(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, pluralNimetav)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Mitmus nimetav"}
                                name={"pluralNimetav"}
                                defaultValue={""}
                                errors={errors.pluralNimetav}
                                onChange={(value: any) => {
                                    setPluralNimetav(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, singularOmastav)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Ainsus omastav"}
                                name={"singularOmastav"}
                                defaultValue={""}
                                errors={errors.singularOmastav}
                                onChange={(value: any) => {
                                    setSingularOmastav(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, pluralOmastav)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Mitmus omastav"}
                                name={"pluralOmastav"}
                                defaultValue={""}
                                errors={errors.pluralOmastav}
                                onChange={(value: any) => {
                                    setPluralOmastav(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, singularOsastav)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Ainsus osastav"}
                                name={"singularOsastav"}
                                defaultValue={""}
                                errors={errors.singularOsastav}
                                onChange={(value: any) => {
                                    setSingularOsastav(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, pluralOsastav)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Mitmus osastav"}
                                name={"pluralOsastav"}
                                defaultValue={""}
                                errors={errors.pluralOsastav}
                                onChange={(value: any) => {
                                    setPluralOsastav(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {/*
                        TODO: add a checkbox to specify that this field is not required?
                         So loading circle in table-cell can be set as full
                    */}
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, shortForm)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Lühike sisseütlev"}
                                name={"shortForm"}
                                defaultValue={""}
                                errors={errors.shortForm}
                                onChange={(value: any) => {
                                    setShortForm(value)
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