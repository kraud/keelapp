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
import {setSelectedPoS, resetSelectedPoS, deleteWordById} from "../features/words/wordSlice";
import {checkEnvironmentAndIterationToDisplay} from "./forms/commonFunctions";
import {useNavigate} from "react-router-dom";
import {ConfirmationButton} from "./ConfirmationButton";
import {AppDispatch} from "../app/store";

interface TranslationFormProps {
    onSave: (wordData: WordData) => void,
    initialState?: WordData, // change to WordDataBE to include _id?
    title: string,
    subTitle: string,
    defaultDisabled?: boolean // determines how fields will be originally displayed (if disabled => text, else as text fields)
    disableEditing?: boolean // makes it impossible to edit the information on the word being displayed
}

// stores the complete *Word* Data
export function WordForm(props: TranslationFormProps) {
    // --------------- THIRD-PARTY HOOKS ---------------
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    // --------------- REDUX STATE ---------------
    const {word, isSuccess, isLoading} = useSelector((state: any) => state.words)
    const {user} = useSelector((state: any) => state.auth)

    // --------------- LOCAL STATE ---------------
    // Type of word to be added (noun/verb/adjective/etc.)
    const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech | undefined>(undefined)
    // Languages currently NOT in use for this word - NB! This is calculated automatically, never set directly.
    // It is used by WordFormGeneric to display the correct button-list of available languages
    const [availableLanguages, setAvailableLanguages] = useState<Lang[]>([])
    // object containing all the translations and extra info about the word
    const [completeWordData, setCompleteWordData] = useState<WordData>(
        {
            translations: [
                Object as unknown as TranslationItem,
                Object as unknown as TranslationItem
            ]
        }
    )
    const [hideView, setHideView] = useState(false)
    const [disabledForms, setDisabledForms] = useState(false)
    const [recentlyModified, setRecentlyModified] = useState(false)
    const [recentlyDeleted, setRecentlyDeleted] = useState(false)
    const [clueRecentlyModified, setClueRecentlyModified] = useState(false)
    const [tagsRecentlyModified, setTagsRecentlyModified] = useState(false)
    const toastId = React.useRef(null)

    // --------------- USE-EFFECTS ---------------
    useEffect(() => {
        if((props.defaultDisabled!) || (props.disableEditing!)){
            setDisabledForms(true)
        }
    }, [props.defaultDisabled, props.disableEditing])

    // In case we're loading an already existing word into the form, we need to set that data into the local state
    useEffect(() => {
        if(props.initialState !== undefined){
            if(props.initialState.translations !== undefined){
                // NB! We don't simply spread props.initial state, because there might be other fields not relevant to local state.
                // We only store in local state the values that we actually use.
                setCompleteWordData({
                    translations: filterAvailableTranslationsBySelectedLanguages(props.initialState.translations),
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
    },[props.initialState])

    // TODO: replace with calculated state instead of useEffect? or maybe useMemo?
    useEffect(() => {
        if(completeWordData.translations !== undefined){
            setAvailableLanguagesList()
        }
    }, [(completeWordData.translations)])

    // updates toast with corresponding info, and redirects user to dashboard after deleting a word
    useEffect(() => {
        if(!isLoading && isSuccess && (word._id === undefined) && recentlyDeleted){
            update()
            setRecentlyDeleted(false)
            navigate('/')
        }
    }, [recentlyDeleted, isLoading, isSuccess, word._id])

    // triggers toast when editing or deleting
    useEffect(() => {
        if(isLoading){
            if(recentlyModified){ // to avoid triggering modal when loading Form from another screen
                notify()
                setRecentlyModified(false)
            }
            if(recentlyDeleted){ // to avoid triggering modal when loading Form from another screen
                notify()
            }
        }
    }, [isLoading, recentlyDeleted, recentlyModified])

    // updates toast with corresponding info, and clears WordForm after creating a word
    useEffect(() => {
        if((isSuccess) && (word._id !== undefined) && !(props.initialState !== undefined)){
            update(word._id)
            // once the word has been saved, the form must be reset
            resetAll()
        }
    }, [isSuccess, word._id, props.initialState])

    // hack to trigger re-rendering - alternative would've required changes in all language forms
    // and could cause unforeseen side effects
    useEffect(() => {
        setHideView(false)
    }, [hideView])

    // --------------- ADDITIONAL FUNCTIONS ---------------
    // When reviewing an already created word, there might me translations assigned to that word,
    // which correspond to languages not relevant to the current user.
    // This might be because they used to have that language in their selected list, or because the word comes from a followed-tag.
    // On these cases, we don't display those translations.
    // TODO: this should be reversible with a toggle, and there should be a small note somewhere alerting the user of the amount of 'hidden' translations.
    const filterAvailableTranslationsBySelectedLanguages = (availableTranslations: TranslationItem[]) => {
        let filteredAndFormattedTranslationsList: TranslationItem[] = []
        availableTranslations.forEach((availableTranslation: TranslationItem) => {
            if((user.languages).includes(availableTranslation.language)){
                filteredAndFormattedTranslationsList.push({
                    ...availableTranslation,
                    completionState: true,
                    isDirty: false,
                })
            }
        })
        return(filteredAndFormattedTranslationsList)
    }

    // when editing a word, we can cancel changes and reverse to previous state with this
    const reverseChangesInLocalWordState = () => {
        if(props.initialState !== undefined){
            // NB! We don't simply spread props.initial state, because there might be other fields not relevant to local state.
            // We only store in local state the values that we actually use.
            setCompleteWordData({
                translations: filterAvailableTranslationsBySelectedLanguages(props.initialState.translations),
                partOfSpeech: props.initialState.partOfSpeech,
                clue: props.initialState.clue,
                tags: props.initialState.tags,

            })
            setHideView(true)
            setDisabledForms(true)
        }
    }

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

    // deletes word and sets flag to trigger toast
    const onClickDeleteWord = () => {
        setRecentlyDeleted(true)
        dispatch(deleteWordById(word._id))
    }

    // checks which languages are currently selected and sets the remaining languages as available,
    // using current user's available languages as the "complete" list.
    const setAvailableLanguagesList = () => {
        const allLangs: string[] = (user.languages!!) ? user.languages : []
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

    // restarts WordForm completely
    const resetAll = () => {
        setPartOfSpeech(undefined)
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

    // This will only be accessible if there are at least 2 other forms on screen already,
    // and adds another generic-translation-item to display on the form
    const addEmptyLanguageForm = () => {
        let oldLanguageList: TranslationItem[] = completeWordData.translations
        oldLanguageList.push(Object as unknown as TranslationItem)
        setCompleteWordData({
            ...completeWordData,
            translations: oldLanguageList
        })
    }

    // before saving/updating data, we must remove all local-internal-state info,
    // used to manage form-state and that is not required to be stored in BE
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

    // Toasts that need to change according to aplication state.
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
    const update = (wordId?: string) => {
        // @ts-ignore
        toast.update(toastId.current, {
            // render: "The word was saved successfully!",
            type: 'success',
            autoClose: 5000,
            transition: Flip,
            delay: 500,
            render: () => {
                return(
                    <Grid
                        container={true}
                    >
                        <Typography
                            variant={"subtitle2"}
                        >
                            {(wordId!!)
                                ? 'Word saved successfully.'
                                : 'Word deleted successfully.'
                            }
                        </Typography>
                        {(wordId!!) &&
                            <Button
                                variant={'contained'}
                                //@ts-ignore
                                color={'allWhite'}
                                fullWidth={true}
                                onClick={() => {
                                    navigate(`/word/${wordId}`)
                                }}
                            >
                                Click here to see the new word
                            </Button>
                        }
                    </Grid>
                )
            }
        })
    }

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
                            {(
                                (props.initialState !== undefined) &&
                                //@ts-ignore
                                (props.initialState?._id !== undefined) &&
                                (!props.disableEditing!!)
                            ) &&
                                <Grid
                                    item={true}
                                    xs={disabledForms ?6 :3}
                                >
                                    <ConfirmationButton
                                        onConfirm={() => {
                                            onClickDeleteWord()
                                        }}
                                        buttonLabel={'Delete'}
                                        buttonProps={{
                                            variant: "outlined",
                                            color: "warning",
                                        }}
                                        confirmationButtonLabel={'Confirm delete word'}
                                    />
                                </Grid>
                            }
                            <Grid
                                item={true}
                                xs={disabledForms ?6 :3}
                            >
                                <Button
                                    variant={"outlined"}
                                    color={"error"}
                                    onClick={() => {
                                        if(disabledForms){
                                            // TODO: ONCE IN 2nd ITERATION, REMOVE THIS!
                                            // so we disable the "edit" button during the 1st iteration
                                            if(checkEnvironmentAndIterationToDisplay(2)) {
                                                setDisabledForms(false)
                                            } else {
                                                toast.error("This function is not ready yet, we're sorry!")
                                            }
                                        } else if(props.initialState !== undefined) {
                                            reverseChangesInLocalWordState()
                                        } else {
                                            resetAll()
                                        }
                                    }}
                                    fullWidth={true}
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
                                    xs={3}
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
                        && // hack to trigger re-rendering
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
                                                //  according to the forms actually being displayed (after filtering by user.languages)
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
                                        xs
                                    >
                                        <Button
                                            onClick={() => {
                                                addEmptyLanguageForm()
                                            }}
                                            variant={"contained"}
                                            disabled={(
                                                // only true when all the languages are being used
                                                (availableLanguages.length === 0)
                                                ||
                                                // or when the maximum amount of translations is reached
                                                (completeWordData.translations.length === 4)
                                            )}
                                            fullWidth={true}
                                            sx={{
                                                borderRadius: '25px'
                                            }}
                                        >
                                            Add another translation
                                        </Button>
                                    </Grid>
                                </Grid>
                            }
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
                            {(
                                (checkEnvironmentAndIterationToDisplay(2)) &&
                                (!disabledForms || (disabledForms && completeWordData.tags!!))
                                ) &&
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
                        </>
                    }
                </Grid>
            }
        </>
    )
}