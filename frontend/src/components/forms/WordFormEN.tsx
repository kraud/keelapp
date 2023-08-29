import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../TextInputFormHook";
import {WordItem, TranslationItem} from "../../ts/interfaces";
import {Lang, NounCases} from "../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "./commonFunctions";

interface WordFormENProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the english translation of a word (and handles the validations)
export function WordFormEN(props: WordFormENProps) {

    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        singular: Yup.string()
            .required("Singular form is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        plural: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
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
        const currentCases: WordItem[] = [
            {
                caseName: NounCases.singularEN,
                word: singularWord
            },
            {
                caseName: NounCases.pluralEN,
                word: pluralWord
            }
        ]
        props.updateFormData({
            language: Lang.EN,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [singularWord, pluralWord, isValid])

    // This will only be run on first render
    // we use it to populate the form fields with the previously added information
    useEffect(() => {
        if(currentTranslationData.cases!){
            const singularValue: string = getWordByCase(NounCases.singularEN, currentTranslationData)
            const pluralValue: string = getWordByCase(NounCases.pluralEN, currentTranslationData)
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
        }
    },[])

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
                    container={true}
                    item={true}
                    spacing={2}
                >
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, singularWord)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Singular"}
                                name={"singular"}
                                defaultValue={""}
                                fullWidth={true}
                                errors={errors.singular}
                                onChange={(value: any) => {
                                    setSingularWord(value)
                                }}
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
                                label={"Plural"}
                                name={"plural"}
                                defaultValue={""}
                                fullWidth={true}
                                errors={errors.plural}
                                onChange={(value: any) => {
                                    setPluralWord(value)
                                }}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                </Grid>
            </form>
        </Grid>
    )
}