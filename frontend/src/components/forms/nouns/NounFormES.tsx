import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {WordItem, TranslationItem} from "../../../ts/interfaces";
import {Lang, NounCases, VerbCases} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";
import {RadioGroupWithHook} from "../../RadioGroupFormHook";
import {AutocompleteButtonWithStatus} from "../AutocompleteButtonWithStatus";
import LinearIndeterminate from "../../Spinner";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../../app/store";
import {setTimerTriggerFunction} from "../../generalUseFunctions";
import {
    getAutocompletedEstonianNounData, getAutocompletedSpanishNounGender
} from "../../../features/autocompletedTranslation/autocompletedTranslationSlice";

interface NounFormESProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the spanish translation of a noun (and handles the validations)
export function NounFormES(props: NounFormESProps) {
    const dispatch = useDispatch<AppDispatch>()
    const {autocompletedTranslationNounES, isErrorAT, isSuccessAT, isLoadingAT, messageAT} = useSelector((state: any) => state.autocompletedTranslations)


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


    const setValuesInForm = (translationDataToInsert: TranslationItem) => {
        const singularValue: string = getWordByCase(NounCases.singularES, translationDataToInsert)
        const pluralValue: string = getWordByCase(NounCases.pluralES, translationDataToInsert)
        const genderValue: string = getWordByCase(NounCases.genderES, translationDataToInsert)
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
            ...autocompletedTranslationNounES,
            // NB! These fields are not included in BE autocomplete response, so we must manually include
            cases: [
                ...autocompletedTranslationNounES.cases,
                {
                    caseName: NounCases.singularES,
                    word: singularWord
                },
                {
                    caseName: NounCases.pluralES,
                    word: pluralWord
                },
            ]
        }
        setValuesInForm(completeFormWithAutocomplete)
    }

    useEffect(() => {
        if(singularWord !== ""){
            setTimerTriggerFunction(
                () => {
                    dispatch(getAutocompletedSpanishNounGender(singularWord))
                },
                600
            )
        }
    },[singularWord])

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
                                    emptyQuery: "Please input 'Singular palabra' first.",
                                    noMatch: "Sorry, we don't know this word!",
                                    foundMatch: "There is information about this word stored in our system.",
                                    partialMatch: (isSuccessAT && messageAT !== "") ?messageAT :undefined
                                }}
                                queryValue={singularWord}
                                autocompleteResponse={autocompletedTranslationNounES}
                                loadingState={isLoadingAT}
                                onAutocompleteClick={() => onAutocompleteClick()}
                                actionButtonLabel={'Autocomplete gender'}
                            />
                            <Grid
                                item={true}
                                xs={9}
                                sx={{
                                    maxHeight: 'max-content'
                                }}
                            >
                                {(isLoadingAT) && <LinearIndeterminate/>}
                            </Grid>
                        </Grid>
                    }
                    <Grid
                        item={true}
                        xs={12}
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