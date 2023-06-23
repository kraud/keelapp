import {Button, Grid, Typography} from "@mui/material";
import globalTheme from "../theme/theme";
import React, {useEffect, useState} from "react";
import {Lang, TranslationItem, WordData, WordFormGeneric} from "../components/WordFormGeneric";


export function TranslationForm() {

    // Languages currently in use for this word
    const [selectedLanguages, setSelectedLanguages] = useState<
        {
            language: Lang,
            formComplete: boolean
        }[]
    >([])
    // Languages currently NOT in use for this word
    const [availableLanguages, setAvailableLanguages] = useState<Lang[]>([])

    // object containing all the translations and extra info about the word
    const [completeWordData, setCompleteWordData] = useState<WordData[]>([])

    // Save changes to the list of the current word's translation
    const editTranslationData = (
        langData: {
            lang: Lang,
            isComplete: boolean, // calculated by the specific language form
            // index: number // -1 represents new entry, other number mean index to replace
        }
    ) => {
        // Check if langData.lang is already included - if so edit
        let updated: boolean = false // to check if the current language is already one of the stored translations
        if(selectedLanguages.length > 0){
            const updatedSelectedLanguages = selectedLanguages.map((selectedLang) => {
                // we found the current language, and we update the entry on the list
                if(selectedLang.language === langData.lang) {
                    updated = true // we trigger the flag to know that the language was found and updated
                    return({
                        language: selectedLang.language,
                        formComplete: langData.isComplete
                    })
                } else { // if it doesn't match, we leave the translation data as is
                    console.log("ELSE SMALL 1")
                    return(selectedLang)
                }
            })
            console.log("updated VALUE:")
            console.log(updated)
            if(updated) {
                setSelectedLanguages(updatedSelectedLanguages) // if the list now has the updated info about of translation, we simply save it
            } else { // assuming it's a new entry we append to the end of the existing list of translations
                console.log("ELSE SMALL 2")
                setSelectedLanguages([
                    ...selectedLanguages,
                    {
                        language: langData.lang,
                        formComplete: langData.isComplete
                    }
                ])
            }
        } else {
            console.log("ELSE BIG")
            // If there is no languages yet selected, we simply add it to the list as the first item
            setSelectedLanguages([{
                language: langData.lang,
                formComplete: langData.isComplete
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
        console.log("selectedLanguages")
        console.log(selectedLanguages)
        setAvailableLanguagesList()
        // console.log("getAvailableLanguages()")
        // console.log(getAvailableLanguages())
    }, [selectedLanguages])

    const setAvailableLanguagesList = () => {
        const allLangs: string[] = (Object.values(Lang).filter((v) => isNaN(Number(v))) as unknown as Array<keyof typeof Lang>)
        let filteredLangs: Lang[] = []
        if(selectedLanguages.length > 0){
            const selectedLangs: string[] = selectedLanguages.map((alreadySelectedLanguage) => {
                return((alreadySelectedLanguage.language).toString())
            })
            console.log("selectedLangs (inside)")
            console.log(selectedLangs)
            console.log("allLangs (inside)")
            console.log(allLangs)
            const availableLangs: string[] = allLangs.filter((currentLang: string) => {
                return(!selectedLangs.includes(currentLang))
            })
            // We return the data with the expected format
            filteredLangs = availableLangs.map(lang => {
                return (lang as unknown as Lang) // TODO: double check if this won't cause trouble later on
            })
        } else {
            filteredLangs = allLangs.map(lang => {
                return (lang as unknown as Lang) // TODO: double check if this won't cause trouble later on
            })
        }
        console.log("filteredLangs")
        console.log(filteredLangs)
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
            {/* TODO: find a way to express this without repeating so much code*/}
            {/* REQUIRED, FIRST LANGUAGE */}
            <WordFormGeneric
                availableLangs={availableLanguages}
                setTranslation={(translationData) => {
                    editTranslationData(translationData)
                }}
                removeLangFromUse={(langNowAvailable: Lang)=> removeLanguageFromSelected(langNowAvailable)}
                giveTranslation={(translation: TranslationItem) => {
                    console.log("translation to save (1)")
                    console.log(translation)
                }}
            />
            {/* REQUIRED, SECOND LANGUAGE */}
            <WordFormGeneric
                availableLangs={availableLanguages}
                setTranslation={(translationData) => {
                    editTranslationData(translationData)
                }}
                removeLangFromUse={(langNowAvailable: Lang)=> removeLanguageFromSelected(langNowAvailable)}
                giveTranslation={(translation: TranslationItem) => {
                    console.log("translation to save (2)")
                    console.log(translation)
                }}
            />
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
                        onClick={() => console.log("SUBMIT!")}
                        variant={"outlined"}
                        disabled={
                            (selectedLanguages.length < 1)
                            ||
                            ((selectedLanguages.filter((selectedLang) => {
                                return (!selectedLang.formComplete)
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