import {Button, Checkbox, Grid, Modal, Typography} from "@mui/material";
import React, {HTMLProps, useEffect, useState} from "react";
import globalTheme from "../../theme/theme";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {TranslationItem} from "../../ts/interfaces";
import {Lang, PartOfSpeech} from "../../ts/enums";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {clearWord, getWordById, getWordsSimplified, updateWordById} from "../../features/words/wordSlice";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import LinearIndeterminate from "../Spinner";
import Box from "@mui/material/Box";
import {FormSelector} from "../forms/FormSelector";

interface TableHeaderCellProps {
    content: any
    sxProps?: SxProps<Theme>
}

export function TableHeaderCell(props: TableHeaderCellProps){
    return(
        <Grid
            sx={{
                padding: '10px 25px',
                margin: '10px',
                marginBottom: 0,
                marginTop: 0,
                border: "4px solid black",
                borderRadius: "25px",
                cursor: 'pointer',
                ...props.sxProps
            }}
        >
            <Typography
                variant={'h6'}
                fontWeight={"bold"}
            >
                {props.content}
            </Typography>
        </Grid>
    )
}

interface TableDataCellProps {
    content: any
    type: "number" | "text" | "other"
    textAlign?: 'center' | 'inherit' | 'justify' | 'left' | 'right'
    sxProps?: SxProps<Theme>

    wordGender?: string
    displayWordGender?: boolean

    amount?: number
    displayAmount?: boolean
    onlyDisplayAmountOnHover?: boolean

    onlyForDisplay?: boolean // Will not change the cursor to pointer and if it's text, it won't be clickable.

    wordId?: string,
    language?: Lang,
}

export function TableDataCell(props: TableDataCellProps){
    const componentStyles = {
        mainContainer: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(80vw, max-content)',
            background: 'white',
            border: '4px solid #0072CE',
            borderRadius: '25px',
            padding: globalTheme.spacing(3),
            boxShadow: 24,
        },
        text: {
            cursor: (! props.onlyForDisplay!) ?"pointer" : "default",
        }
    }
    const dispatch = useDispatch()
    const [isHovering, setIsHovering] = useState(false)
    const [open, setOpen] = useState(false)
    const [selectedWordData, setSelectedWordData] = useState<TranslationItem>()
    const {word, isLoading, isError, message} = useSelector((state: any) => state.words)
    const [displayOnly, setDisplayOnly] = useState(true)
    const [finishedUpdating, setFinishedUpdating] = useState(true)
    const [finishedDeleting, setFinishedDeleting] = useState(true)

    const openModal = () => {
        // call API for full word data
        if(props.wordId !== undefined){
            //@ts-ignore
            dispatch(getWordById(props.wordId))
        }
        setOpen(true)
    }

    useEffect(() => {
        if(isError){
            toast.error(`Something went wrong: ${message}`, {
                toastId: "click-on-modal"
            })
        }
    }, [isError, message])

    useEffect(() => {
        // isLoading switches back to false once the response from backend is set on redux
        // finishedUpdating will only be false while waiting for a response from backend
        if(!finishedUpdating && !isLoading){
            toast.success(`Word was updated successfully`, {
                toastId: "click-on-modal"
            })
            // we reverse to the original state, before sending data to update
            setFinishedUpdating(true)
            //@ts-ignore
            dispatch(getWordsSimplified()) // to update the list of words displayed on the table
        }
    }, [isLoading, finishedUpdating])

    useEffect(() => {
        // isLoading switches back to false once the response from backend is set on redux
        // finishedDeleting will only be false while waiting for a response from backend
        if(!finishedDeleting && !isLoading){
            // closeModal
            toast.success(`Translation was deleted successfully`, {
                toastId: "click-on-modal"
            })
            // we reverse to the original state, before sending data to update
            setFinishedDeleting(true)
            handleOnClose()
            //@ts-ignore
            dispatch(getWordsSimplified()) // to update the list of words displayed on the table
        }
    }, [isLoading, finishedDeleting])

    // set data on variable to feed the form displayed inside modal
    useEffect(() => {
        if(
            (word.translations.length > 0) &&
            open &&
            (props.content !== undefined) // to avoid setting a value when opening an empty form (i.e. a translation that doesn't yet exist)
        ){
            setSelectedWordData({
                ...(word.translations.find((translation: TranslationItem) => translation.language === props.language)),
                // we set this manually, because completion state is not saved on BE - to save the data, it must already be validated
                completionState: true, // changes in word mean that BE was updated, and that should only happen if the validation was complete
                isDirty: false,
            })
        }
    }, [word, open])

    const handleOnClose = () => {
        setOpen(false)
        setDisplayOnly(true)
        setSelectedWordData(undefined)
        dispatch(clearWord())
    }

    const appendUpdatedTranslation = (updatedTranslation: TranslationItem) => {
        return(
            word.translations.map((translation: TranslationItem) => {
                if(translation.language === updatedTranslation.language){
                    return({
                        language: updatedTranslation.language,
                        cases: updatedTranslation.cases,
                    })
                } else {
                    return translation
                }
            })
        )
    }
    const deleteCurrentTranslationFromWordData = (currentLanguage: Lang) => {
        let updatedTranslations: TranslationItem[] = []
        word.translations.forEach((translation: TranslationItem) => {
            if(translation.language !== currentLanguage){
                updatedTranslations.push(translation)
            }
        })
        return(updatedTranslations)
    }

    const checkCurrentLanguageIncludedInTranslations = () => {
        let isIncluded = false
        word.translations.map((translation: TranslationItem) => {
            if(translation.language === props.language){
                isIncluded = true
            }
        })
        return isIncluded
    }

    return(
        <>
            <Grid
                sx={{
                    paddingX: globalTheme.spacing(3),
                    paddingY: globalTheme.spacing(1),
                    height: '100%',
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    flexDirection: 'column',
                    ...props.sxProps
                }}
                onMouseOver={() => setIsHovering(true)}
                onTouchStart={() => setIsHovering(true)}
                onMouseOut={() => setIsHovering(false)}
                onTouchEnd={() => setIsHovering(false)}
            >
                {(props.type === "other")
                    ?
                    props.content // i.e: button icon
                    :
                    (props.content !== undefined)
                        ?
                        <Typography
                            onClick={() => {
                                if (!props.onlyForDisplay!) {
                                    openModal()
                                }
                            }}
                            variant={'subtitle1'}
                            textAlign={
                                (props.textAlign !== undefined)
                                    ? props.textAlign
                                    : (props.type === "number")
                                        ? "right"
                                        : "left"
                            }
                            fontWeight={500}
                            sx={componentStyles.text}
                        >
                            {/* GENDER */}
                            {
                                (
                                    (props.displayWordGender!) && (props.wordGender)
                                ) &&
                                props.wordGender
                            }
                            {" "}
                            {/* WORD */}
                            {props.content}
                            {" "}
                            {/* AMOUNT OF STORED CASES */}
                            {
                                (
                                    (
                                        props.displayAmount!
                                        ||
                                        (props.onlyDisplayAmountOnHover! && isHovering)
                                    ) &&
                                    (props.amount!)
                                ) &&
                                `(${props.amount})`
                            }
                        </Typography>
                        :
                        <IconButton
                            onClick={() => {
                                if (!props.onlyForDisplay!) {
                                    // setOpen(true)
                                    openModal()
                                    setDisplayOnly(false)
                                    setSelectedWordData({
                                        language: props.language!,
                                        cases: [],
                                        completionState: false,
                                        isDirty: false,
                                    })
                                }
                            }}
                        >
                            <AddIcon fontSize={'inherit'}/>
                        </IconButton>
                }
            </Grid>
            <Modal
                open={open}
                onClose={() => handleOnClose()}
                disableAutoFocus={true}
            >
                <Box
                    sx={componentStyles.mainContainer}
                >
                    {(
                        isLoading &&
                        !(selectedWordData !== undefined) // to display form while isLoading is true, because we're saving changes
                    )
                        ?
                            <Grid
                                container={true}
                                rowSpacing={3}
                                justifyContent={'center'}
                            >
                                <Grid
                                    item={true}
                                    xs={6}
                                >
                                    <LinearIndeterminate/>
                                </Grid>
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <Typography
                                        variant={"h4"}
                                        textAlign={"center"}
                                    >
                                        Loading...
                                    </Typography>
                                </Grid>
                            </Grid>
                        : (selectedWordData !== undefined) &&
                        <Grid
                            item={true}
                            container={true}
                            direction={"column"}
                        >
                            <Grid
                                item={true}
                                container={true}
                                justifyContent={"flex-end"}
                                spacing={2}
                                sx={{
                                    marginBottom: globalTheme.spacing(2)
                                }}
                                xs={"auto"}
                            >
                                {(isLoading) &&
                                    <Grid
                                        container={true}
                                        item={true}
                                        alignContent={"center"}
                                        xs
                                    >
                                        <LinearIndeterminate/>
                                    </Grid>
                                }
                                <Grid
                                    item={true}
                                >
                                    <Button
                                        variant={"outlined"}
                                        color={"warning"}
                                        onClick={() => {
                                            // check if at least 2 more translations are saved
                                            if(word.translations.length > 2){
                                                // delete all data for this language on this word
                                                // TODO: check if it's ok to send whole 'word' data (dates, user ids, etc.)
                                                const updatedWordData = {
                                                    id: props.wordId,
                                                    clue: word.clue,
                                                    partOfSpeech: word.partOfSpeech,
                                                    translations: deleteCurrentTranslationFromWordData(props.language!)
                                                }
                                                // save changes to translation
                                                //@ts-ignore
                                                dispatch(updateWordById(updatedWordData))
                                                setFinishedDeleting(false)
                                            }
                                        }}
                                        disabled={
                                            (word.translations.length < 3)
                                            ||
                                            !(checkCurrentLanguageIncludedInTranslations()) // if not included => we can simply click away, no need to delete
                                    }
                                    >
                                        Delete
                                    </Button>
                                </Grid>
                                <Grid
                                    item={true}
                                >
                                    <Button
                                        variant={"outlined"}
                                        color={"secondary"}
                                        disabled={((!displayOnly) && (!selectedWordData.completionState!))}
                                        onClick={() => {
                                            if(displayOnly){
                                                setDisplayOnly(false)
                                            } else {
                                                if(selectedWordData.isDirty){
                                                    let updatedList: TranslationItem[]
                                                    if(checkCurrentLanguageIncludedInTranslations()){
                                                       updatedList = appendUpdatedTranslation(selectedWordData)
                                                    } else {
                                                        updatedList = [
                                                            ...word.translations,
                                                            {
                                                                // this way, we don't save the InternalStatus info (completionState, isDirty, etc.)
                                                                language: selectedWordData.language,
                                                                cases: selectedWordData.cases,
                                                            }
                                                        ]
                                                    }
                                                    // append changes to full word translation
                                                    // TODO: check if it's ok to send whole 'word' data (dates, user ids, etc.)
                                                    const updatedWordData = {
                                                        id: props.wordId,
                                                        clue: word.clue,
                                                        partOfSpeech: word.partOfSpeech,
                                                        translations: updatedList
                                                    }
                                                    // save changes to translation
                                                    //@ts-ignore
                                                    dispatch(updateWordById(updatedWordData))
                                                    setFinishedUpdating(false)
                                                    setDisplayOnly(true)
                                                } else {
                                                    setDisplayOnly(true)
                                                }
                                            }
                                        }}
                                    >
                                        {(displayOnly)
                                            ? "Edit"
                                            : (selectedWordData.isDirty)
                                                ?"Save changes"
                                                :"Cancel"
                                        }
                                    </Button>
                                </Grid>
                            </Grid>
                            <FormSelector
                                currentLang={props.language!} // TODO: this data should come from "selectedWordData
                                currentTranslationData={selectedWordData!}
                                partOfSpeech={PartOfSpeech.noun} // TODO: this data should come from "selectedWordData
                                updateFormData={(formData: TranslationItem) => {
                                    if(!displayOnly && !(isLoading)){ // && (formData.isDirty) for extra security?
                                        setSelectedWordData({
                                            ...formData,
                                            // To avoid saving empty cases,
                                            cases: formData.cases.filter((nounCase) => (nounCase.word !== "")),
                                        })
                                    }
                                }}
                                displayOnly={displayOnly}
                            />
                        </Grid>
                    }
                </Box>
            </Modal>
        </>
    )
}

export function IndeterminateCheckbox({
   indeterminate,
   ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = React.useRef<HTMLInputElement>(null!)

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate])

    return (
        <Checkbox
            // @ts-ignore
            color={"secondary"}
            inputRef={ref}
            {...rest}
        />
    )
}