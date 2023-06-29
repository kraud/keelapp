import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../TextInputFormHook";
import {NounItem} from "../../ts/interfaces";
import {NounCases} from "../../ts/enums";

interface WordFormEEProps {
    updateFormData: (
        formData: {
            cases?: NounItem[],
            completionState?: boolean
        }
    ) => void
    // setComplete: (completionState: boolean) => void // used to enable/disable submit button of parent form
    // setCases: (cases: NounItem[]) => void // once submit button of parent form is pressed, we send all data from this form
}
// Displays the fields required to add the english translation of a word (and handles the validations)
export function WordFormEE(props: WordFormEEProps) {

    const validationSchema = Yup.object().shape({
        singularNimetav: Yup.string()
            .required("Singular nominativ is required")
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
        control, formState: { errors, isValid }
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
        // props.setComplete(isValid)
        props.updateFormData({
            completionState: isValid
        })
    }, [isValid])

    useEffect(() => {
        const currentCases: NounItem[] = [
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
        // props.setCases(currentCases)
        props.updateFormData({
            cases: currentCases
        })
    }, [
        singularNimetav, pluralNimetav, singularOmastav, pluralOmastav, singularOsastav,
        pluralOsastav, shortForm
    ])

    return(
        <Grid
            item={true}
        >
            <form>
                <Grid
                    container={true}
                    xs={10}
                    justifyContent={"center"}
                    item={true}
                >
                    <Grid
                        item={true}
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
                        />
                    </Grid>
                    <Grid
                        item={true}
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
                        />
                    </Grid>
                    <Grid
                        item={true}
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
                        />
                    </Grid>
                    <Grid
                        item={true}
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
                        />
                    </Grid>
                    <Grid
                        item={true}
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
                        />
                    </Grid>
                    <Grid
                        item={true}
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
                        />
                    </Grid>
                    <Grid
                        item={true}
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
                        />
                    </Grid>
                </Grid>
            </form>
        </Grid>
    )
}