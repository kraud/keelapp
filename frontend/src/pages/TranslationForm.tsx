import {Button, Grid, TextField, Typography} from "@mui/material";
import globalTheme from "../theme/theme";
import React, {useEffect, useState} from "react";
import {WordFormGeneric} from "../components/WordFormGeneric";
import {NounItem, TranslationItem, WordData} from "../ts/interfaces";
import {Lang, PartOfSpeech} from "../ts/enums";
import {useSelector} from "react-redux";
import LinearIndeterminate from "../components/Spinner";
import {toast, Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    // const [completeWordData, setCompleteWordData] = useState<WordData>({translations: []})
    const [completeWordData, setCompleteWordData] = useState<WordData>(
        {
            translations: [
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
        const updatedTranslations = [
            ...selectedLanguagesList.slice(0, index),
            updatedTranslation,
            ...selectedLanguagesList.slice(index + 1),
        ]
        setUpdatedList(updatedTranslations)
    }

    // This simply creates the new list of selected languages, by removing the language that used to be selected on the form
    const removeLanguageFromSelected = (index: number, willUpdateLanguage: boolean) => {
        const updatedTranslationsToBeUpdated = [
            ...completeWordData.translations.slice(0, index),
            // this needed as a placeholder while we get the new selected language, so index is the same
            Object as unknown as TranslationItem, // not needed when full removing?
            ...completeWordData.translations.slice(index + 1),
        ]
        const updatedTranslationsFinal = [
            ...completeWordData.translations.slice(0, index),
            ...completeWordData.translations.slice(index + 1),
        ]
        setCompleteWordData({
            ...completeWordData,
            translations: (willUpdateLanguage)
                // If we're simply switching languages for the form, we need to save the index place with an empty object
                // which will be replaced with the data from the newly selected language's form
                ? updatedTranslationsToBeUpdated
                // this way we don't "save" the place at index,
                // because we're not updating the language
                : updatedTranslationsFinal
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

    const getAllPartsOfSpeech = () => {
        const partsOfSpeech: string[] = (Object.values(PartOfSpeech).filter((v) => isNaN(Number(v))) as unknown as Array<keyof typeof Lang>)
        return(partsOfSpeech)
    }

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
                <Grid
                    container={true}
                    spacing={3}
                >
                    {(getAllPartsOfSpeech()).map((part: string, index: number) => {
                        return(
                            <Grid
                                item={true}
                                key={index}
                            >
                                <Button
                                    variant={"contained"}
                                    onClick={() => setPartOfSpeech((part as PartOfSpeech))}
                                    disabled={part !== "Noun"} // TODO: make this depend on a list of implemented forms
                                >
                                    {part}
                                </Button>
                            </Grid>
                            )
                    })}
                </Grid>
                :
                <Grid
                    container={true}
                    spacing={4}
                    direction={"column"}
                    alignItems={"center"}
                >
                    <Grid
                        item={true}
                        sx={{
                            marginTop: globalTheme.spacing(6),
                        }}
                    >
                        <Typography
                            variant={"h2"}
                        >
                            Add a new word
                        </Typography>
                        <Typography
                            variant={"subtitle2"}
                            align={"center"}
                        >
                            Please fill all required fields (*) before saving
                        </Typography>
                    </Grid>
                    <Grid
                        item={true}
                    >
                        <Button
                            variant={"outlined"}
                            color={"error"}
                            onClick={() => resetAll()}
                        >
                            Reset
                        </Button>
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
                    {
                        completeWordData.translations.map((_, index) => {
                            return(
                                <WordFormGeneric
                                    key={index}
                                    index={index}
                                    partOfSpeech={partOfSpeech}
                                    availableLanguages={availableLanguages}

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
                    {
                        ((completeWordData.translations).length > 1) &&
                        <Grid
                            item={true}
                        >
                            <TextField
                                label={"Clue"}
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
                    }
                    {/* BUTTONS */}
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
                                    availableLanguages.length === 0
                                )}
                            >
                                Add another translation
                            </Button>
                        </Grid>
                        <Grid
                            item={true}
                        >
                            <Button
                                onClick={() => sanitizeDataForStorage()}
                                variant={"outlined"}
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
                </Grid>}
        </>
    )
}