import {Button, Grid, TextField, Typography} from "@mui/material";
import globalTheme from "../theme/theme";
import React, {useEffect, useState} from "react";
import {WordFormGeneric} from "../components/WordFormGeneric";
import {TranslationItem, WordData} from "../ts/interfaces";
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

    // Languages currently in use for this word
    const [selectedLanguages, setSelectedLanguages] = useState<
        {
            language: Lang,
            isValidFormStatus?: boolean
        }[]
    >([])

    // Type of word to be added (noun/verb/adjective/etc.)
    const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech | undefined>(undefined)

    // Languages currently NOT in use for this word - NB! This is calculated automatically, never set directly.
    const [availableLanguages, setAvailableLanguages] = useState<Lang[]>([])

    // object containing all the translations and extra info about the word
    const [completeWordData, setCompleteWordData] = useState<WordData | null>(null)

    // This function is used to update the list of currently selected languages and their status
    // It is also used to update the list of nouns+language combo, with the latest changes from the form
    // It basically checks if the new data received corresponds to a language already stored.
    // If so, it updates the info. If not, it appends it to the list.
    const editTranslationsData = (
        newLanguageData: {
            language: Lang
        },
        existingLanguageList: { language: Lang }[],
        setUpdatedList: (updatedList: any[]) => void
    ) => {
        // Check if newLanguageData.language is already included - if so edit
        let updated: boolean = false // will be used to check if the current language is already one of the stored translations
        if(existingLanguageList.length > 0){
            const updatedSelectedLanguages = existingLanguageList.map((selectedLang) => {
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
                setUpdatedList([
                    ...existingLanguageList,
                    {
                        ...newLanguageData
                    }
                ])
            }
        } else {
            // If there is no languages yet selected, we simply add it to the list as the first item
            setUpdatedList([{
                ...newLanguageData
            }])
        }
    }

    const removeLanguageFromSelected = (langToRemove: Lang) => {
        let newSelected: any[] = []
        selectedLanguages.forEach((alreadySelectedLang) => {
            if(alreadySelectedLang.language === langToRemove){
                return
            } else {
                newSelected.push(alreadySelectedLang)
            }
        })
        setSelectedLanguages(newSelected)
    }

    useEffect(() => {
        setAvailableLanguagesList()
    }, [selectedLanguages])


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

    useEffect(() => {
        console.log("completeWordData")
        console.log(completeWordData)
    }, [completeWordData])

    const [amountFormsOnScreen, setAmountFormsOnScreen] = useState(2)

    const getAllPartsOfSpeech = () => {
        const partsOfSpeech: string[] = (Object.values(PartOfSpeech).filter((v) => isNaN(Number(v))) as unknown as Array<keyof typeof Lang>)
        return(partsOfSpeech)
    }

    const setAvailableLanguagesList = () => {
        const allLangs: string[] = (Object.values(Lang).filter((v) => isNaN(Number(v))) as unknown as Array<keyof typeof Lang>)
        let filteredLangs: Lang[] = []
        if(selectedLanguages.length > 0){
            const selectedLangs: string[] = selectedLanguages.map((alreadySelectedLanguage) => {
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
        setSelectedLanguages([])
        setCompleteWordData(null)
        setAmountFormsOnScreen(2)
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
                                    setTranslationStatus={(translationData) => {
                                        editTranslationsData(
                                            translationData,
                                            selectedLanguages,
                                            (updatedList) => setSelectedLanguages(updatedList)
                                        )
                                    }}
                                    updateCurrentLang={(langNowAvailable: Lang) => removeLanguageFromSelected(langNowAvailable)}
                                    updateTranslationData={(translation: TranslationItem) => {
                                        editTranslationsData(
                                            translation,
                                            (completeWordData!)
                                                ? completeWordData.translations
                                                : [],
                                            (updatedList) => setCompleteWordData({
                                                ...completeWordData!,
                                                translations: updatedList
                                            })
                                        )
                                    }}
                                />
                            )
                        })
                    }
                    {
                        (selectedLanguages.length > 1) &&
                        <Grid
                            item={true}
                        >
                            <TextField
                                label={"Clue"}
                                value={(completeWordData?.clue) ? completeWordData?.clue : ""}
                                onChange={(e: any) => {
                                    setCompleteWordData({
                                        ...completeWordData!,
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
                                    selectedLanguages.length
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
                                    if (completeWordData!) {
                                        props.onSave({
                                            ...completeWordData,
                                            partOfSpeech: partOfSpeech
                                        })
                                    }
                                }}
                                variant={"outlined"}
                                disabled={
                                    (selectedLanguages.length < 2)
                                    ||
                                    ((selectedLanguages.filter((selectedLang) => {
                                        return (!selectedLang.isValidFormStatus)
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