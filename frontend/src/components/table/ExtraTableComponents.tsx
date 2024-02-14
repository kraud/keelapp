import {Button, Checkbox, Chip, CircularProgress, Grid, Modal, Typography} from "@mui/material";
import React, {HTMLProps, useEffect, useState} from "react";
import globalTheme from "../../theme/theme";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {FilterItem, InternalStatus, TagData, TranslationItem} from "../../ts/interfaces";
import {Lang, PartOfSpeech} from "../../ts/enums";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {clearWord, clearWordsSimple, getWordById, getWordsSimplified, updateWordById} from "../../features/words/wordSlice";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LinearIndeterminate from "../Spinner";
import Box from "@mui/material/Box";
import {WordFormSelector} from "../forms/WordFormSelector";
import {SortDirection} from "@tanstack/table-core/build/lib/features/Sorting";
import DoneIcon from "@mui/icons-material/Done";
import {useSearchParams} from "react-router-dom";
import {AutocompleteMultiple} from "../AutocompleteMultiple";
import {checkEqualArrayContent, extractTagsArrayFromUnknownFormat} from "../generalUseFunctions";
import {ConfirmationButton} from "../ConfirmationButton";

interface TableHeaderCellProps {
    content: any
    sxProps?: SxProps<Theme>
    column?: any // if we specify a type, it  will only work correctly on that type of table
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
                color={"primary"}
                display={"inline"}
            >
                {(props.column !== undefined) &&
                    {asc: '⬆ ', desc: '⬇ '}[
                    (props.column.getIsSorted() as SortDirection) ?? null
                        ]
                }
            </Typography>
            <Typography
                variant={'h6'}
                fontWeight={"bold"}
                display={"inline"}
                sx={{
                    userSelect: 'none',
                }}
            >
                {props.content}
            </Typography>
        </Grid>
    )
}

interface TableDataCellProps {
    content: any
    // TODO: change type options to represent their use? word-tags-etc.?
    type: "text" | "array" | "other" // other doesn't have an assigned modal component to display
    textAlign?: 'center' | 'inherit' | 'justify' | 'left' | 'right'
    sxProps?: SxProps<Theme>

    wordGender?: string
    displayWordGender?: boolean

    amount?: number
    displayAmount?: boolean
    onlyDisplayAmountOnHover?: boolean

    onlyForDisplay?: boolean //  Will not change the cursor to pointer and if it's text, it won't be clickable.

    wordId?: string,
    language?: Lang,
    partOfSpeech?: PartOfSpeech,
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
    type TagsData = {
        tags: TagData[] // corresponds with the tag Ids? TODO: check.
    } & InternalStatus

    const dispatch = useDispatch()
    let  [searchParams, setSearchParams]  = useSearchParams();
    const [isHovering, setIsHovering] = useState(false)
    const [open, setOpen] = useState(false)
    const [selectedTranslationData, setSelectedTranslationData] = useState<TranslationItem>()
    const [selectedWordTagsData, setSelectedWordTagsData] = useState<TagsData>({tags: []})
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
        switch (props.type){
            case ("array"): {
                setSelectedWordTagsData({
                    tags: word.tags,
                    isDirty: false,
                    completionState: true,
                })
            }
            break
            case ("text"): {
                if(
                    (word.translations.length > 0) &&
                    open &&
                    (props.content !== undefined) // to avoid setting a value when opening an empty form (i.e. a translation that doesn't yet exist)
                ){
                    setSelectedTranslationData({
                        ...(word.translations.find((translation: TranslationItem) => translation.language === props.language)),
                        // we set this manually, because completion state is not saved on BE - to save the data, it must already be validated
                        completionState: true, // changes in word mean that BE was updated, and that should only happen if the validation was complete
                        isDirty: false,
                    })
                }
            }
            break
            default: return
        }
    }, [word, open])

    const handleOnClose = () => {
        setOpen(false)
        setDisplayOnly(true)
        setSelectedTranslationData(undefined)
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

    const getPercentage = (amount: number) => {
        let maxAmountOfCases = 0
        switch (props.partOfSpeech) {
            case PartOfSpeech.noun: {
                switch (props.language) {
                    case Lang.EN: {
                        maxAmountOfCases = 2
                        break
                    }
                    case Lang.ES: {
                        maxAmountOfCases = 3
                        break
                    }
                    case Lang.DE: {
                        maxAmountOfCases = 9
                        break
                    }
                    case Lang.EE: {
                        maxAmountOfCases = 7
                        break
                    }
                    default:
                        maxAmountOfCases = 99
                        break
                }
            }
            break
            case PartOfSpeech.adverb: {
                switch (props.language) {
                    case Lang.EN: {
                        maxAmountOfCases = 3
                        break
                    }
                    case Lang.ES: {
                        maxAmountOfCases = 3
                        break
                    }
                    default:
                        maxAmountOfCases = 99
                        break
                }
            }
            break
            case PartOfSpeech.adjective: {
                switch (props.language) {
                    case Lang.EN: {
                        maxAmountOfCases = 3
                        break
                    }
                    case Lang.ES: {
                        // Adjectives that end with 'e' or with a consonant are neutral (single form for both genders)
                        const lastCharacter = props.content.charAt((props.content).length-1)
                        if(!(["a","i","o","u"].includes(lastCharacter))){
                            maxAmountOfCases = 2
                        } else {
                            maxAmountOfCases = 4
                        }
                        break
                    }
                    case Lang.DE: {
                        maxAmountOfCases = 3
                        break
                    }
                    case Lang.EE: {
                        maxAmountOfCases = 8
                        break
                    }
                    default:
                        maxAmountOfCases = 99
                        break
                }
            }
            break
            default:
                maxAmountOfCases = 99
                break
        }
        return ((amount/maxAmountOfCases)*100)
    }

    const getCellComponent = () => {
        switch (props.type){
            case ("other"): {
                return(props.content)
            }
            case ("array"): {
                return(
                    <Grid
                        container={true}
                        spacing={1}
                        justifyContent={"space-between"}
                    >
                        <Grid
                            container={true}
                            item={true}
                            xs
                            spacing={1}
                            justifyContent={"flex-start"}
                        >
                            {props.content.map((item: string, index: number) => {
                                switch(true){
                                    case(index == 2): {
                                        return(
                                            <Grid
                                                item={true}
                                                key={index}
                                            >
                                                <Chip
                                                    variant={"outlined"}
                                                    label={"+ "+(props.content.length -2)}
                                                    color={"secondary"}
                                                    sx={{
                                                        maxWidth: "max-content",
                                                    }}
                                                    onClick={() => {
                                                        openModal()
                                                    }}
                                                />
                                            </Grid>
                                        )
                                    }
                                    case(index > 2): {
                                        return null
                                    }
                                    case(index < 2): {
                                        return(
                                            <Grid
                                                item={true}
                                                key={index}
                                            >
                                                <Chip
                                                    variant="filled"
                                                    label={item}
                                                    color={"secondary"}
                                                    sx={{
                                                        maxWidth: "max-content",
                                                    }}
                                                    onClick={() => {
                                                        setSearchParams({"tags": item}) // also acts as navigate
                                                        dispatch(clearWordsSimple())
                                                    }}
                                                />
                                            </Grid>
                                        )
                                    }
                                }
                            })}
                        </Grid>
                        <Grid
                            item={true}
                        >
                            <span
                                style={{
                                    float: 'right',
                                    marginRight: '25px',
                                    marginLeft: '10px',
                                }}
                            >
                                <span
                                    className={"completePercentageCircle"}
                                    style={{
                                        position: 'absolute',
                                    }}
                                >
                                    <InfoOutlinedIcon
                                        color={"primary"}
                                        sx={{
                                            // NB! Done this way to maintain the layout of the other components inside the cell
                                            display: (props.onlyDisplayAmountOnHover! && isHovering)
                                                ? "initial"
                                                : "none",
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            openModal()
                                        }}
                                    />
                                </span>
                            </span>
                        </Grid>
                    </Grid>
                )
            }
            case ("text"): {
                return(
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
                            <span
                                style={{
                                    float: 'right',
                                    marginRight: '35px',
                                }}
                            >
                                {((props.amount!!) && (getPercentage(props.amount) < 100)) &&
                                <span
                                    className={"completePercentageCircle"}
                                    style={{
                                        height: '30px',
                                        width: '30px',
                                        position: 'absolute',
                                    }}
                                >
                                    <CircularProgress
                                        variant="determinate"
                                        value={100}
                                        color={"secondary"}
                                        sx={{
                                            zIndex: 100,
                                            marginTop: '-11px',
                                            marginLeft: '10px',
                                            color: 'grey !important',
                                        }}
                                    />
                                </span>}
                                <span
                                    className={"completePercentageCircle"}
                                    style={{
                                        height: '30px',
                                        width: '30px',
                                        position: 'absolute',
                                    }}
                                >
                                    <CircularProgress
                                        variant="determinate"
                                        color={((props.amount!!) && (getPercentage(props.amount) >= 100)) ?"success" :"primary"}
                                        value={(props.amount!!) ?getPercentage(props.amount) :0}
                                        sx={{
                                            zIndex: 1000,
                                            marginTop: '-11px',
                                            marginLeft: '10px',
                                        }}
                                    />
                                </span>
                                {((props.amount!!) && (getPercentage(props.amount) >= 100)) &&
                                    <span
                                        className={"smallerIconCompletePercentage"}
                                        style={{
                                            position: 'absolute',
                                        }}
                                    >
                                        <DoneIcon
                                            sx={{
                                                marginTop: '2px',
                                                marginLeft: '12px',
                                                color: 'green',
                                                fontSize: '10px',
                                            }}
                                        />
                                    </span>
                                }
                            </span>
                        }
                    </Typography>
                )
            }
            default: return(props.content)
        }
    }

    const getModalComponent = () => {
        switch (props.type){
            case ("array"): {
                return(
                    <AutocompleteMultiple
                        type={'tag'}
                        values={((selectedWordTagsData.tags !== undefined)&&((selectedWordTagsData.tags).length > 0)) ? selectedWordTagsData.tags : []}
                        saveResults={(results: FilterItem[]) => {
                            setSelectedWordTagsData({
                                // extractTagsArrayFromUnknownFormat not needed here, since values always are separate items?
                                // tags: extractTagsArrayFromUnknownFormat(results),
                                tags: extractTagsArrayFromUnknownFormat(results),
                                isDirty: !checkEqualArrayContent(props.content, extractTagsArrayFromUnknownFormat(results)),
                                completionState: true,
                            })
                        }}
                        allowNewOptions={true}
                        disabled={displayOnly}
                        limitTags={3}
                    />
                )
            }
            case ("text"): {
                return(
                    <WordFormSelector
                        currentLang={props.language!} // TODO: this data should come from "selectedTranslationData
                        currentTranslationData={selectedTranslationData!}
                        partOfSpeech={props.partOfSpeech}
                        updateFormData={(formData: TranslationItem) => {
                            if(!displayOnly && !(isLoading)){ // && (formData.isDirty) for extra security?
                                setSelectedTranslationData({
                                    ...formData,
                                    // To avoid saving empty cases,
                                    cases: formData.cases.filter((nounCase) => (nounCase.word !== "")),
                                })
                            }
                        }}
                        displayOnly={displayOnly}
                    />
                )
            }
            default: return null
        }
    }

    const editSaveCancelChangesOnClick = () => {
        switch (props.type){
            case ("array"): {
                if(displayOnly){
                    setDisplayOnly(false)
                } else {
                    if(selectedWordTagsData.isDirty){
                        const updatedWordData = {
                            id: props.wordId,
                            tags: selectedWordTagsData.tags,
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
            }
            break
            case ("text"): {
                if(selectedTranslationData !== undefined){
                    if(displayOnly){
                        setDisplayOnly(false)
                    } else {
                        if(selectedTranslationData.isDirty){
                            let updatedList: TranslationItem[]
                            if(checkCurrentLanguageIncludedInTranslations()){
                                updatedList = appendUpdatedTranslation(selectedTranslationData)
                            } else {
                                updatedList = [
                                    ...word.translations,
                                    {
                                        // this way, we don't save the InternalStatus info (completionState, isDirty, etc.)
                                        language: selectedTranslationData.language,
                                        cases: selectedTranslationData.cases,
                                    }
                                ]
                            }
                            // append changes to full word translation
                            // TODO: check if it's ok to send whole 'word' data (dates, user ids, etc.)
                            const updatedWordData = {
                                id: props.wordId,
                                clue: word.clue,
                                partOfSpeech: word.partOfSpeech,
                                tags: word.tags,
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
                }
            }
            break
            default: return null
        }
    }

    const deleteOnClick = () => {
        switch (props.type){
            case ("text"): {
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
            }
            break
            default: return null
        }
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
                {(
                    (
                        (props.type === "text") &&
                        (props.content !== undefined)
                    )
                    ||
                    (
                        (props.type === "array") &&
                        (props.content!.length > 0)
                    )
                    ||
                    (
                        (props.type === "other")
                    )
                )
                    ? getCellComponent()
                    :
                    <IconButton
                        onClick={() => {
                            if (!props.onlyForDisplay!) {
                                openModal()
                                setDisplayOnly(false)
                                setSelectedTranslationData({
                                    language: props.language!,
                                    cases: [],
                                    completionState: false,
                                    isDirty: false,
                                })
                            }
                        }}
                    >
                        <AddIcon color={"primary"} fontSize={'inherit'}/>
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
                        !(selectedTranslationData !== undefined) && // to display form while isLoading is true, because we're saving changes
                        !(selectedWordTagsData.completionState !== undefined)
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
                        : (
                            (
                                (selectedTranslationData !== undefined) &&
                                (props.type === "text")
                            )
                            ||
                            (
                                (selectedWordTagsData !== undefined) &&
                                (props.type === "array")
                            )
                        ) &&
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
                                    <ConfirmationButton
                                        onConfirm={() => {
                                            deleteOnClick()
                                        }}
                                        buttonLabel={'Delete'}
                                        buttonProps={{
                                            variant: "outlined",
                                            color: "warning",
                                            disabled: (props.type === "text") &&
                                                (
                                                    (word.translations.length < 3)
                                                    ||
                                                    !(checkCurrentLanguageIncludedInTranslations()) // if not included => we can simply click away, no need to delete
                                                ),
                                            sx: {
                                                display: (props.type === "array") ?"none" :"initial"
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item={true}
                                >
                                    <Button
                                        variant={"outlined"}
                                        color={"secondary"}
                                        disabled={(
                                            (!displayOnly) &&
                                            (
                                                (
                                                    props.type === "text" &&
                                                    !selectedTranslationData!.completionState! // (!) selectedTranslationData will never be undefined when type === "text"
                                                )
                                                ||
                                                (
                                                    (props.type === "array") &&
                                                    (selectedWordTagsData.completionState === undefined) // TODO: fix logic to hide cancel button on new tags
                                                ) // it should always be allowed to edit/cancel/save any tags
                                            )
                                        )}
                                        onClick={() => editSaveCancelChangesOnClick()}
                                    >
                                        {(displayOnly)
                                            ? "Edit"
                                            : (
                                                (
                                                    props.type === "text" &&
                                                    (selectedTranslationData!.isDirty) // (!) selectedTranslationData will never be undefined when type === "text"
                                                )
                                                ||
                                                (
                                                    props.type === "array" &&
                                                    (selectedWordTagsData.isDirty)
                                                )
                                            )
                                                ?"Save changes"
                                                :"Cancel"
                                        }
                                    </Button>
                                </Grid>
                            </Grid>
                            {getModalComponent()}
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