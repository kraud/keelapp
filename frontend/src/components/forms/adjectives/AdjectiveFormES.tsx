import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {WordItem, TranslationItem} from "../../../ts/interfaces";
import {AdjectiveCases, Lang} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";
import {RadioGroupWithHook} from "../../RadioGroupFormHook";

interface AdjectiveFormESProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the english translation of a noun (and handles the validations)
export function AdjectiveFormES(props: AdjectiveFormESProps) {
    const { currentTranslationData } = props

    // validation when adjective varies depending on gender
    const validationSchemaByGender = Yup.object().shape({
        gender: Yup.string().required("Required")
            .oneOf(["Neutral", "M/F"], "Required"),
        maleSingular: Yup.string()
            .required("Masculine singular degree is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        femaleSingular: Yup.string()
            .required("Female singular degree is required")
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        malePlural: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        femalePlural: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        // The following values are added to help with TS verifications, so it is compatible with the neutral-schema
        // neutralSingular: Yup.string().nullable(),
        // neutralPlural: Yup.string().nullable(),
    })

    // validation when adjective varies depending on gender
    const validationSchemaNeutral = Yup.object().shape({
        gender: Yup.string().required("Required")
            .oneOf(["Neutral", "M/F"], "Required"),
        neutralSingular: Yup.string()
            .required("Neutral singular degree is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        neutralPlural: Yup.string()
            .required("Neutral plural degree is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        // The following values are added to help with TS verifications, so it is compatible with the gender-schema
        // maleSingular: Yup.string().nullable(),
        // femaleSingular: Yup.string().nullable(),
        // malePlural: Yup.string().nullable(),
        // femalePlural: Yup.string().nullable(),
    })

    interface AdjectiveData {
        gender: "Neutral" | "M/F" | "",
        maleSingular: string,
        femaleSingular: string,
        malePlural: string,
        femalePlural: string,
        neutralSingular: string,
        neutralPlural: string,
    }

    const [adjective, setAdjective] = useState<AdjectiveData>({
        gender: "",
        maleSingular: "",
        femaleSingular: "",
        malePlural: "",
        femalePlural: "",
        neutralSingular: "",
        neutralPlural: "",
    })
    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm<any, any>({
        //@ts-ignore
        resolver: yupResolver((adjective.gender === "Neutral") ?validationSchemaNeutral :validationSchemaByGender),
        mode: "all", // Triggers validation/errors without having to submit
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
                caseName: AdjectiveCases.maleSingularES,
                word: adjective.maleSingular
            },
            {
                caseName: AdjectiveCases.femaleSingularES,
                word: adjective.femaleSingular
            },
            {
                caseName: AdjectiveCases.malePluralES,
                word: adjective.malePlural
            },
            {
                caseName: AdjectiveCases.femalePluralES,
                word: adjective.femalePlural
            },
            {
                caseName: AdjectiveCases.neutralSingularES,
                word: adjective.neutralSingular
            },
            {
                caseName: AdjectiveCases.neutralPluralES,
                word: adjective.neutralPlural
            }
        ]
        props.updateFormData({
            language: Lang.ES,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [adjective, isValid])

    // This will only be run on first render
    // we use it to populate the form fields with the previously added information
    useEffect(() => {
        if(currentTranslationData.cases!){
            const isCurrentTranslationDataNeutral = (getWordByCase(AdjectiveCases.neutralSingularES, currentTranslationData) !== "")

            const maleSingularValue: string = getWordByCase(AdjectiveCases.maleSingularES, currentTranslationData)
            const femaleSingularValue: string = getWordByCase(AdjectiveCases.femaleSingularES, currentTranslationData)
            const malePluralValue: string = getWordByCase(AdjectiveCases.malePluralES, currentTranslationData)
            const femalePluralValue: string = getWordByCase(AdjectiveCases.femalePluralES, currentTranslationData)
            const neutralSingularValue: string = getWordByCase(AdjectiveCases.neutralSingularES, currentTranslationData)
            const neutralPluralValue: string = getWordByCase(AdjectiveCases.neutralPluralES, currentTranslationData)

            setValue(
                'gender',
                (isCurrentTranslationDataNeutral) ?"Neutral" :"M/F",
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setValue(
                'maleSingular',
                maleSingularValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setValue(
                'femaleSingular',
                femaleSingularValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setValue(
                'malePlural',
                malePluralValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setValue(
                'femalePlural',
                femalePluralValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setValue(
                'neutralSingular',
                neutralSingularValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setValue(
                'neutralPlural',
                neutralPluralValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setAdjective({
                gender: (isCurrentTranslationDataNeutral) ?"Neutral" :"M/F",
                maleSingular: maleSingularValue,
                femaleSingular: femaleSingularValue,
                malePlural: malePluralValue,
                femalePlural: femalePluralValue,
                neutralSingular: neutralSingularValue,
                neutralPlural: neutralPluralValue,
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
                    <Grid
                        item={true}
                        container={true}
                    >
                        <RadioGroupWithHook
                            control={control}
                            label={"Gender"}
                            name={"gender"}
                            options={["Neutral", "M/F"]}
                            defaultValue={""}
                            errors={errors.gender}
                            onChange={(value: any) => {
                                updateData("gender", value)
                            }}
                            fullWidth={true}
                            disabled={props.displayOnly}
                        />
                    </Grid>
                    {(adjective.gender !== "") &&
                        <>
                            {(adjective.gender === "Neutral")
                                ?
                                <>
                                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.neutralSingular)) &&
                                        <Grid
                                            item={true}
                                            xs={12}
                                            md={6}
                                        >
                                            <TextInputFormWithHook
                                                control={control}
                                                label={"Neutral singular"}
                                                name={"neutralSingular"}
                                                defaultValue={""}
                                                fullWidth={true}
                                                errors={errors.neutralSingular}
                                                onChange={(value: string) => {
                                                    updateData("neutralSingular", value)
                                                }}
                                                disabled={props.displayOnly}
                                            />
                                        </Grid>
                                    }
                                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.neutralPlural)) &&
                                        <Grid
                                            item={true}
                                            xs={12}
                                            md={6}
                                        >
                                            <TextInputFormWithHook
                                                control={control}
                                                label={"Neutral plural"}
                                                name={"neutralPlural"}
                                                defaultValue={""}
                                                fullWidth={true}
                                                errors={errors.neutralPlural}
                                                onChange={(value: string) => {
                                                    updateData("neutralPlural", value)
                                                }}
                                                disabled={props.displayOnly}
                                            />
                                        </Grid>
                                    }
                                </>
                                :
                                <>
                                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.maleSingular)) &&
                                        <Grid
                                            item={true}
                                            xs={12}
                                            md={6}
                                        >
                                            <TextInputFormWithHook
                                                control={control}
                                                label={"Male singular"}
                                                name={"maleSingular"}
                                                defaultValue={""}
                                                fullWidth={true}
                                                errors={errors.maleSingular}
                                                onChange={(value: string) => {
                                                    updateData("maleSingular", value)
                                                }}
                                                disabled={props.displayOnly}
                                            />
                                        </Grid>
                                    }
                                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.malePlural)) &&
                                        <Grid
                                            item={true}
                                            xs={12}
                                            md={6}
                                        >
                                            <TextInputFormWithHook
                                                control={control}
                                                label={"Male plural"}
                                                name={"malePlural"}
                                                defaultValue={""}
                                                fullWidth={true}
                                                errors={errors.malePlural}
                                                onChange={(value: string) => {
                                                    updateData("malePlural", value)
                                                }}
                                                disabled={props.displayOnly}
                                            />
                                        </Grid>
                                    }
                                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.femaleSingular)) &&
                                        <Grid
                                            item={true}
                                            xs={12}
                                            md={6}
                                        >
                                            <TextInputFormWithHook
                                                control={control}
                                                label={"Female singular"}
                                                name={"femaleSingular"}
                                                defaultValue={""}
                                                fullWidth={true}
                                                errors={errors.femaleSingular}
                                                onChange={(value: string) => {
                                                    updateData("femaleSingular", value)
                                                }}
                                                disabled={props.displayOnly}
                                            />
                                        </Grid>
                                    }
                                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.femalePlural)) &&
                                        <Grid
                                            item={true}
                                            xs={12}
                                            md={6}
                                        >
                                            <TextInputFormWithHook
                                                control={control}
                                                label={"Female plural"}
                                                name={"femalePlural"}
                                                defaultValue={""}
                                                fullWidth={true}
                                                errors={errors.femalePlural}
                                                onChange={(value: string) => {
                                                    updateData("femalePlural", value)
                                                }}
                                                disabled={props.displayOnly}
                                            />
                                        </Grid>
                                    }
                                </>
                            }
                        </>
                    }
                </Grid>
            </form>
        </Grid>
    )
}