import {Button, Grid, TextField, Typography} from "@mui/material";
import globalTheme from "../theme/theme";
import React, {useEffect, useState} from "react";
import {Lang, TranslationItem, WordData, WordFormGeneric} from "../components/WordFormGeneric";

interface TranslationFormProps {
    onSave: (wordData: WordData) => void
}

export function TranslationForm(props: TranslationFormProps) {

    // Languages currently in use for this word
    const [selectedLanguages, setSelectedLanguages] = useState<
        {
            language: Lang,
            isValidFormStatus?: boolean
        }[]
    >([])
    // Languages currently NOT in use for this word
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

    return(
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
                    align={"center" }
                >
                    Please fill all required fields (*) before saving
                </Typography>
            </Grid>
            {/* TODO: rewrite this - without repeating so much code*/}
            {/* REQUIRED, FIRST LANGUAGE */}
            <WordFormGeneric
                availableLanguages={availableLanguages}
                setTranslationStatus={(translationData) => {
                    editTranslationsData(
                        translationData,
                        selectedLanguages,
                        (updatedList) => setSelectedLanguages(updatedList)
                    )
                }}
                updateCurrentLang={(langNowAvailable: Lang)=> removeLanguageFromSelected(langNowAvailable)}
                updateTranslationData={(translation: TranslationItem) => {
                    editTranslationsData(
                        translation,
                        (completeWordData!)
                            ? completeWordData.translations
                            : [],
                        (updatedList) => setCompleteWordData({
                            ...completeWordData,
                            translations: updatedList
                        })
                    )
                }}
            />
            {/* REQUIRED, SECOND LANGUAGE */}
            <WordFormGeneric
                availableLanguages={availableLanguages}
                setTranslationStatus={(translationData) => {
                    editTranslationsData(
                        translationData,
                        selectedLanguages,
                        (updatedList) => setSelectedLanguages(updatedList)
                    )
                }}
                updateCurrentLang={(langNowAvailable: Lang)=> removeLanguageFromSelected(langNowAvailable)}
                updateTranslationData={(translation: TranslationItem) => {
                    editTranslationsData(
                        translation,
                        (completeWordData!)
                            ? completeWordData.translations
                            : [],
                        (updatedList) => setCompleteWordData({
                            ...completeWordData,
                            translations: updatedList
                        })
                    )
                }}
            />
            {
                (selectedLanguages.length > 1) &&
                    <Grid
                        item={true}
                    >
                        <TextField
                            label={"Clue"}
                            value={(completeWordData?.clue) ? completeWordData?.clue : "" }
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
            {/* TODO: include dynamic addition of more WordFormGeneric for other languages */}
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
                            if(completeWordData!){
                                props.onSave(completeWordData)
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
        </Grid>
    )
}