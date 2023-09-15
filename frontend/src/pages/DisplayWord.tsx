import React, {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {WordForm} from "../components/WordForm";
import {WordData} from "../ts/interfaces";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getWordById, updateWordById} from "../features/words/wordSlice";
import {toast} from "react-toastify";
import {LoadingScreen} from "../components/LoadingScreen";

interface RouterWordProps{
    wordId: string
}
interface DisplayWordProps {
    defaultDisabled?: boolean
}

export function DisplayWord(props: DisplayWordProps){
    const dispatch = useDispatch()
    // @ts-ignore
    const { wordId } = useParams<RouterWordProps>()
    const {word, isLoading, isError, message} = useSelector((state: any) => state.words)
    const [displayContent, setDisplayContent] = useState(false)
    const [finishedUpdating, setFinishedUpdating] = useState(true)

    useEffect(() => {
        if(wordId!!) {
            //@ts-ignore
            dispatch(getWordById(wordId))
        }
    },[])

    useEffect(() => {
        if(isLoading){
            setDisplayContent(false)
        }
    },[isLoading])


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
        }
    }, [isLoading, finishedUpdating])

    // TODO: should this be a reusable component to simplify having a loading screen or better to do it on a case by case basis?
    return(
        <Grid
            component={motion.div} // to implement animations with Framer Motion
            variants={routeVariantsAnimation}
            initial="initial"
            animate="final"
            container={true}
            item={true}
            justifyContent={"center"}
            xs={12}
            md={10}
            lg={8}
            sx={{
                marginTop: globalTheme.spacing(4),
                marginBottom: globalTheme.spacing(4),
            }}
        >
            {(!displayContent) &&
                <LoadingScreen
                    loadingTextList={[
                        "Loading...",
                        "Cargando...",
                        "Laadimine...",
                        "Laden...",
                    ]}
                    callback={() => setDisplayContent(true) }
                    sxProps={{
                        // when displaying content we hide this (display 'none'),
                        // but when not we simply display it as it normally would ('undefined' changes)
                        display: (!displayContent) ?undefined :"none",
                    }}
                    displayTime={2500}
                />
            }
            <div
                style={{
                    display: (displayContent) ?undefined :"none",
                }}
            >
                <WordForm
                    title={"Detailed view"}
                    subTitle={"All the currently stored translations for this word"}
                    onSave={(wordData: WordData) => {
                        const updatedWordData = {
                            id: wordId,
                            clue: wordData.clue,
                            tags: wordData.tags,
                            partOfSpeech: wordData.partOfSpeech,
                            translations: wordData.translations,
                        }
                        //@ts-ignore
                        dispatch(updateWordById(updatedWordData))
                        setFinishedUpdating(false)
                    }}
                    initialState={word}
                    defaultDisabled={props.defaultDisabled}
                />
            </div>
        </Grid>
    )
}