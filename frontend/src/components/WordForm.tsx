import {Button, Grid, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TranslationFormGeneric} from "./TranslationFormGeneric";
import {WordItem, TranslationItem, WordData, FilterItem} from "../ts/interfaces";
import {Lang, PartOfSpeech} from "../ts/enums";
import {useDispatch, useSelector} from "react-redux";
import LinearIndeterminate from "./Spinner";
import {toast, Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {PartOfSpeechSelector} from "./PartOfSpeechSelector";
import {AutocompleteMultiple} from "./AutocompleteMultiple";
import {getAllIndividualTagDataFromFilterItem} from "./generalUseFunctions";
import {setSelectedPoS, resetSelectedPoS} from "../features/words/wordSlice";

interface TranslationFormProps {
    onSave: (wordData: WordData) => void,
    initialState?: WordData,
    title: string,
    subTitle: string,
    defaultDisabled?: boolean
    disableEditing?: boolean
}

// stores the complete *Word* Data
export function WordForm(props: TranslationFormProps) {
    const dispatch = useDispatch()
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

    const [disabledForms, setDisabledForms] = useState(false)

    useEffect(() => {
        if((props.defaultDisabled!) || (props.disableEditing!)){
            setDisabledForms(true)
        }
    }, [props.defaultDisabled])

    // In case we're loading an already existing word into the form, we need to set that data into the local state
    useEffect(() => {
        if(props.initialState !== undefined){
            if(props.initialState.translations !== undefined){
                setCompleteWordData({
                    translations: (props.initialState.translations).map((translation: TranslationItem) => {
                        return({
                            ...translation,
                            completionState: true,
                            isDirty: false,
                        })
                    }),
                    partOfSpeech: props.initialState.partOfSpeech,
                    clue: props.initialState.clue,
                    tags: props.initialState.tags
                })
            }
            if(props.initialState.partOfSpeech !== undefined){
                setPartOfSpeech(props.initialState.partOfSpeech as PartOfSpeech)
                //@ts-ignore
                dispatch(setSelectedPoS(props.initialState.partOfSpeech))
            }
        }
    },[props.initialState]) // TODO: should this be [] instead?

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
        if(completeWordData.translations !== undefined){
            setAvailableLanguagesList()
        }
    }, [(completeWordData.translations)])


    const toastId = React.useRef(null);
    // @ts-ignore
    const notify = () => toastId.current = toast.info('Saving...', {
        position: "bottom-right",
        // if initialState exist => saving toast should close automatically, because we're editing a word and success is triggered from calling screen
        // if no initialState => saving should be displayed but not closed, since it'll be replaced by "update" automatically
        autoClose: (props.initialState! !== undefined) ? 3000 : false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    })
    // @ts-ignore
    const update = () => toast.update(toastId.current, {
        render: "The word was saved successfully!",
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
        transition: Flip,
        delay: 500
    })

    useEffect(() => {
        if(isLoading && recentlyModified){ // added recentlyModified to avoid triggering modal when loading Form from another screen
            notify()
            setRecentlyModified(false)
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
        //@ts-ignore
        dispatch(resetSelectedPoS())
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

    const [recentlyModified, setRecentlyModified] = useState(false)
    const sanitizeDataForStorage = () => {
        const cleanData: TranslationItem[] = completeWordData.translations.map((translation: TranslationItem) => {
            // This removes the InternalStatus properties, used during word-input, but that it should not be saved on BE
            return({
                cases: translation.cases,
                language: translation.language,
            })
        })
        setRecentlyModified(true)
        setClueRecentlyModified(false)
        setTagsRecentlyModified(false)
        props.onSave({
            ...completeWordData, // optional fields like: clue, askedToReviseSoon, etc.
            translations: cleanData,
            partOfSpeech: partOfSpeech,
        })
        // when editing an existing word, we must then set the TextFields back to disabled
        setDisabledForms(true)
    }

    // hack to trigger re-rendering - alternative would've required changes in all language forms
    // and could cause unforeseen side effects
    // TODO: add timeout and during it display an animation?
    const [hideView, setHideView] = useState(false)
    useEffect(() => {
        setHideView(false)
    }, [hideView])

    const [clueRecentlyModified, setClueRecentlyModified] = useState(false)
    const [tagsRecentlyModified, setTagsRecentlyModified] = useState(false)

    return(
        <>
            {
                (
                    !(partOfSpeech!) &&
                    !(isLoading) &&
                    (   // we should only display the PartOfSpeechSelector when creating new words
                        (props.initialState === undefined)
                    )
                )
                ?
                <PartOfSpeechSelector
                    setPartOfSpeech={(part: PartOfSpeech) => {
                        setPartOfSpeech(part)
                        //@ts-ignore
                        dispatch(setSelectedPoS(part))
                    }}
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
                                {props.title}
                            </Typography>
                            <Typography
                                variant={"subtitle2"}
                                align={"center"}
                            >
                                {props.subTitle}
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
                                xs={disabledForms ?6 :4}
                            >
                                <Button
                                    variant={"outlined"}
                                    color={"error"}
                                    onClick={() => {
                                        if(disabledForms){
                                            setDisabledForms(false)
                                        } else if(props.initialState !== undefined) {
                                            setCompleteWordData(props.initialState)
                                            setHideView(true)
                                            setDisabledForms(true)
                                        } else {
                                            resetAll()
                                        }
                                    }}
                                    fullWidth={true}
                                    /*
                                    TODO: temporary fix - until we decide what this button should say/do when editing an existing word
                                     Should we be able to fully reset a word to choose Part of Speech again,
                                     (rta: NO, that would require to switch forms; better delete and restart)
                                     or should it simply allow to delete whole word? (rta: should be possible from here too)
                                     Should there always be a "delete word" button next to "edit" when reviewing an existing word?
                                    */
                                    // disabled={(props.initialState !== undefined) && !disabledForms}
                                    // there are cases when it should not be possible to edit a word (e.g. word from followed-tag).
                                    disabled={props.disableEditing!!}
                                >
                                    {(disabledForms)
                                        ? "Edit"
                                        : (props.initialState !== undefined)
                                            ? "Cancel"
                                            : "Reset"
                                    }
                                </Button>
                            </Grid>
                            {(!disabledForms) &&
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
                                            ||
                                            (disabledForms)
                                            ||
                                            !(
                                                (
                                                    ((completeWordData.translations).filter((selectedLang) => {
                                                        return (selectedLang.isDirty)
                                                    })).length > 0
                                                )
                                                ||
                                                (clueRecentlyModified || tagsRecentlyModified)
                                            )
                                        }
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                            }
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
                    {(
                        (
                            (!isLoading) // if we're loading the detailed view, this will avoid displaying the empty forms
                            ||
                            (   // this combination is to keep the form on display while we're saving changes
                                (isLoading) &&
                                (recentlyModified)
                            )
                        )
                        &&
                        (!hideView)
                    ) &&
                        <>
                            <Grid
                                item={true}
                                container={true}
                                justifyContent={"center"}
                            >
                                {
                                    completeWordData.translations.map((translation: TranslationItem, index) => {
                                        return(
                                            <TranslationFormGeneric
                                                key={index}
                                                index={index}
                                                partOfSpeech={partOfSpeech}
                                                availableLanguages={availableLanguages}
                                                currentTranslationData={translation}
                                                amountOfFormsOnScreen={completeWordData.translations.length}
                                                defaultDisabled={disabledForms}

                                                removeLanguageFromSelected={(index: number, willUpdateLanguage: boolean) => {
                                                    removeLanguageFromSelected(index, willUpdateLanguage)
                                                }}
                                                updateFormData={(
                                                    formData: {
                                                        language: Lang,
                                                        cases?: WordItem[],
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
                            {(!disabledForms || (disabledForms && completeWordData.clue!!)) &&
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
                                                setClueRecentlyModified(true)
                                            }}
                                            fullWidth={true}
                                            disabled={disabledForms}
                                        />
                                    </Grid>
                                </Grid>
                            }
                            {/* TAGS */}
                            {(!disabledForms || (disabledForms && completeWordData.tags!!)) &&
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
                                        <AutocompleteMultiple
                                            type={'tag'}
                                            values={(completeWordData.tags) ? completeWordData.tags : []}
                                            saveResults={(results: FilterItem[]) => {
                                                setCompleteWordData({
                                                    ...completeWordData,
                                                    tags: getAllIndividualTagDataFromFilterItem(results)
                                                })
                                                setTagsRecentlyModified(true)
                                            }}
                                            allowNewOptions={true}
                                            disabled={disabledForms}
                                        />
                                    </Grid>
                                </Grid>
                            }
                            {/* FORM BUTTONS */}
                            {(!disabledForms) &&
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
                            }
                        </>
                    }
                </Grid>
            }
        </>
    )
}