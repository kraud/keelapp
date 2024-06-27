import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {WordItem, TranslationItem} from "../../../ts/interfaces";
import {Lang, NounCases} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";
import {RadioGroupWithHook} from "../../RadioGroupFormHook";

interface NounFormESProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the spanish translation of a noun (and handles the validations)
export function NounFormES(props: NounFormESProps) {

    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        gender: Yup.string().required("Required")
            .oneOf(["el", "la", "el/la"], "Required"),
        singular: Yup.string()
            .required("Singular form is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        plural: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers')
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [singularWord, setSingularWord] = useState("")
    const [pluralWord, setPluralWord] = useState("")
    const [genderWord, setGenderWord] = useState<"el"|"la"|"">("")

    useEffect(() => {
        const currentCases: WordItem[] = [
            {
                caseName: NounCases.singularES,
                word: singularWord
            },
            {
                caseName: NounCases.pluralES,
                word: pluralWord
            },
            {
                caseName: NounCases.genderES,
                word: genderWord
            }
        ]
        props.updateFormData({
            language: Lang.ES,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [singularWord, pluralWord, genderWord, isValid])

    // This will only be run on first render
    // we use it to populate the form fields with the previously added information
    useEffect(() => {
        if(currentTranslationData.cases!){
            const singularValue: string = getWordByCase(NounCases.singularES, currentTranslationData)
            const pluralValue: string = getWordByCase(NounCases.pluralES, currentTranslationData)
            const genderValue: string = getWordByCase(NounCases.genderES, currentTranslationData)
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
            setValue(
                'gender',
                genderValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setGenderWord(genderValue as "el"|"la"|"")
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
                    item={true}
                    container={true}
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
                            options={["el", "la", "el/la"]}
                            defaultValue={""}
                            errors={errors.gender}
                            onChange={(value: any) => {
                                setGenderWord(value)
                            }}
                            fullWidth={true}
                            disabled={props.displayOnly}
                        />
                    </Grid>
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, singularWord)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Singular palabra"}
                                name={"singular"}
                                defaultValue={""}
                                errors={errors.singular}
                                onChange={(value: any) => {
                                    setSingularWord(value)
                                }}
                                fullWidth={true}
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
                                label={"Plural palabra"}
                                name={"plural"}
                                defaultValue={""}
                                errors={errors.plural}
                                onChange={(value: any) => {
                                    setPluralWord(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                </Grid>
            </form>
        </Grid>
    )
}