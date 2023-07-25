import {Grid, Modal, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import globalTheme from "../../theme/theme";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {FormSelector} from "../forms/FormSelector";
import {TranslationItem} from "../../ts/interfaces";
import {Lang, PartOfSpeech} from "../../ts/enums";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {getWordById, getWordsSimplified} from "../../features/words/wordSlice";

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

    wordId?: string,
    language?: Lang,
}

export function TableDataCell(props: TableDataCellProps){
    const dispatch = useDispatch()
    const [isHovering, setIsHovering] = useState(false)
    const [open, setOpen] = useState(false)
    const [selectedWordData, setSelectedWordData] = useState<TranslationItem>()
    const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech | undefined>()

    const openModal = () => {
        // call API for full word data
        // set data on variable to feed form displayed inside modal
        if(props.wordId !== undefined){
            //@ts-ignore
            dispatch(getWordById(props.wordId))
        }
        setOpen(true)
    }

    const {word, isLoading, isError, message} = useSelector((state: any) => state.words)

    useEffect(() => {
        if(isError){
            toast.error(`Something went wrong: ${message}`)
        }
        // if(props.wordId !== undefined){
        //     //@ts-ignore
        //     dispatch(getWordById(props.wordId))
        // }

        //on unmount
        return() => {

        }
    }, [isError, message, dispatch])

    useEffect(() => {
        console.log("word")
        console.log(word)
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
                            onClick={() => openModal()}
                            variant={'subtitle1'}
                            textAlign={
                                (props.textAlign !== undefined)
                                    ? props.textAlign
                                    : (props.type === "number")
                                        ? "right"
                                        : "left"
                            }
                            fontWeight={500}
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
                >
                    <Typography
                        variant={"h6"}
                    >
                        {(isLoading)
                            ? "Loading!"
                            : "Done!"
                        }
                    </Typography>
                </Modal>
            </>
        )

    } else {
        return(<></>)
    }
                    // <FormSelector
                    //     currentLang={props.language!}
                    //     currentTranslationData={selectedWordData!}
                    //     partOfSpeech={PartOfSpeech.noun}
                    //     updateFormData={() => null}
                    // />
}