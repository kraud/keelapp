import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Checkbox, Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {TranslationItem, WordItem} from "../../../ts/interfaces";
import {Lang, NounCases, VerbCases, VerbRegularity} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../../app/store";
import {
    getAutocompletedEstonianNounData
} from "../../../features/autocompletedTranslation/autocompletedTranslationSlice";
import LinearIndeterminate from "../../Spinner";
import {setTimerTriggerFunction} from "../../generalUseFunctions";
import {AutocompleteButtonWithStatus} from "../AutocompleteButtonWithStatus";
import globalTheme from "../../../theme/theme";
import FormControlLabel from "@mui/material/FormControlLabel";
import {useTranslation} from "react-i18next";
import Tooltip from "@mui/material/Tooltip";
import {RadioGroupWithHook} from "../../RadioGroupFormHook";

interface NounFormEEProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the estonian translation of a noun (and handles the validations)
export function NounFormEE(props: NounFormEEProps) {
    const { t } = useTranslation(['wordRelated'])
    const dispatch = useDispatch<AppDispatch>()
    const {autocompletedTranslationNounEE, isErrorAT, isSuccessAT, isLoadingAT, messageAT} = useSelector((state: any) => state.autocompletedTranslations)
    const [searchInEnglish, setSearchInEnglish] = useState(false)


    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        //  Properties
        regularity: Yup.string()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' }))
            .matches(/^(regular|irregular)?$/, t('wordForm.verb.errors.formEN.regularityRequired', { ns: 'wordRelated' })),
        singularNimetav: Yup.string()
            .required(t('wordForm.noun.errors.formEE.singularFormRequired', { ns: 'wordRelated' }))
            .matches(/^[^0-9]+$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        pluralNimetav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        singularOmastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        pluralOmastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        singularOsastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        pluralOsastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
        shortForm: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, t('wordForm.errors.noNumbers', { ns: 'wordRelated' })),
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [regularity, setRegularity] = useState<"regular"|"irregular"|"">("")
    const [singularNimetav, setSingularNimetav] = useState("")
    const [singularOmastav, setSingularOmastav] = useState("")
    const [singularOsastav, setSingularOsastav] = useState("")
    const [shortForm, setShortForm] = useState("")

    const [pluralNimetav, setPluralNimetav] = useState("")
    const [pluralOmastav, setPluralOmastav] = useState("")
    const [pluralOsastav, setPluralOsastav] = useState("")

    useEffect(() => {
        const currentCases: WordItem[] = [
            {
                caseName: NounCases.regularityEE,
                word: regularity
            },
            {
                caseName: NounCases.singularNimetavEE,
                word: singularNimetav.toLowerCase()
            },
            {
                caseName: NounCases.pluralNimetavEE,
                word: pluralNimetav.toLowerCase()
            },
            {
                caseName: NounCases.singularOmastavEE,
                word: singularOmastav.toLowerCase()
            },
            {
                caseName: NounCases.pluralOmastavEE,
                word: pluralOmastav.toLowerCase()
            },
            {
                caseName: NounCases.singularOsastavEE,
                word: singularOsastav.toLowerCase()
            },
            {
                caseName: NounCases.pluralOsastavEE,
                word: pluralOsastav.toLowerCase()
            },
            {
                caseName: NounCases.shortFormEE,
                word: shortForm.toLowerCase()
            },
        ]
        props.updateFormData({
            language: Lang.EE,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [
        regularity, singularNimetav, pluralNimetav, singularOmastav, pluralOmastav, singularOsastav,
        pluralOsastav, shortForm, isValid,
    ])

    const setValuesInForm = (translationDataToInsert: TranslationItem) => {
        const regularityValue: string = getWordByCase(NounCases.regularityEE, translationDataToInsert)
        const singularNimetavValue: string = getWordByCase(NounCases.singularNimetavEE, translationDataToInsert)
        const pluralNimetavValue: string = getWordByCase(NounCases.pluralNimetavEE, translationDataToInsert)
        const singularOmastavValue: string = getWordByCase(NounCases.singularOmastavEE, translationDataToInsert)
        const pluralOmastavValue: string = getWordByCase(NounCases.pluralOmastavEE, translationDataToInsert)
        const singularOsastavValue: string = getWordByCase(NounCases.singularOsastavEE, translationDataToInsert)
        const pluralOsastavValue: string = getWordByCase(NounCases.pluralOsastavEE, translationDataToInsert)
        const shortFormValue: string = getWordByCase(NounCases.shortFormEE, translationDataToInsert)
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
            'singularNimetav',
            singularNimetavValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSingularNimetav(singularNimetavValue)
        setValue(
            'pluralNimetav',
            pluralNimetavValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setPluralNimetav(pluralNimetavValue)
        setValue(
            'singularOmastav',
            singularOmastavValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSingularOmastav(singularOmastavValue)
        setValue(
            'pluralOmastav',
            pluralOmastavValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setPluralOmastav(pluralOmastavValue)
        setValue(
            'singularOsastav',
            singularOsastavValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setSingularOsastav(singularOsastavValue)
        setValue(
            'pluralOsastav',
            pluralOsastavValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setPluralOsastav(pluralOsastavValue)
        setValue(
            'shortForm',
            shortFormValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setShortForm(shortFormValue)
    }

    // This will only be run on first render
    // we use it to populate the form fields with the previously added information
    useEffect(() => {
        if(currentTranslationData.cases!){
            setValuesInForm(currentTranslationData)
        }
    },[])


    // ------------------ AUTOCOMPLETE LOGIC ------------------

    const onAutocompleteClick = async () => {
        const completeFormWithAutocomplete = {
            ...autocompletedTranslationNounEE,
            // NB! These fields are not included in BE autocomplete response, so we must manually include
            cases: [
                ...autocompletedTranslationNounEE.cases,
                {
                    caseName: VerbCases.regularityEE,
                    word: regularity
                },
            ]
        }
        setValuesInForm(completeFormWithAutocomplete)
        setSearchInEnglish(false)
    }

    useEffect(() => {
        if(singularNimetav !== ""){
            setTimerTriggerFunction(
                () => {
                    dispatch(getAutocompletedEstonianNounData({
                        query: singularNimetav.toLowerCase(),
                        searchInEnglish: searchInEnglish
                    }))
                },
                600
            )
        }
    },[singularNimetav])

    return(
        <Grid
            container={true}
        >
            <form
                style={{
                    width: '100%'
                }}
            >
                <Grid
                    container={true}
                    justifyContent={"left"}
                    item={true}
                    spacing={2}
                >
                    {!(props.displayOnly) &&
                        <Grid
                            container={true}
                            item={true}
                            xs={12}
                            rowSpacing={1}
                            spacing={1}
                            justifyContent={'center'}
                            alignItems={"flex-end"}
                        >
                            <AutocompleteButtonWithStatus
                                tooltipLabels={{
                                    emptyQuery: t('wordForm.autocompleteTranslationButton.emptyQuery', { ns: 'wordRelated', requiredField: "Ainsus nimetav" }),
                                    noMatch: t('wordForm.autocompleteTranslationButton.noMatch', { ns: 'wordRelated' }),
                                    foundMatch: t('wordForm.autocompleteTranslationButton.foundMatch', { ns: 'wordRelated' }),
                                }}
                                actionButtonLabel={t('wordForm.autocompleteTranslationButton.label', { ns: 'wordRelated', wordType: "" })}
                                queryValue={singularNimetav}
                                autocompleteResponse={autocompletedTranslationNounEE}
                                loadingState={isLoadingAT}
                                onAutocompleteClick={() => onAutocompleteClick()}
                                sxProps={{
                                    marginRight: globalTheme.spacing(2)
                                }}
                            />
                            <FormControlLabel
                                value="end"
                                control={
                                    <Tooltip
                                        title={t('wordForm.noun.errors.formEE.searchInEnglishWarning', { ns: 'wordRelated' })}
                                    >
                                        <Checkbox
                                            checked={searchInEnglish}
                                            onChange={(event: React.ChangeEvent) => {
                                                //@ts-ignore
                                                setSearchInEnglish(event.target.checked)
                                            }}
                                        />
                                    </Tooltip>
                                }
                                label={t('wordForm.noun.errors.formEE.searchInEnglishLabel', { ns: 'wordRelated' })}
                                labelPlacement="end"
                            />
                            <Grid
                                item={true}
                                xs
                                sx={{
                                    maxHeight: 'max-content'
                                }}
                            >
                                {(isLoadingAT) && <LinearIndeterminate/>}
                            </Grid>
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, regularity)) &&
                        <Grid
                            container={true}
                            item={true}
                            xs={12}
                        >
                            <Grid
                                item={true}
                                xs={'auto'}
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
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, singularNimetav)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Ainsus nimetav"}
                                name={"singularNimetav"}
                                defaultValue={""}
                                errors={errors.singularNimetav}
                                onChange={(value: any) => {
                                    setSingularNimetav(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, pluralNimetav)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Mitmus nimetav"}
                                name={"pluralNimetav"}
                                defaultValue={""}
                                errors={errors.pluralNimetav}
                                onChange={(value: any) => {
                                    setPluralNimetav(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, singularOmastav)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Ainsus omastav"}
                                name={"singularOmastav"}
                                defaultValue={""}
                                errors={errors.singularOmastav}
                                onChange={(value: any) => {
                                    setSingularOmastav(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, pluralOmastav)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Mitmus omastav"}
                                name={"pluralOmastav"}
                                defaultValue={""}
                                errors={errors.pluralOmastav}
                                onChange={(value: any) => {
                                    setPluralOmastav(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, singularOsastav)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Ainsus osastav"}
                                name={"singularOsastav"}
                                defaultValue={""}
                                errors={errors.singularOsastav}
                                onChange={(value: any) => {
                                    setSingularOsastav(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, pluralOsastav)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Mitmus osastav"}
                                name={"pluralOsastav"}
                                defaultValue={""}
                                errors={errors.pluralOsastav}
                                onChange={(value: any) => {
                                    setPluralOsastav(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {/*
                        TODO: add a checkbox to specify that this field is not required?
                         So loading circle in table-cell can be set as full
                    */}
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, shortForm)) &&
                        <Grid
                            item={true}
                            xs={6}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Lühike sisseütlev"}
                                name={"shortForm"}
                                defaultValue={""}
                                errors={errors.shortForm}
                                onChange={(value: any) => {
                                    setShortForm(value)
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