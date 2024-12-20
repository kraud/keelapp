import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {WordItem, TranslationItem} from "../../../ts/interfaces";
import {AdjectiveCases, Lang, NounCases} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";
import {useTranslation} from "react-i18next";

interface AdjectiveFormENProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the english translation of a noun (and handles the validations)
export function AdjectiveFormEN(props: AdjectiveFormENProps) {
    const { t } = useTranslation(['wordRelated'])
    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        positive: Yup.string()
            .required(t('wordForm.adjective.errors.formEN.positiveDegreeRequired', { ns: 'wordRelated' }))
            .matches(/^[^0-9]+$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        comparative: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        superlative: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
    })

    interface AdjectiveData {
        positive: string,
        comparative: string,
        superlative: string,
    }

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [adjective, setAdjective] = useState<AdjectiveData>({
        positive: "",
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
                caseName: AdjectiveCases.positiveEN,
                word: adjective.positive.toLowerCase()
            },
            {
                caseName: AdjectiveCases.comparativeEN,
                word: adjective.comparative.toLowerCase()
            },
            {
                caseName: AdjectiveCases.superlativeEN,
                word: adjective.superlative.toLowerCase()
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
            const positiveValue: string = getWordByCase(AdjectiveCases.positiveEN, currentTranslationData)
            const comparativeValue: string = getWordByCase(AdjectiveCases.comparativeEN, currentTranslationData)
            const superlativeValue: string = getWordByCase(AdjectiveCases.superlativeEN, currentTranslationData)
            setValue(
                'positive',
                positiveValue,
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
                positive: positiveValue,
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
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.positive)) &&
                        <Grid
                            item={true}
                            xs={12}
                            md={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Positive"}
                                name={"positive"}
                                defaultValue={""}
                                fullWidth={true}
                                errors={errors.positive}
                                onChange={(value: string) => {
                                    updateData("positive", value)
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