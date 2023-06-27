import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../TextInputFormHook";
import {SelectFormWithHook} from "../SelectFormHook";
import {NounItem} from "../../ts/interfaces";
import {GenderDE, NounCases} from "../../ts/enums";

interface WordFormENProps {
    setComplete: (completionState: boolean) => void // used to enable/disable submit button of parent form
    setCases: (cases: NounItem[]) => void // once submit button of parent form is pressed, we send all data from this form
}
// Displays the fields required to add the english translation of a word (and handles the validations)
export function WordFormDE(props: WordFormENProps) {

    const validationSchema = Yup.object().shape({
        gender: Yup.string().required("The gender is required")
            .oneOf([GenderDE.M, GenderDE.F, GenderDE.N], "Pick a valid gender option"),
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
        control, formState: { errors, isValid }
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

    const [genderWord, setGenderWord] = useState<"el"|"la"|"">("")

    const [singularNominativ, setSingularNominativ] = useState("")
    const [singularAkkusativ, setSingularAkkusativ] = useState("")
    const [singularGenitiv, setSingularGenitiv] = useState("")
    const [singularDativ, setSingularDativ] = useState("")

    const [pluralNominativ, setPluralNominativ] = useState("")
    const [pluralAkkusativ, setPluralAkkusativ] = useState("")
    const [pluralGenitiv, setPluralGenitiv] = useState("")
    const [pluralDativ, setPluralDativ] = useState("")

    useEffect(() => {
        props.setComplete(isValid)
    }, [isValid])

    useEffect(() => {
        const currentCases: NounItem[] = [
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
        props.setCases(currentCases)
    }, [
        genderWord, singularNominativ, pluralNominativ, singularAkkusativ, pluralAkkusativ, singularGenitiv,
        pluralGenitiv, singularDativ, pluralDativ
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
                        <SelectFormWithHook
                            control={control}
                            label={"Gender"}
                            name={"gender"}
                            options={[GenderDE.M, GenderDE.F, GenderDE.N]}
                            defaultValue={""}
                            errors={errors.gender}
                            onChange={(value: any) => {
                                setGenderWord(value)
                            }}
                        />
                    </Grid>
                    <Grid
                        item={true}
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
                        />
                    </Grid>
                    <Grid
                        item={true}
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
                        />
                    </Grid>
                    <Grid
                        item={true}
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
                        />
                    </Grid>
                    <Grid
                        item={true}
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
                        />
                    </Grid>
                    <Grid
                        item={true}
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
                        />
                    </Grid>
                    <Grid
                        item={true}
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
                        />
                    </Grid>
                    <Grid
                        item={true}
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
                        />
                    </Grid>
                    <Grid
                        item={true}
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
                        />
                    </Grid>
                </Grid>
            </form>
        </Grid>
    )
}