import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {NounItem, NounCases} from "./WordFormGeneric";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "./TextInputFormHook";

interface WordFormENProps {
    setComplete: (completionState: boolean) => void // used to enable/disable submit button of parent form
    setCases?: (cases: NounItem[]) => void // once submit button of parent form is pressed, we send all data from this form
}
// Displays the fields required to add the english translation of a word (and handles the validations)
export function WordFormEN(props: WordFormENProps) {

    const validationSchema = Yup.object().shape({
        singular: Yup.string()
            .required("Word is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        plural: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
    })

    const {
        getValues, handleSubmit, reset, control, formState: { errors, isValid }
    } = useForm<
        {
            singular: string,
            plural: string,
        }
        >({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [singularWord, setSingularWord] = useState("")
    const [pluralWord, setPluralWord] = useState("")

    useEffect(() => {
        props.setComplete(isValid)
    }, [isValid])

    useEffect(() => {
        const currentCases: NounItem[] = [
            {
                caseName: NounCases.singularEN,
                word: singularWord
            },
            {
                caseName: NounCases.pluralEN,
                word: pluralWord
            }
        ]
        props.setCases!(currentCases)
    }, [singularWord, pluralWord])

    return(
        <Grid
            item={true}
        >
            <form>
                <Grid
                    container={true}
                    item={true}
                >
                    <Grid
                        item={true}
                    >
                        <TextInputFormWithHook
                            control={control}
                            label={"Singular"}
                            name={"singular"}
                            defaultValue={""}
                            errors={errors.singular}
                            onChange={(value: any) => {
                                setSingularWord(value)
                            }}
                        />
                    </Grid>
                    <Grid
                        item={true}
                    >
                        <TextInputFormWithHook
                            control={control}
                            label={"Plural"}
                            name={"plural"}
                            defaultValue={""}
                            errors={errors.plural}
                            onChange={(value: any) => {
                                setPluralWord(value)
                            }}
                        />
                    </Grid>
                </Grid>
            </form>
        </Grid>
    )
}