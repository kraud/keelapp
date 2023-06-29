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
    const [completeWordData, setCompleteWordData] = useState<WordData>({translations: []})

    // This function is used to update the list of currently selected languages and their status
    // It basically checks if the new data received corresponds to a language already stored.
    // If so, it updates the info. If not, it appends it to the list.
    const editTranslationsData = (
        newLanguageData: {
            language: Lang
        },
        selectedLanguagesList: { language: Lang }[],
        setUpdatedList: (updatedList: any[]) => void
    ) => {
        let updated: boolean = false // will be used to check if the current language is already one of the stored translations
        if(selectedLanguagesList.length > 0){
            const updatedSelectedLanguages = selectedLanguagesList.map((selectedLang) => {
                // we found the current language, and we update the entry on the list
                if(selectedLang.language === newLanguageData.language) {
                    updated = true // we trigger the flag to know that the language was found and updated
                    return({
                        ...newLanguageData
                    })
                } else { // if it doesn't match, we leave the translation data as is
                    return(selectedLang)
                }
            })
            if(updated) {
                setUpdatedList(updatedSelectedLanguages) // if the list now has the updated info about of translation, we simply save it
            } else { // assuming it's a new entry we append to the end of the existing list of translations
                // TODO: if it's a new entry, and *there's only one other*, we must replace the Object at the 2nd index
                setUpdatedList([
                    ...selectedLanguagesList,
                    {
                        ...newLanguageData
                    }
                ])
            }
        } else {
            // If there is no languages yet selected, we simply add it to the list as the first item
            setUpdatedList([{
                ...newLanguageData
                // TODO: language data goes in first one - second one should still be an Object
            }])
        }
    }

    const removeLanguageFromSelected = (langToRemoveFromList: Lang) => {
        let newSelected: TranslationItem[] = []
        completeWordData.translations.forEach((alreadySelectedLang: TranslationItem) => {
            if(alreadySelectedLang.language === langToRemoveFromList){
                return
            } else {
                newSelected.push(alreadySelectedLang)
            }
        })
        setCompleteWordData({
            ...completeWordData,
            translations: getFilteredTranslations(completeWordData.translations, newSelected)
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

    const [amountFormsOnScreen, setAmountFormsOnScreen] = useState(2)

    const getAllPartsOfSpeech = () => {
        const partsOfSpeech: string[] = (Object.values(PartOfSpeech).filter((v) => isNaN(Number(v))) as unknown as Array<keyof typeof Lang>)
        return(partsOfSpeech)
    }

    const setAvailableLanguagesList = () => {
        const allLangs: string[] = (Object.values(Lang).filter((v) => isNaN(Number(v))) as unknown as Array<keyof typeof Lang>)
        let filteredLangs: Lang[] = []
        if((completeWordData.translations).length > 0){
            const selectedLangs: string[] = (completeWordData.translations).map((alreadySelectedLanguage) => {
                return((alreadySelectedLanguage.language).toString())
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
        // TODO: will use this when implementing new changes for dynamically updating amount of forms on screen
        /*
        setCompleteWordData(
            {
                translations: [
                    Object as unknown as TranslationItem,
                    Object as unknown as TranslationItem,
                ]
            })
            */
        setAmountFormsOnScreen(2)
    }

    // When switching languages on an open form, the WordFomGeneric child component will try to update
    // the completeWordData state here, but since we already deleted
    function getFilteredTranslations(
        outdatedTranslations: TranslationItem[],
        upToDateList: {
            language: Lang,
            isValidFormStatus?: boolean
        }[]
    ) {
        const selectedLangs = upToDateList.map((selectedLang) => selectedLang.language)
        const filteredTranslations: TranslationItem[] = []
        outdatedTranslations.forEach((unverifiedTranslation) => {
                if(selectedLangs.includes(unverifiedTranslation.language)){
                    filteredTranslations.push(unverifiedTranslation)
                } else {
                    return
                }
            })
        return(filteredTranslations)
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
                        Array(amountFormsOnScreen).fill(0).map((_, index) => {
                            return(
                                <WordFormGeneric
                                    removeForm={() => {
                                        if(amountFormsOnScreen > 2){
                                            setAmountFormsOnScreen(amountFormsOnScreen - 1)
                                        }
                                    }}
                                    key={index}
                                    partOfSpeech={partOfSpeech}
                                    availableLanguages={availableLanguages}
                                    removeLanguageFromSelected={(langToRemoveFromList: Lang) => removeLanguageFromSelected(langToRemoveFromList)}

                                    updateFormData={(formData: {
                                        language: Lang,
                                        cases?: NounItem[],
                                        completionState?: boolean
                                    }) => {
                                        editTranslationsData(
                                            formData,
                                                completeWordData.translations,
                                                (updatedList) => {
                                                    setCompleteWordData({
                                                        ...completeWordData,
                                                        translations: updatedList
                                                    })
                                                }
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
                                onClick={() => setAmountFormsOnScreen((amountFormsOnScreen + 1))}
                                variant={"outlined"}
                                disabled={( // only true when all the languages are being used
                                    (Object.values(Lang).filter((v) => isNaN(Number(v))) as unknown as Array<keyof typeof Lang>).length
                                    <=
                                    (completeWordData.translations).length
                                )}
                            >
                                Add another translation
                            </Button>
                        </Grid>
                        <Grid
                            item={true}
                        >
                            <Button
                                onClick={() => {
                                    props.onSave({
                                        ...completeWordData,
                                        partOfSpeech: partOfSpeech
                                    })
                                }}
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