import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import {TranslationItem, WordItem} from "../../../ts/interfaces";
import {Lang, VerbCases} from "../../../ts/enums";
import {getDisabledInputFieldDisplayLogic, getWordByCase} from "../commonFunctions";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../../app/store";
import {
    getAutocompletedGermanVerbData,
} from "../../../features/autocompletedTranslation/autocompletedTranslationSlice";
import LinearIndeterminate from "../../Spinner";
import {setTimerTriggerFunction} from "../../generalUseFunctions";
import {AutocompleteButtonWithStatus} from "../AutocompleteButtonWithStatus";
import Typography from "@mui/material/Typography";

interface VerbFormDEProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the estonian translation of a verb (and handles the validations)
export function VerbFormDE(props: VerbFormDEProps) {
    const dispatch = useDispatch<AppDispatch>()
    const {autocompletedTranslationVerbDE, isErrorAT, isSuccessAT, isLoadingAT, messageAT} = useSelector((state: any) => state.autocompletedTranslations)

    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        infinitive: Yup.string()
            .required("Infinitive non-finite is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers')
            .matches(/^(?!.*\d).*(en|ern|eln)$/, "Please input infinitive form (ends in '-en', '-ern' '-eln')."),
        indicativePresent1s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativePresent2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativePresent3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativePresent1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativePresent2pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        indicativePresent3pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    // Mandatory fields: can't be autocompleted
    const [infinitive, setInfinitive] = useState("")
    // Optional fields: can be filled with autocomplete
    // Modo indicativo - tiempo simple - presente
    const [indicativePresent1s, setIndicativePresent1s] = useState("")
    const [indicativePresent2s, setIndicativePresent2s] = useState("")
    const [indicativePresent3s, setIndicativePresent3s] = useState("")
    const [indicativePresent1pl, setIndicativePresent1pl] = useState("")
    const [indicativePresent2pl, setIndicativePresent2pl] = useState("")
    const [indicativePresent3pl, setIndicativePresent3pl] = useState("")

    useEffect(() => {
        const currentCases: WordItem[] = [
            {
                caseName: VerbCases.infinitiveDE,
                word: infinitive
            },
            {
                caseName: VerbCases.indicativePresent1sDE,
                word: indicativePresent1s
            },
            {
                caseName: VerbCases.indicativePresent2sDE,
                word: indicativePresent2s
            },
            {
                caseName: VerbCases.indicativePresent3sDE,
                word: indicativePresent3s
            },
            {
                caseName: VerbCases.indicativePresent1plDE,
                word: indicativePresent1pl
            },
            {
                caseName: VerbCases.indicativePresent2plDE,
                word: indicativePresent2pl
            },
            {
                caseName: VerbCases.indicativePresent3plDE,
                word: indicativePresent3pl
            },
        ]
        props.updateFormData({
            language: Lang.DE,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [
        infinitive, indicativePresent1s, indicativePresent2s, indicativePresent3s,
        indicativePresent1pl, indicativePresent2pl, indicativePresent3pl, isValid
    ])

    const setValuesInForm = (translationDataToInsert: TranslationItem) => {
        const infinitiveValue: string = getWordByCase(VerbCases.infinitiveDE, translationDataToInsert)

        const indicativePresent1sValue: string = getWordByCase(VerbCases.indicativePresent1sDE, translationDataToInsert)
        const indicativePresent2sValue: string = getWordByCase(VerbCases.indicativePresent2sDE, translationDataToInsert)
        const indicativePresent3sValue: string = getWordByCase(VerbCases.indicativePresent3sDE, translationDataToInsert)
        const indicativePresent1plValue: string = getWordByCase(VerbCases.indicativePresent1plDE, translationDataToInsert)
        const indicativePresent2plValue: string = getWordByCase(VerbCases.indicativePresent2plDE, translationDataToInsert)
        const indicativePresent3plValue: string = getWordByCase(VerbCases.indicativePresent3plDE, translationDataToInsert)

        setValue(
            'infinitive',
            infinitiveValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setInfinitive(infinitiveValue)
        setValue(
            'indicativePresent1s',
            indicativePresent1sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePresent1s(indicativePresent1sValue)
        setValue(
            'indicativePresent2s',
            indicativePresent2sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePresent2s(indicativePresent2sValue)
        setValue(
            'indicativePresent3s',
            indicativePresent3sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePresent3s(indicativePresent3sValue)
        setValue(
            'indicativePresent1pl',
            indicativePresent1plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePresent1pl(indicativePresent1plValue)
        setValue(
            'indicativePresent2pl',
            indicativePresent2plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePresent2pl(indicativePresent2plValue)
        setValue(
            'indicativePresent3pl',
            indicativePresent3plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setIndicativePresent3pl(indicativePresent3plValue)
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
            ...autocompletedTranslationVerbDE,
            // NB! These fields are not included in BE autocomplete response, so we must manually include
            cases: [
                ...autocompletedTranslationVerbDE.cases,
                {
                    caseName: VerbCases.infinitiveDE,
                    word: infinitive
                },
            ]
        }
        setValuesInForm(completeFormWithAutocomplete)
    }

    // before making the request, we check if the query is correct according to the form's validation
    const validAutocompleteRequest = errors['infinitive'] === undefined
    useEffect(() => {
        if((infinitive !== "") && (validAutocompleteRequest)){
            setTimerTriggerFunction(
                () => {
                    dispatch(getAutocompletedGermanVerbData(infinitive))
                },
                600
            )
        }
    },[infinitive, validAutocompleteRequest])

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
                                    emptyQuery: "Please input 'infinitive non-finite simple' first.",
                                    noMatch: "Sorry, we don't know this word!",
                                    foundMatch: "There is information about this word stored in our system."
                                }}
                                queryValue={infinitive}
                                autocompleteResponse={autocompletedTranslationVerbDE}
                                loadingState={isLoadingAT}
                                forceDisabled={!validAutocompleteRequest}
                                onAutocompleteClick={() => onAutocompleteClick()}
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
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, infinitive)) &&
                        <Grid
                            item={true}
                            xs={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Infinitive"}
                                name={"infinitive"}
                                defaultValue={""}
                                errors={errors.infinitive}
                                onChange={(value: any) => {
                                    setInfinitive(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {
                        (
                            indicativePresent1s!! || indicativePresent2s!! || indicativePresent3s!! ||
                            indicativePresent1pl!! || indicativePresent2pl!! || indicativePresent3pl!! ||
                            !props.displayOnly
                        ) &&
                        <Grid
                            container={true}
                            item={true}
                            justifyContent={"center"}
                        >
                            <Grid
                                item={true}
                                xs={'auto'}
                            >
                                <Typography
                                    variant={'h4'}
                                    alignContent={'center'}
                                    sx={{
                                        textDecoration: 'underline',
                                    }}
                                >
                                    Indicative:
                                </Typography>
                            </Grid>
                            <Grid
                                item={true}
                                xs={12}
                            >
                                <Typography
                                    variant={'h5'}
                                >
                                    Present:
                                </Typography>
                            </Grid>
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePresent1s)) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={'Ich'}
                                name={"indicativePresent1s"}
                                defaultValue={""}
                                errors={errors.indicativePresent1s}
                                onChange={(value: any) => {
                                    setIndicativePresent1s(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePresent2s)) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={'Du'}
                                name={"indicativePresent2s"}
                                defaultValue={""}
                                errors={errors.indicativePresent2s}
                                onChange={(value: any) => {
                                    setIndicativePresent2s(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePresent3s)) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={'Er/Sie/ist'}
                                name={"indicativePresent3s"}
                                defaultValue={""}
                                errors={errors.indicativePresent3s}
                                onChange={(value: any) => {
                                    setIndicativePresent3s(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePresent1pl)) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={'Wir'}
                                name={"indicativePresent1pl"}
                                defaultValue={""}
                                errors={errors.indicativePresent1pl}
                                onChange={(value: any) => {
                                    setIndicativePresent1pl(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePresent2pl)) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={'Ihr'}
                                name={"indicativePresent2pl"}
                                defaultValue={""}
                                errors={errors.indicativePresent2pl}
                                onChange={(value: any) => {
                                    setIndicativePresent2pl(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, indicativePresent3pl)) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={'Sie'}
                                name={"indicativePresent3pl"}
                                defaultValue={""}
                                errors={errors.indicativePresent3pl}
                                onChange={(value: any) => {
                                    setIndicativePresent3pl(value)
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