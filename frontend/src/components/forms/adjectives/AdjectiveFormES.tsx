import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {WordItem, TranslationItem} from "../../../ts/interfaces";
import {AdjectiveCases, Lang, NounCases} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";
import {RadioGroupWithHook} from "../../RadioGroupFormHook";

interface AdjectiveFormESProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the english translation of a noun (and handles the validations)
export function AdjectiveFormES(props: AdjectiveFormESProps) {
    const [isNeutralAdjective, setIsNeutralAdjective] = useState(false)

    const { currentTranslationData } = props

    // validation when adjective varies depending on gender
    const validationSchemaByGender = Yup.object().shape({
        gender: Yup.string().required("Required")
            .oneOf(["Neutral", "F/M"], "Required"),
        maleSingular: Yup.string()
            .required("Masculine singular degree is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        feminineSingular: Yup.string().nullable()
            .required("Feminine singular degree is required")
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        malePlural: Yup.string()
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        femininePlural: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
    })

    // validation when adjective varies depending on gender
    const validationSchemaNeutral = Yup.object().shape({
        gender: Yup.string().required("Required")
            .oneOf(["Neutral", "F/M"], "Required"),
        neutralSingular: Yup.string()
            .required("Neutral singular degree is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        neutralPlural: Yup.string()
            .required("Neutral plural degree is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
    })

    interface AdjectiveData {
        gender: string,
        maleSingular: string,
        feminineSingular: string,
        malePlural: string,
        femininePlural: string,
        neutralSingular: string,
        neutralPlural: string,
    }

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm<AdjectiveData>({
        resolver: yupResolver(isNeutralAdjective ?validationSchemaNeutral :validationSchemaByGender),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [adjective, setAdjective] = useState<AdjectiveData>({
        gender: "",
        maleSingular: "",
        feminineSingular: "",
        malePlural: "",
        femininePlural: "",
        neutralSingular: "",
        neutralPlural: "",
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
        // TODO: set currentCases depending on the value of isNeutralAdjective
        const currentCases: WordItem[] = [
            // {
            //     caseName: AdjectiveCases.positiveEN,
            //     word: adjective.positive
            // },
            // {
            //     caseName: AdjectiveCases.comparativeEN,
            //     word: adjective.comparative
            // },
            // {
            //     caseName: AdjectiveCases.superlativeEN,
            //     word: adjective.superlative
            // }
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
        // TODO: set values depending on the value of isNeutralAdjective
        if(currentTranslationData.cases!){
            const positiveValue: string = getWordByCase(AdjectiveCases.positiveEN, currentTranslationData)
            const comparativeValue: string = getWordByCase(AdjectiveCases.comparativeEN, currentTranslationData)
            const superlativeValue: string = getWordByCase(AdjectiveCases.superlativeEN, currentTranslationData)
            // setValue(
            //     'positive',
            //     positiveValue,
            //     {
            //         shouldValidate: true,
            //         shouldTouch: true
            //     }
            // )
            // setValue(
            //     'comparative',
            //     comparativeValue,
            //     {
            //         shouldValidate: true,
            //         shouldTouch: true
            //     }
            // )
            // setValue(
            //     'superlative',
            //     superlativeValue,
            //     {
            //         shouldValidate: true,
            //         shouldTouch: true
            //     }
            // )
            // setAdjective({
            //     positive: positiveValue,
            //     comparative: comparativeValue,
            //     superlative: superlativeValue,
            // })
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
                    <Grid
                        item={true}
                        container={true}
                    >
                        <RadioGroupWithHook
                            control={control}
                            label={"Gender"}
                            name={"gender"}
                            options={["Neutral", "F/M"]}
                            defaultValue={""}
                            errors={errors.gender}
                            onChange={(value: any) => {
                                setIsNeutralAdjective((value === "Neutral"))
                            }}
                            fullWidth={true}
                            disabled={props.displayOnly}
                        />
                    </Grid>
                    {/*{(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.positive)) &&*/}
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
                                // errors={errors.positive}
                                onChange={(value: string) => {
                                    updateData("positive", value)
                                }}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    {/*}*/}
                    {/*{(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.comparative)) &&*/}
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
                                // errors={errors.comparative}
                                onChange={(value: string) => {
                                    updateData("comparative", value)
                                }}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    {/*}*/}
                    {/*{(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.superlative)) &&*/}
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
                                // errors={errors.superlative}
                                onChange={(value: string) => {
                                    updateData("superlative", value)
                                }}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    {/*}*/}
                </Grid>
            </form>
        </Grid>
    )
}