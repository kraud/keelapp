import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {WordItem, TranslationItem} from "../../../ts/interfaces";
import {AdjectiveCases, AdverbCases, Lang, NounCases} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";

interface AdverbFormENProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the english translation of a noun (and handles the validations)
export function AdverbFormEN(props: AdverbFormENProps) {

    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        adverb: Yup.string()
            .required("Adverb is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        comparative: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        superlative: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
    })

    interface AdjectiveData {
        adverb: string,
        comparative: string,
        superlative: string,
    }

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm<AdjectiveData>({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [adjective, setAdjective] = useState<AdjectiveData>({
        adverb: "",
        comparative: "",
        superlative: "",
    })

    const updateData = (field: string, value: string) => {
        setAdjective((prev) => {
            return({
                ...prev,
                [field]: value
            })
        })
    }

    useEffect(() => {
        const currentCases: WordItem[] = [
            {
                caseName: AdverbCases.adverbEN,
                word: adjective.adverb
            },
            {
                caseName: AdverbCases.comparativeEN,
                word: adjective.comparative
            },
            {
                caseName: AdverbCases.superlativeEN,
                word: adjective.superlative
            }
        ]
        props.updateFormData({
            language: Lang.EN,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [adjective, isValid])

    // This will only be run on first render
    // we use it to populate the form fields with the previously added information
    useEffect(() => {
        if(currentTranslationData.cases!){
            const adverbValue: string = getWordByCase(AdverbCases.adverbEN, currentTranslationData)
            const comparativeValue: string = getWordByCase(AdverbCases.comparativeEN, currentTranslationData)
            const superlativeValue: string = getWordByCase(AdverbCases.superlativeEN, currentTranslationData)
            setValue(
                'adverb',
                adverbValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setValue(
                'comparative',
                comparativeValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setValue(
                'superlative',
                superlativeValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setAdjective({
                adverb: adverbValue,
                comparative: comparativeValue,
                superlative: superlativeValue,
            })
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
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.adverb)) &&
                        <Grid
                            item={true}
                            xs={12}
                            md={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Adverb"}
                                name={"adverb"}
                                defaultValue={""}
                                fullWidth={true}
                                errors={errors.adverb}
                                onChange={(value: string) => {
                                    updateData("adverb", value)
                                }}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.comparative)) &&
                        <Grid
                            item={true}
                            xs={12}
                            md={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Comparative"}
                                name={"comparative"}
                                defaultValue={""}
                                fullWidth={true}
                                errors={errors.comparative}
                                onChange={(value: string) => {
                                    updateData("comparative", value)
                                }}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.superlative)) &&
                        <Grid
                            item={true}
                            xs={12}
                            md={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Superlative"}
                                name={"superlative"}
                                defaultValue={""}
                                fullWidth={true}
                                errors={errors.superlative}
                                onChange={(value: string) => {
                                    updateData("superlative", value)
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