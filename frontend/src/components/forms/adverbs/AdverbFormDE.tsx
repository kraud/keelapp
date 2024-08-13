import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {WordItem, TranslationItem} from "../../../ts/interfaces";
import {AdverbCases, Lang} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";
import {RadioGroupWithHook} from "../../RadioGroupFormHook";

interface AdverbFormDEProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the english translation of a noun (and handles the validations)
export function AdverbFormDE(props: AdverbFormDEProps) {

    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        gradable: Yup.string().required("Required")
            .oneOf(["Gradable", "Non-gradable", ""], "Required"),
        adverb: Yup.string()
            .required("Adverb is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        comparative: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        superlative: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
    })

    interface AdverbData {
        gradable: "Gradable" | "Non-gradable" | "",
        adverb: string,
        comparative: string,
        superlative: string,
    }

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [adjective, setAdjective] = useState<AdverbData>({
        gradable: "",
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
                caseName: AdverbCases.gradableDE,
                word: adjective.gradable
            },
            {
                caseName: AdverbCases.adverbDE,
                word: adjective.adverb
            },
            {
                caseName: AdverbCases.comparativeDE,
                // to avoid sending potentially saved info that is not relevant anymore
                word: (adjective.gradable !== "Non-gradable") ? adjective.comparative : ""
            },
            {
                caseName: AdverbCases.superlativeDE,
                // to avoid sending potentially saved info that is not relevant anymore
                word: (adjective.gradable !== "Non-gradable") ? adjective.superlative : ""
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
            const gradableValue: ("Gradable" | "Non-gradable") = getWordByCase(AdverbCases.gradableDE, currentTranslationData) as "Gradable" | "Non-gradable"
            const adverbValue: string = getWordByCase(AdverbCases.adverbDE, currentTranslationData)
            const comparativeValue: string = getWordByCase(AdverbCases.comparativeDE, currentTranslationData)
            const superlativeValue: string = getWordByCase(AdverbCases.superlativeDE, currentTranslationData)

            setValue(
                'gradable',
                gradableValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
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
                gradable: gradableValue,
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
                    {/* TODO: add checkbox for "gradable", so it hides/shows komparativ and superlativ */}
                    <Grid
                        item={true}
                        xs={12}
                    >
                        <RadioGroupWithHook
                            control={control}
                            label={"Gradable"}
                            name={"gradable"}
                            options={["Gradable", "Non-gradable"]}
                            defaultValue={""}
                            errors={errors.gradable}
                            onChange={(value: any) => {
                                updateData("gradable", value)
                            }}
                            fullWidth={true}
                            disabled={props.displayOnly}
                        />
                    </Grid>
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.adverb)) &&
                        <Grid
                            item={true}
                            xs={12}
                            md={(adjective.gradable === "Non-gradable") ?12 :4}
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
                    {
                        (
                            (getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.comparative)) &&
                            // Only hidden when user knows for sure that it is non-gradable
                            (adjective.gradable !== "Non-gradable") // If not sure (option: ""), the fields should also be displayed.
                        ) &&
                        <Grid
                            item={true}
                            xs={12}
                            md={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Komparativ"}
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
                    {
                        (
                            (getDisabledInputFieldDisplayLogic(props.displayOnly!, adjective.superlative)) &&
                            (adjective.gradable !== "Non-gradable") // If not sure (option: ""), the fields should also be displayed. Only hidden when user knows for sure that is is non-gradable
                        ) &&
                        <Grid
                            item={true}
                            xs={12}
                            md={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Superlativ"}
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