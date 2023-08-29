import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../TextInputFormHook";
import {WordItem, TranslationItem} from "../../ts/interfaces";
import {GenderDE, Lang, NounCases} from "../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "./commonFunctions";
import {RadioGroupWithHook} from "../RadioGroupFormHook";

interface WordFormDEProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the german translation of a word (and handles the validations)
export function WordFormDE(props: WordFormDEProps) {

    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        gender: Yup.string().required("Required")
            .oneOf([GenderDE.M, GenderDE.F, GenderDE.N], "Required"),
        singularNominativ: Yup.string()
            .required("Singular nominativ is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        pluralNominativ: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        singularAkkusativ: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        pluralAkkusativ: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        singularGenitiv: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        pluralGenitiv: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        singularDativ: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        pluralDativ: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm<
        {
            gender: string,
            singularNominativ: string,
            pluralNominativ: string,
            singularAkkusativ: string,
            pluralAkkusativ: string,
            singularGenitiv: string,
            pluralGenitiv: string,
            singularDativ: string,
            pluralDativ: string,
        }
        >({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [genderWord, setGenderWord] = useState<"der"|"die"|"das"|"">("")

    const [singularNominativ, setSingularNominativ] = useState("")
    const [singularAkkusativ, setSingularAkkusativ] = useState("")
    const [singularGenitiv, setSingularGenitiv] = useState("")
    const [singularDativ, setSingularDativ] = useState("")

    const [pluralNominativ, setPluralNominativ] = useState("")
    const [pluralAkkusativ, setPluralAkkusativ] = useState("")
    const [pluralGenitiv, setPluralGenitiv] = useState("")
    const [pluralDativ, setPluralDativ] = useState("")

    useEffect(() => {
        const currentCases: WordItem[] = [
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
        genderWord, singularNominativ, pluralNominativ, singularAkkusativ, pluralAkkusativ, singularGenitiv,
        pluralGenitiv, singularDativ, pluralDativ, isValid
    ])

    // This will only be run on first render
    // we use it to populate the form fields with the previously added information
    useEffect(() => {
        if(currentTranslationData.cases!){
            const genderValue: string = getWordByCase(NounCases.genderDE, currentTranslationData)
            const singularNominativValue: string = getWordByCase(NounCases.singularNominativDE, currentTranslationData)
            const pluralNominativValue: string = getWordByCase(NounCases.pluralNominativDE, currentTranslationData)
            const singularAkkusativValue: string = getWordByCase(NounCases.singularAkkusativDE, currentTranslationData)
            const pluralAkkusativValue: string = getWordByCase(NounCases.pluralAkkusativDE, currentTranslationData)
            const singularGenitivValue: string = getWordByCase(NounCases.singularGenitivDE, currentTranslationData)
            const pluralGenitivValue: string = getWordByCase(NounCases.pluralGenitivDE, currentTranslationData)
            const singularDativValue: string = getWordByCase(NounCases.singularDativDE, currentTranslationData)
            const pluralDativValue: string = getWordByCase(NounCases.pluralDativDE, currentTranslationData)
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
    },[])

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
                    <Grid
                        item={true}
                        xs={12}
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