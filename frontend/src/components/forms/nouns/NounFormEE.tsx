import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Checkbox, Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {TranslationItem, WordItem} from "../../../ts/interfaces";
import {Lang, NounCases} from "../../../ts/enums";
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

interface NounFormEEProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the estonian translation of a noun (and handles the validations)
export function NounFormEE(props: NounFormEEProps) {
    const dispatch = useDispatch<AppDispatch>()
    const {autocompletedTranslationNounEE, isErrorAT, isSuccessAT, isLoadingAT, messageAT} = useSelector((state: any) => state.autocompletedTranslations)
    const [searchInEnglish, setSearchInEnglish] = useState(false)


    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        singularNimetav: Yup.string()
            .required("Singular nimetav is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        pluralNimetav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        singularOmastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        pluralOmastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        singularOsastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        pluralOsastav: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        shortForm: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

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
                caseName: NounCases.singularNimetavEE,
                word: singularNimetav
            },
            {
                caseName: NounCases.pluralNimetavEE,
                word: pluralNimetav
            },
            {
                caseName: NounCases.singularOmastavEE,
                word: singularOmastav
            },
            {
                caseName: NounCases.pluralOmastavEE,
                word: pluralOmastav
            },
            {
                caseName: NounCases.singularOsastavEE,
                word: singularOsastav
            },
            {
                caseName: NounCases.pluralOsastavEE,
                word: pluralOsastav
            },
            {
                caseName: NounCases.shortFormEE,
                word: shortForm
            },
        ]
        props.updateFormData({
            language: Lang.EE,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [
        singularNimetav, pluralNimetav, singularOmastav, pluralOmastav, singularOsastav,
        pluralOsastav, shortForm, isValid,
    ])

    const setValuesInForm = (translationDataToInsert: TranslationItem) => {
        const singularNimetavValue: string = getWordByCase(NounCases.singularNimetavEE, translationDataToInsert)
        const pluralNimetavValue: string = getWordByCase(NounCases.pluralNimetavEE, translationDataToInsert)
        const singularOmastavValue: string = getWordByCase(NounCases.singularOmastavEE, translationDataToInsert)
        const pluralOmastavValue: string = getWordByCase(NounCases.pluralOmastavEE, translationDataToInsert)
        const singularOsastavValue: string = getWordByCase(NounCases.singularOsastavEE, translationDataToInsert)
        const pluralOsastavValue: string = getWordByCase(NounCases.pluralOsastavEE, translationDataToInsert)
        const shortFormValue: string = getWordByCase(NounCases.shortFormEE, translationDataToInsert)
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
        setValuesInForm(autocompletedTranslationNounEE)
        setSearchInEnglish(false)
    }

    useEffect(() => {
        if(singularNimetav !== ""){
            setTimerTriggerFunction(
                () => {
                    dispatch(getAutocompletedEstonianNounData({
                        query: singularNimetav,
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
                                    emptyQuery: "Please input 'Ainsus nimetav' first.",
                                    noMatch: "Sorry, we don't know this word!",
                                    foundMatch: "There is information about this word stored in our system."
                                }}
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
                                    <Checkbox
                                        checked={searchInEnglish}
                                        onChange={(event: React.ChangeEvent) => {
                                            //@ts-ignore
                                            setSearchInEnglish(event.target.checked)
                                        }}
                                    />
                                }
                                label="Search in english"
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