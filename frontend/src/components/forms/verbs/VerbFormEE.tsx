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
    getAutocompletedEstonianVerbData,
} from "../../../features/autocompletedTranslation/autocompletedTranslationSlice";
import LinearIndeterminate from "../../Spinner";
import {setTimerTriggerFunction} from "../../generalUseFunctions";
import {AutocompleteButtonWithStatus} from "../AutocompleteButtonWithStatus";
import Typography from "@mui/material/Typography";

interface VerbFormEEProps {
    currentTranslationData: TranslationItem,
    updateFormData: (formData: TranslationItem) => void
    displayOnly?: boolean
}
// Displays the fields required to add the estonian translation of a verb (and handles the validations)
export function VerbFormEE(props: VerbFormEEProps) {
    const dispatch = useDispatch<AppDispatch>()
    const {autocompletedTranslationVerbEE, isErrorAT, isSuccessAT, isLoadingAT, messageAT} = useSelector((state: any) => state.autocompletedTranslations)

    const { currentTranslationData } = props

    const validationSchema = Yup.object().shape({
        infinitiveMa: Yup.string()
            .required("Infinitive non-finite is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers')
            .matches(/^(?!.*\d).*(ma)$/, "Please input infinitive form (ends in '-ma'."),
        infinitiveDa: Yup.string()
            .required("Gerund non-finite is required")
            .matches(/^[^0-9]+$/, 'Must not include numbers'),
        kindelPresent1s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        kindelPresent2s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        kindelPresent3s: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        kindelPresent1pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        kindelPresent2pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
        kindelPresent3pl: Yup.string().nullable()
            .matches(/^[^0-9]+$|^$/, 'Must not include numbers'),
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    // Mandatory fields: can't be autocompleted
    const [infinitiveMa, setInfinitiveMa] = useState("")
    const [infinitiveDa, setInfinitiveDa] = useState("")
    // Optional fields: can be filled with autocomplete
    // Modo indicativo - tiempo simple - presente
    const [kindelPresent1s, setKindelPresent1s] = useState("")
    const [kindelPresent2s, setKindelPresent2s] = useState("")
    const [kindelPresent3s, setKindelPresent3s] = useState("")
    const [kindelPresent1pl, setKindelPresent1pl] = useState("")
    const [kindelPresent2pl, setKindelPresent2pl] = useState("")
    const [kindelPresent3pl, setKindelPresent3pl] = useState("")

    useEffect(() => {
        const currentCases: WordItem[] = [
            {
                caseName: VerbCases.infinitiveMaEE,
                word: infinitiveMa
            },
            {
                caseName: VerbCases.infinitiveDaEE,
                word: infinitiveDa
            },
            {
                caseName: VerbCases.kindelPresent1sEE,
                word: kindelPresent1s
            },
            {
                caseName: VerbCases.kindelPresent2sEE,
                word: kindelPresent2s
            },
            {
                caseName: VerbCases.kindelPresent3sEE,
                word: kindelPresent3s
            },
            {
                caseName: VerbCases.kindelPresent1plEE,
                word: kindelPresent1pl
            },
            {
                caseName: VerbCases.kindelPresent2plEE,
                word: kindelPresent2pl
            },
            {
                caseName: VerbCases.kindelPresent3plEE,
                word: kindelPresent3pl
            },
        ]
        props.updateFormData({
            language: Lang.EE,
            cases: currentCases,
            completionState: isValid,
            isDirty: isDirty
        })
    }, [
        infinitiveMa, infinitiveDa, kindelPresent1s, kindelPresent2s, kindelPresent3s,
        kindelPresent1pl, kindelPresent2pl, kindelPresent3pl, isValid
    ])

    const setValuesInForm = (translationDataToInsert: TranslationItem) => {
        const infinitiveMaValue: string = getWordByCase(VerbCases.infinitiveMaEE, translationDataToInsert)
        const infinitiveDaValue: string = getWordByCase(VerbCases.infinitiveDaEE, translationDataToInsert)

        const kindelPresent1sValue: string = getWordByCase(VerbCases.kindelPresent1sEE, translationDataToInsert)
        const kindelPresent2sValue: string = getWordByCase(VerbCases.kindelPresent2sEE, translationDataToInsert)
        const kindelPresent3sValue: string = getWordByCase(VerbCases.kindelPresent3sEE, translationDataToInsert)
        const kindelPresent1plValue: string = getWordByCase(VerbCases.kindelPresent1plEE, translationDataToInsert)
        const kindelPresent2plValue: string = getWordByCase(VerbCases.kindelPresent2plEE, translationDataToInsert)
        const kindelPresent3plValue: string = getWordByCase(VerbCases.kindelPresent3plEE, translationDataToInsert)

        setValue(
            'infinitiveMa',
            infinitiveMaValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setInfinitiveMa(infinitiveMaValue)
        setValue(
            'infinitiveDa',
            infinitiveDaValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setInfinitiveDa(infinitiveDaValue)
        setValue(
            'kindelPresent1s',
            kindelPresent1sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPresent1s(kindelPresent1sValue)
        setValue(
            'kindelPresent2s',
            kindelPresent2sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPresent2s(kindelPresent2sValue)
        setValue(
            'kindelPresent3s',
            kindelPresent3sValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPresent3s(kindelPresent3sValue)
        setValue(
            'kindelPresent1pl',
            kindelPresent1plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPresent1pl(kindelPresent1plValue)
        setValue(
            'kindelPresent2pl',
            kindelPresent2plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPresent2pl(kindelPresent2plValue)
        setValue(
            'kindelPresent3pl',
            kindelPresent3plValue,
            {
                shouldValidate: true,
                shouldTouch: true
            }
        )
        setKindelPresent3pl(kindelPresent3plValue)
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
        setValuesInForm(autocompletedTranslationVerbEE)
    }

    // before making the request, we check if the query is correct according to the form's validation
    const validAutocompleteRequest = errors['infinitiveMa'] === undefined
    useEffect(() => {
        if((infinitiveMa !== "") && (validAutocompleteRequest)){
            setTimerTriggerFunction(
                () => {
                    dispatch(getAutocompletedEstonianVerbData(infinitiveMa))
                },
                600
            )
        }
    },[infinitiveMa, validAutocompleteRequest])

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
                                queryValue={infinitiveMa}
                                autocompleteResponse={autocompletedTranslationVerbEE}
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
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, infinitiveMa)) &&
                        <Grid
                            item={true}
                            xs={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"-ma infinitive"}
                                name={"infinitiveMa"}
                                defaultValue={""}
                                errors={errors.infinitiveMa}
                                onChange={(value: any) => {
                                    setInfinitiveMa(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, infinitiveDa)) &&
                        <Grid
                            item={true}
                            xs={4}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"-da infinitive"}
                                name={"infinitiveDa"}
                                defaultValue={""}
                                errors={errors.infinitiveDa}
                                onChange={(value: any) => {
                                    setInfinitiveDa(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {
                        (
                            kindelPresent1s!! || kindelPresent2s!! || kindelPresent3s!! ||
                            kindelPresent1pl!! || kindelPresent2pl!! || kindelPresent3pl!! ||
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
                                    Kindel:
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
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPresent1s)) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={'Mina'}
                                name={"kindelPresent1s"}
                                defaultValue={""}
                                errors={errors.kindelPresent1s}
                                onChange={(value: any) => {
                                    setKindelPresent1s(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPresent2s)) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={'Sina'}
                                name={"kindelPresent2s"}
                                defaultValue={""}
                                errors={errors.kindelPresent2s}
                                onChange={(value: any) => {
                                    setKindelPresent2s(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPresent3s)) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={'Tema'}
                                name={"kindelPresent3s"}
                                defaultValue={""}
                                errors={errors.kindelPresent3s}
                                onChange={(value: any) => {
                                    setKindelPresent3s(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPresent1pl)) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={'Meie'}
                                name={"kindelPresent1pl"}
                                defaultValue={""}
                                errors={errors.kindelPresent1pl}
                                onChange={(value: any) => {
                                    setKindelPresent1pl(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPresent2pl)) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={'Teie'}
                                name={"kindelPresent2pl"}
                                defaultValue={""}
                                errors={errors.kindelPresent2pl}
                                onChange={(value: any) => {
                                    setKindelPresent2pl(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                    }
                    {(getDisabledInputFieldDisplayLogic(props.displayOnly!, kindelPresent3pl)) &&
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={'Nad'}
                                name={"kindelPresent3pl"}
                                defaultValue={""}
                                errors={errors.kindelPresent3pl}
                                onChange={(value: any) => {
                                    setKindelPresent3pl(value)
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