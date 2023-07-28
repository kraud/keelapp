import {Grid, Modal, Typography, Box} from "@mui/material";
import React, {useEffect, useState} from "react";
import globalTheme from "../../theme/theme";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {FormSelector} from "../forms/FormSelector";
import {TranslationItem} from "../../ts/interfaces";
import {Lang, PartOfSpeech} from "../../ts/enums";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {getWordById} from "../../features/words/wordSlice";
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
                border: "1px solid black",
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

    onlyForDisplay?: boolean

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

    // set data on variable to feed the form displayed inside modal
    useEffect(() => {
        if((word !== undefined) && open){
            setSelectedWordData(word.translations.find((translation: TranslationItem) => translation.language === props.language))
        }
    }, [word])

    if(props.content !== undefined){
        return(
            <>
                <Grid
                    sx={{
                        paddingX: globalTheme.spacing(4),
                        paddingY: globalTheme.spacing(1),
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
                                <FormSelector
                                    currentLang={props.language!}
                                    currentTranslationData={selectedWordData!}
                                    partOfSpeech={PartOfSpeech.noun}
                                    updateFormData={() => null}
                                    displayOnly={true}
                                />
                        }
                    </Box>
                </Modal>
            </>
        )

    } else {
        return(<></>)
    }
}