import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {LoadingScreen} from "../components/LoadingScreen";
import {useParams} from "react-router-dom";
import {Grid} from "@mui/material";

interface RouterTagProps{
    tagId: string
}
interface DisplayTagProps {
    defaultDisabled?: boolean
}

export function DisplayTag(props: DisplayTagProps){
    const dispatch = useDispatch()
    // @ts-ignore
    const { tagId } = useParams<RouterTagProps>()
    const {tags, isLoadingTags, isSuccessTags, isError, message} = useSelector((state: any) => state.tags)

    const [displayContent, setDisplayContent] = useState(false)

    useEffect(() => {
        if(tagId!!) {
            //@ts-ignore
            dispatch(getTagById(tagId))
        }
    },[])

    useEffect(() => {
        if(isLoadingTags){
            setDisplayContent(false)
        }
    },[isLoadingTags])

    useEffect(() => {
        if(isError){
            toast.error(`Something went wrong: ${message}`, {
                toastId: "click-on-modal"
            })
        }
    }, [isError, message])
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
            {/*    TODO: add TagDataForm*/}
            </div>
        </Grid>
    )
}