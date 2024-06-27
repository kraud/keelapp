import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {WordItem, TranslationItem} from "../../../ts/interfaces";
import {AdjectiveCases, Lang} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";

interface AdjectiveFormDEProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the english translation of a noun (and handles the validations)
export function AdjectiveFormDE(props: AdjectiveFormDEProps) {

    const { currentTranslationData } = props

    // const validationSchema = Yup.object().shape({
    const validationSchema = Yup.object({
        positive: Yup.string()
            .required("Positive form is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        komparativ: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        superlativ: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
    })

    // We assume all fields are strings, since even when field is empty, the value still is ""
    interface AdjectiveData {
        positive: string,
        komparativ: string,
        superlativ: string,
    }

    // To match definition in validationSchema, we create this separate interface
    interface AdjectiveDataSchema {
        positive: string,
        komparativ: string | null | undefined,
        superlativ: string | null | undefined,
    }

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm<AdjectiveDataSchema>({
    // } = useForm<AdjectiveData>({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [adjective, setAdjective] = useState<AdjectiveData>({
        positive: "",
        komparativ: "",
        superlativ: "",
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
                caseName: AdjectiveCases.positiveDE,
                word: adjective.positive
            },
            {
                caseName: AdjectiveCases.komparativDE,
                word: adjective.komparativ
            },
            {
                caseName: AdjectiveCases.superlativDE,
                word: adjective.superlativ
            }
        ]
        props.updateFormData({
            language: Lang.DE,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [adjective, isValid])

    // This will only be run on first render
    // we use it to populate the form fields with the previously added information
    useEffect(() => {
        if(currentTranslationData.cases!){
            const positiveValue: string = getWordByCase(AdjectiveCases.positiveDE, currentTranslationData)
            const komparativValue: string = getWordByCase(AdjectiveCases.komparativDE, currentTranslationData)
            const superlativValue: string = getWordByCase(AdjectiveCases.superlativDE, currentTranslationData)
            setValue(
                'positive',
                positiveValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setValue(
                'komparativ',
                komparativValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setValue(
                'superlativ',
                superlativValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setAdjective({
                positive: positiveValue,
                komparativ: komparativValue,
                superlativ: superlativValue,
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
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.komparativ)) &&
                        <Grid
                            item={true}
                            xs={12}
                            md={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Komparativ"}
                                name={"komparativ"}
                                defaultValue={""}
                                fullWidth={true}
                                errors={errors.komparativ}
                                onChange={(value: string) => {
                                    updateData("komparativ", value)
                                }}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.superlativ)) &&
                        <Grid
                            item={true}
                            xs={12}
                            md={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Superlativ"}
                                name={"superlativ"}
                                defaultValue={""}
                                fullWidth={true}
                                errors={errors.superlativ}
                                onChange={(value: string) => {
                                    updateData("superlativ", value)
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