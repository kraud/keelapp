import {Grid, Modal, Typography, Box, Button, Checkbox} from "@mui/material";
import React, {HTMLProps, useEffect, useState} from "react";
import globalTheme from "../../theme/theme";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {FormSelector} from "../forms/FormSelector";
import {NounItem, TranslationItem} from "../../ts/interfaces";
import {Lang, PartOfSpeech} from "../../ts/enums";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {deleteWordById, getWordById, getWordsSimplified, updateWordById} from "../../features/words/wordSlice";
import LinearIndeterminate from "../Spinner";

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
            width: '80vw',
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
            setOpen(false)
            //@ts-ignore
            dispatch(getWordsSimplified()) // to update the list of words displayed on the table
        }
    }, [isLoading, finishedDeleting])

    // set data on variable to feed the form displayed inside modal
    useEffect(() => {
        if((word !== undefined) && open){
            setSelectedWordData(word.translations.find((translation: TranslationItem) => translation.language === props.language))
        }
    }, [word])

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

    if(props.content !== undefined){
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
                        <Typography
                            onClick={() => {
                                if(! props.onlyForDisplay!){
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
                            {
                                (
                                    (props.displayWordGender!) && (props.wordGender)
                                ) &&
                                props.wordGender
                            }
                            {" "}
                            {props.content}
                            {" "}
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
                    }
                </Grid>
                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    disableAutoFocus={true}
                >
                    <Box
                        sx={componentStyles.mainContainer}
                    >
                        {(isLoading)
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
                                >
                                    <Grid
                                        item={true}
                                    >
                                        <Button
                                            variant={"outlined"}
                                            color={"warning"}
                                            onClick={() => {
                                                // check if at least 2 more translations are saved
                                                if(word.translations.length > 2){
                                                    // deleteById
                                                    //@ts-ignore
                                                    // dispatch(deleteWordById(props.wordId)) // deletes whole word => TODO: add as button on table?

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
                                            disabled={word.translations.length < 3}
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
                                            onClick={() => {
                                                if(displayOnly){
                                                    setDisplayOnly(false)
                                                } else {
                                                    // append changes to full word translation
                                                    // TODO: check if it's ok to send whole 'word' data (dates, user ids, etc.)
                                                    const updatedWordData = {
                                                        id: props.wordId,
                                                        clue: word.clue,
                                                        partOfSpeech: word.partOfSpeech,
                                                        translations: appendUpdatedTranslation(selectedWordData)
                                                    }
                                                    // save changes to translation
                                                    //@ts-ignore
                                                    dispatch(updateWordById(updatedWordData))
                                                    setFinishedUpdating(false)
                                                }
                                            }}
                                        >
                                            {(displayOnly)
                                                ? "Edit"
                                                : "Save changes"
                                            }
                                        </Button>
                                    </Grid>
                                </Grid>
                                <FormSelector
                                    currentLang={props.language!}
                                    currentTranslationData={selectedWordData!}
                                    partOfSpeech={PartOfSpeech.noun}
                                    updateFormData={(formData: {
                                        language: Lang,
                                        cases?: NounItem[],
                                        completionState?: boolean
                                    }) => {
                                        if(!displayOnly){
                                            setSelectedWordData({
                                                language: formData.language,
                                                cases: (formData.cases!) ?formData.cases :[],
                                                completionState: formData.completionState,
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

    } else {
        return(<></>)
    }
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