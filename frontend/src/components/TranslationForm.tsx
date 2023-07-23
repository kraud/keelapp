import {Button, Grid, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {WordFormGeneric} from "./WordFormGeneric";
import {NounItem, TranslationItem, WordData} from "../ts/interfaces";
import {Lang, PartOfSpeech} from "../ts/enums";
import {useSelector} from "react-redux";
import LinearIndeterminate from "./Spinner";
import {toast, Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {PartOfSpeechSelector} from "./PartOfSpeechSelector";

interface TranslationFormProps {
    onSave: (wordData: WordData) => void
}

export function TranslationForm(props: TranslationFormProps) {
    const {isSuccess, isLoading} = useSelector((state: any) => state.words)

    // Type of word to be added (noun/verb/adjective/etc.)
    const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech | undefined>(undefined)

    // Languages currently NOT in use for this word - NB! This is calculated automatically, never set directly.
    // It is used by WordFormGeneric to display the correct button-list of available languages
    const [availableLanguages, setAvailableLanguages] = useState<Lang[]>([])

    // object containing all the translations and extra info about the word
    const [completeWordData, setCompleteWordData] = useState<WordData>(
        {
            translations: [ // TODO: check if this could be replaced by some sort of empty TranslationItem instead of Object?
                Object as unknown as TranslationItem,
                Object as unknown as TranslationItem
            ]
        }
    )

    // This function is used to update the list of currently selected languages and their status
    // It basically checks if the new data received corresponds to a language already stored.
    // If so, it updates the info. If not, it appends it to the list.
    const editTranslationsData = (
        newLanguageData: {
            language: Lang
        },
        selectedLanguagesList: { language: Lang }[],
        setUpdatedList: (updatedList: any[]) => void,
        index: number // with this number we know exactly where in selectedLanguageList to input the newLanguageData
    ) => {
        const updatedTranslation = {
            ...selectedLanguagesList[index], // TODO: is this needed? Maybe we have already everything in 'newLanguageData"?
            ...newLanguageData
        }
        // we check for the language in all locations, except at the index (since we know it's there)
        const languageAlreadyListed: boolean = (
            selectedLanguagesList.some((translation: any, indexList) => {
                if(translation.language!){
                    return(
                        (translation.language === updatedTranslation.language)
                        &&
                        (indexList !== index)
                    )
                } else {
                    return false
                }
            })
        )

        if(languageAlreadyListed){
            setUpdatedList(selectedLanguagesList)
        } else {
            const updatedTranslations = [
                ...selectedLanguagesList.slice(0, index),
                updatedTranslation,
                ...selectedLanguagesList.slice(index + 1),
            ]
            setUpdatedList(updatedTranslations)
        }
    }

    // This simply creates the new list of selected languages, by removing the language that used to be selected on the form
    const removeLanguageFromSelected = (index: number, willUpdateLanguage: boolean) => {
        let updatedTranslations: TranslationItem[] = []
        if(willUpdateLanguage){
            // If we're simply switching languages for the form, we need to save the index place with an empty object
            // which will be replaced with the data from the newly selected language's form
            updatedTranslations = [
                ...completeWordData.translations.slice(0, index),
                Object as unknown as TranslationItem,
                ...completeWordData.translations.slice(index + 1),
            ]
        } else {
            // this way we don't "save" the place at index,
            // because we're not updating the language
            updatedTranslations = [
                ...completeWordData.translations.slice(0, index),
                ...completeWordData.translations.slice(index + 1),
            ]
        }
        setCompleteWordData({
            ...completeWordData,
            translations: (updatedTranslations)
        })
    }

    useEffect(() => {
        setAvailableLanguagesList()
    }, [(completeWordData.translations)])


    const toastId = React.useRef(null);
    // @ts-ignore
    const notify = () => toastId.current = toast.info('Saving...', {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
    // @ts-ignore
    const update = () => toast.update(toastId.current, {
        render: "The word was saved successfully!",
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
        transition: Flip,
        delay: 500
    });

    useEffect(() => {
        if(isLoading){
            notify()
        }
    }, [isLoading])

    useEffect(() => {
        if(isSuccess){
            update()
            // once the word has been saved, the form must be reset
            resetAll()
        }
    }, [isSuccess])


    const setAvailableLanguagesList = () => {
        const allLangs: string[] = (Object.values(Lang).filter((v) => isNaN(Number(v))) as unknown as Array<keyof typeof Lang>)
        let filteredLangs: Lang[] = []
        if((completeWordData.translations).length > 0){
            let selectedLangs: string[] = [];
            (completeWordData.translations).forEach((alreadySelectedLanguage: TranslationItem) => {
                if(alreadySelectedLanguage.language!){ // to avoid reading an empty Object Item used to display an empty form
                    selectedLangs.push((alreadySelectedLanguage.language).toString())
                } else {
                    return
                }
            })
            const availableLangs: string[] = allLangs.filter((currentLang: string) => {
                return(!selectedLangs.includes(currentLang))
            })
            // We return the data with the expected format
            filteredLangs = availableLangs.map(lang => {
                return (lang as unknown as Lang)
            })
        } else {
            filteredLangs = allLangs.map(lang => {
                return (lang as unknown as Lang)
            })
        }
        setAvailableLanguages(filteredLangs)
    }

    const resetAll = () => {
        setPartOfSpeech(undefined)
        setCompleteWordData({translations: []})
        setCompleteWordData(
            {
                translations: [
                    Object as unknown as TranslationItem,
                    Object as unknown as TranslationItem,
                ]
            }
        )
    }

    // This will only be accessible if there are at least 2 other forms on screen already
    const addEmptyLanguageForm = () => {
        let oldLanguageList: TranslationItem[] = completeWordData.translations
        oldLanguageList.push(Object as unknown as TranslationItem)
        setCompleteWordData({
            ...completeWordData,
            translations: oldLanguageList
        })
    }

    const sanitizeDataForStorage = () => {
        const cleanData: TranslationItem[] = completeWordData.translations.map((translation: TranslationItem) => {
            // This removes the completionState attribute, used during word-input, but that it should not be saved on BE
            return({
                cases: translation.cases,
                language: translation.language,
            })
        })
        props.onSave({
            ...completeWordData, // optional fields like: clue, askedToReviseSoon, etc.
            translations: cleanData,
            partOfSpeech: partOfSpeech,
        })
    }

    return(
        <>
            {!(partOfSpeech!)
                ?
                <PartOfSpeechSelector
                    setPartOfSpeech={(part: PartOfSpeech) => setPartOfSpeech(part)}
                />
                :
                <Grid
                    container={true}
                    rowSpacing={2}
                    direction={"column"}
                >
                    <Grid
                        item={true}
                        container={true}
                        justifyContent={"center"}
                        rowSpacing={2}
                    >
                        <Grid
                            item={true}
                        >
                            <Typography
                                variant={"h3"}
                            >
                                Add a new word
                            </Typography>
                            <Typography
                                variant={"subtitle2"}
                                align={"center"}
                            >
                                All the required fields must be completed before saving
                            </Typography>
                        </Grid>
                        <Grid
                            item={true}
                            container={true}
                            justifyContent={"center"}
                            spacing={2}
                        >
                            <Grid
                                item={true}
                                xs={4}
                            >
                                <Button
                                    variant={"outlined"}
                                    color={"error"}
                                    onClick={() => resetAll()}
                                    fullWidth={true}
                                >
                                    Reset
                                </Button>
                            </Grid>
                            <Grid
                                item={true}
                                xs={4}
                            >
                                <Button
                                    onClick={() => sanitizeDataForStorage()}
                                    variant={"outlined"}
                                    fullWidth={true}
                                    disabled={
                                        ((completeWordData.translations).length < 2)
                                        ||
                                        (((completeWordData.translations).filter((selectedLang) => {
                                            return (!selectedLang.completionState)
                                        })).length > 0)
                                    }
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    {(isLoading) &&
                        <Grid
                            item={true}
                            container={true}
                            justifyContent={"center"}
                        >
                            <Grid
                                item={true}
                                xs={4}
                            >
                                <LinearIndeterminate/>
                            </Grid>
                        </Grid>
                    }
                    <Grid
                        item={true}
                        container={true}
                        justifyContent={"center"}
                    >
                        {
                            completeWordData.translations.map((translation: TranslationItem, index) => {
                                return(
                                    <WordFormGeneric
                                        key={index}
                                        index={index}
                                        partOfSpeech={partOfSpeech}
                                        availableLanguages={availableLanguages}
                                        currentTranslationData={translation}
                                        amountOfFormsOnScreen={completeWordData.translations.length}

                                        removeLanguageFromSelected={(index: number, willUpdateLanguage: boolean) => {
                                            removeLanguageFromSelected(index, willUpdateLanguage)
                                        }}
                                        updateFormData={(
                                            formData: {
                                                language: Lang,
                                                cases?: NounItem[],
                                                completionState?: boolean
                                            },
                                            index: number
                                        ) => {
                                            editTranslationsData(
                                                formData,
                                                completeWordData.translations,
                                                (updatedList) => {
                                                    setCompleteWordData({
                                                        ...completeWordData,
                                                        translations: updatedList
                                                    })
                                                },
                                                index
                                            )
                                        }}
                                    />
                                )
                            })
                        }
                    </Grid>
                    {/* CLUE */}
                    <Grid
                        item={true}
                        container={true}
                        justifyContent={"center"}
                    >
                        <Grid
                            item={true}
                            xs={12}
                            md={4}
                        >
                            <TextField
                                label={"Clue"}
                                multiline
                                rows={3}
                                value={(completeWordData.clue) ? completeWordData.clue : ""}
                                onChange={(e: any) => {
                                    setCompleteWordData({
                                        ...completeWordData,
                                        clue: e.target.value
                                    })
                                }}
                                fullWidth={true}
                            />
                        </Grid>
                    </Grid>
                    {/* FORM BUTTONS */}
                    <Grid
                        item={true}
                        container={true}
                        spacing={2}
                        justifyContent={"center"}
                    >
                        <Grid
                            item={true}
                        >
                            <Button
                                onClick={() => {
                                    addEmptyLanguageForm()
                                }}
                                variant={"outlined"}
                                disabled={(
                                    // only true when all the languages are being used
                                    (availableLanguages.length === 0)
                                    ||
                                    // or when the maximum amount of translations is reached
                                    (completeWordData.translations.length === 4)
                                )}
                            >
                                Add another translation
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>}
        </>
    )
}