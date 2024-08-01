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
import {getAutocompletedSpanishVerbData} from "../../../features/autocompletedTranslation/autocompletedTranslationSlice";
import LinearIndeterminate from "../../Spinner";
import {setTimerTriggerFunction} from "../../generalUseFunctions";
import {AutocompleteButtonWithStatus} from "../AutocompleteButtonWithStatus";
import Typography from "@mui/material/Typography";

interface VerbFormESProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the estonian translation of a verb (and handles the validations)
export function VerbFormES(props: VerbFormESProps) {
    const dispatch = useDispatch<AppDispatch>()
    const {autocompletedTranslationVerbES, isErrorAT, isSuccessAT, isLoadingAT, messageAT} = useSelector((state: any) => state.autocompletedTranslations)

    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        infinitiveNonFiniteSimple: Yup.string()
            .required("Infinitive non-finite is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers')
            .matches(/^(?!.*\d).*(ar|er|ir)$/, "Please input infinitive form (ends in '-ar', '-er' or '-ir'."),
        gerundNonFiniteSimple: Yup.string()
            .required("Gerund non-finite is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        participleNonFiniteSimple: Yup.string()
            .required("Participle non-finite is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
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
    const [infinitiveNonFiniteSimple, setInfinitiveNonFiniteSimple] = useState("")
    const [gerundNonFiniteSimple, setGerundNonFiniteSimple] = useState("")
    const [participleNonFiniteSimple, setParticipleNonFiniteSimple] = useState("")
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
                caseName: VerbCases.infinitiveNonFiniteSimpleES,
                word: infinitiveNonFiniteSimple
            },
            {
                caseName: VerbCases.gerundNonFiniteSimpleES,
                word: gerundNonFiniteSimple
            },
            {
                caseName: VerbCases.participleNonFiniteSimpleES,
                word: participleNonFiniteSimple
            },
            {
                caseName: VerbCases.indicativePresent1sES,
                word: indicativePresent1s
            },
            {
                caseName: VerbCases.indicativePresent2sES,
                word: indicativePresent2s
            },
            {
                caseName: VerbCases.indicativePresent3sES,
                word: indicativePresent3s
            },
            {
                caseName: VerbCases.indicativePresent1plES,
                word: indicativePresent1pl
            },
            {
                caseName: VerbCases.indicativePresent2plES,
                word: indicativePresent2pl
            },
            {
                caseName: VerbCases.indicativePresent3plES,
                word: indicativePresent3pl
            },
        ]
        props.updateFormData({
            language: Lang.ES,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [
        infinitiveNonFiniteSimple, gerundNonFiniteSimple, participleNonFiniteSimple,
        indicativePresent1s, indicativePresent2s, indicativePresent3s, indicativePresent1pl,
        indicativePresent2pl, indicativePresent3pl, isValid
    ])

    const setValuesInForm = (translationDataToInsert: TranslationItem) => {
        console.log('translationDataToInsert', translationDataToInsert)
        const infinitiveNonFiniteSimpleValue: string = getWordByCase(VerbCases.infinitiveNonFiniteSimpleES, translationDataToInsert)
        const gerundNonFiniteSimpleValue: string = getWordByCase(VerbCases.gerundNonFiniteSimpleES, translationDataToInsert)
        const participleNonFiniteSimpleValue: string = getWordByCase(VerbCases.participleNonFiniteSimpleES, translationDataToInsert)

        const indicativePresent1sValue: string = getWordByCase(VerbCases.indicativePresent1sES, translationDataToInsert)
        const indicativePresent2sValue: string = getWordByCase(VerbCases.indicativePresent2sES, translationDataToInsert)
        const indicativePresent3sValue: string = getWordByCase(VerbCases.indicativePresent3sES, translationDataToInsert)
        const indicativePresent1plValue: string = getWordByCase(VerbCases.indicativePresent1plES, translationDataToInsert)
        const indicativePresent2plValue: string = getWordByCase(VerbCases.indicativePresent2plES, translationDataToInsert)
        const indicativePresent3plValue: string = getWordByCase(VerbCases.indicativePresent3plES, translationDataToInsert)

        setValue(
            'infinitiveNonFiniteSimple',
            infinitiveNonFiniteSimpleValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setInfinitiveNonFiniteSimple(infinitiveNonFiniteSimpleValue)
        setValue(
            'gerundNonFiniteSimple',
            gerundNonFiniteSimpleValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setGerundNonFiniteSimple(gerundNonFiniteSimpleValue)
        setValue(
            'participleNonFiniteSimple',
            participleNonFiniteSimpleValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setParticipleNonFiniteSimple(participleNonFiniteSimpleValue)
        // optional fields:
        setValue(
            'indicativePresent1s',
            indicativePresent1sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setParticipleNonFiniteSimple(indicativePresent1sValue)
        setValue(
            'indicativePresent2s',
            indicativePresent2sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setParticipleNonFiniteSimple(indicativePresent2sValue)
        setValue(
            'indicativePresent3s',
            indicativePresent3sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setParticipleNonFiniteSimple(indicativePresent3sValue)
        setValue(
            'indicativePresent1pl',
            indicativePresent1plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setParticipleNonFiniteSimple(indicativePresent1plValue)
        setValue(
            'indicativePresent2pl',
            indicativePresent2plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setParticipleNonFiniteSimple(indicativePresent2plValue)
        setValue(
            'indicativePresent3pl',
            indicativePresent3plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setParticipleNonFiniteSimple(indicativePresent3plValue)
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
            ...autocompletedTranslationVerbES,
            cases: [
                ...autocompletedTranslationVerbES.cases,
                {
                    caseName: VerbCases.infinitiveNonFiniteSimpleES,
                    word: infinitiveNonFiniteSimple
                },
                {
                    caseName: VerbCases.gerundNonFiniteSimpleES,
                    word: gerundNonFiniteSimple
                },
                {
                    caseName: VerbCases.participleNonFiniteSimpleES,
                    word: participleNonFiniteSimple
                }
            ]
        }
        setValuesInForm(completeFormWithAutocomplete)
    }

    // before making the request, we check if the query is correct according to the form's validation
    const validAutocompleteRequest = errors['infinitiveNonFiniteSimple'] === undefined
    useEffect(() => {
        if((infinitiveNonFiniteSimple !== "") && (validAutocompleteRequest)){
            setTimerTriggerFunction(
                () => {
                    dispatch(getAutocompletedSpanishVerbData(infinitiveNonFiniteSimple))
                },
                600
            )
        }
    },[infinitiveNonFiniteSimple, validAutocompleteRequest])

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
                                queryValue={infinitiveNonFiniteSimple}
                                autocompleteResponse={autocompletedTranslationVerbES}
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
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, infinitiveNonFiniteSimple)) &&
                        <Grid
                            item={true}
                            xs={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Infinitive non-finite simple"}
                                name={"infinitiveNonFiniteSimple"}
                                defaultValue={""}
                                errors={errors.infinitiveNonFiniteSimple}
                                onChange={(value: any) => {
                                    setInfinitiveNonFiniteSimple(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, gerundNonFiniteSimple)) &&
                        <Grid
                            item={true}
                            xs={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Gerund non-finite simple"}
                                name={"gerundNonFiniteSimple"}
                                defaultValue={""}
                                errors={errors.gerundNonFiniteSimple}
                                onChange={(value: any) => {
                                    setGerundNonFiniteSimple(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, participleNonFiniteSimple)) &&
                        <Grid
                            item={true}
                            xs={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Participle non-finite simple"}
                                name={"participleNonFiniteSimple"}
                                defaultValue={""}
                                errors={errors.participleNonFiniteSimple}
                                onChange={(value: any) => {
                                    setParticipleNonFiniteSimple(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {/* OPTIONAL FIELDS */}
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
                                    Modo indicativo:
                                </Typography>
                            </Grid>
                            <Grid
                                item={true}
                                xs={12}
                            >
                                <Typography
                                    variant={'h5'}
                                >
                                    Tiempo simple:
                                </Typography>
                            </Grid>
                            <Grid
                                item={true}
                                xs={12}
                            >
                                <Typography
                                    variant={'h6'}
                                >
                                    Presente:
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
                                label={"Yo"}
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
                                label={"Vos"} // TODO: should change if user picks other spanish style
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
                                label={"'Él/Ella/eso'"}
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
                                label={"Nosotros/as"}
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
                                label={"Ustedes"} // TODO: should change if user picks other spanish style
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
                                label={"Ellos/as"}
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