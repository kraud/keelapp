import React, {useEffect} from "react";
import {Grid} from "@mui/material";
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {TranslationForm} from "../components/TranslationForm";
import {WordData} from "../ts/interfaces";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getWordById} from "../features/words/wordSlice";
import {toast} from "react-toastify";

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
    const {word, isLoading} = useSelector((state: any) => state.words)

    useEffect(() => {
        if(wordId!!) {
            //@ts-ignore
            dispatch(getWordById(wordId))
        }
    },[])

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
            {(isLoading)
                ? "Loading" // TODO: add a 'loading' word-spinner?
                :
                <TranslationForm
                    title={"Detailed view"}
                    subTitle={"All the currently stored translations for this word"}
                    onSave={(wordData: WordData) => {
                        toast.info(`Word editing from this screen is not yet implemented.`, {
                            toastId: "DisplayWord-wordData"
                        })
                    }}
                    initialState={word}
                    defaultDisabled={props.defaultDisabled}
                />
            }
        </Grid>
    )
}