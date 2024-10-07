import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {WordItem, TranslationItem} from "../../../ts/interfaces";
import {Lang, NounCases, VerbRegularity} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";
import {useTranslation} from "react-i18next";
import {RadioGroupWithHook} from "../../RadioGroupFormHook";

interface NounFormENProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the english translation of a noun (and handles the validations)
export function NounFormEN(props: NounFormENProps) {
    const { t } = useTranslation(['wordRelated'])
    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        //  Properties
        regularity: Yup.string()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' }))
            .matches(/^(regular|irregular)?$/, t('wordForm.verb.errors.formEN.regularityRequired', { ns: 'wordRelated' })),
        singular: Yup.string()
            .required(t('wordForm.noun.errors.formEN.singularFormRequired', { ns: 'wordRelated' }))
            .matches(/^[^0-9]+$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        plural: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [regularity, setRegularity] = useState<"regular"|"irregular"|"">("")
    const [singularWord, setSingularWord] = useState("")
    const [pluralWord, setPluralWord] = useState("")

    useEffect(() => {
        const currentCases: WordItem[] = [
            {
                caseName: NounCases.regularityEN,
                word: regularity
            },
            {
                caseName: NounCases.singularEN,
                word: singularWord.toLowerCase()
            },
            {
                caseName: NounCases.pluralEN,
                word: pluralWord.toLowerCase()
            }
        ]
        props.updateFormData({
            language: Lang.EN,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [regularity, singularWord, pluralWord, isValid])

    // This will only be run on first render
    // we use it to populate the form fields with the previously added information
    useEffect(() => {
        if(currentTranslationData.cases!){
            const regularityValue: string = getWordByCase(NounCases.regularityEN, currentTranslationData)
            const singularValue: string = getWordByCase(NounCases.singularEN, currentTranslationData)
            const pluralValue: string = getWordByCase(NounCases.pluralEN, currentTranslationData)
            setValue(
                'regularity',
                regularityValue,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setRegularity(regularityValue as "regular"|"irregular")
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
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, regularity)) &&
                        <Grid
                            container={true}
                            justifyContent={'flex-start'}
                            item={true}
                            xs={12}
                        >
                            <Grid
                                item={true}
                                xs={true}
                            >
                                {/* TODO: auto-detect regularity? (and suggest it with tooltip. */}
                                <RadioGroupWithHook
                                    control={control}
                                    label={"Regularity"}
                                    name={"regularity"}
                                    options={[VerbRegularity.regular, VerbRegularity.irregular]}
                                    defaultValue={""}
                                    errors={errors.regularity}
                                    onChange={(value: any) => {
                                        setRegularity(value)
                                    }}
                                    fullWidth={false}
                                    disabled={props.displayOnly}
                                />
                            </Grid>
                        </Grid>
                    }
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