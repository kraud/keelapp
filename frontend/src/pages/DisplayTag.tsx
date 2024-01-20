import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {LoadingScreen} from "../components/LoadingScreen";
import {useParams} from "react-router-dom";
import {Grid} from "@mui/material";
import {getTagById} from "../features/tags/tagSlice";
import {TagDataForm} from "../components/forms/tags/TagDataForm";
import {TagData} from "../ts/interfaces";

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
    const {fullTagData, tags, isLoadingTags, isSuccessTags, isError, message} = useSelector((state: any) => state.tags)

    const emptyTagData = {
        author: "",
        label: "",
        description: "",
        public: 'Private' as 'Private', // to make TS happy.
        wordsId: [],
    }
    const [displayContent, setDisplayContent] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [tagCurrentData, setTagCurrentData] = useState<TagData>(emptyTagData)
    const [currentTagHasBeenDeleted, setIsCurrentTagHasBeenDeleted] = useState(false)

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

    // once the request is made and the results come in, we save them into a local copy of the state,
    // this way the original remains in Redux, and we can access it to reverse changes if needed.
    useEffect(() => {
        if(!isLoadingTags && isSuccessTags && (fullTagData !== undefined)){
            if(!isEditing && isDeleting){ // if not editing and fullTagData updated => just deleted that tag now stored in fullTagData
                toast.info(`${fullTagData.label} tag was deleted!`)
                // TODO: close modal? Add timer to close?
                setIsDeleting(false)
                setIsCurrentTagHasBeenDeleted(true)
            }
            setTagCurrentData(fullTagData)
            setIsEditing(false)
        }
    },[fullTagData, isSuccessTags, isLoadingTags]) // TODO: add isDeleting to array?

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
                {/* TODO: will be refactored into DisplayTagData component, which will include action buttons */}
                <TagDataForm
                    currentTagData={tagCurrentData}
                    displayOnly={
                        (
                            (tagId !== "")
                            ||
                            ((fullTagData !== undefined) && (fullTagData._id!!))
                        ) &&
                        !isEditing
                    }
                    updateTagFormData={(formData: TagData) => {
                        setTagCurrentData(formData)
                    }}
                />
            </div>
        </Grid>
    )
}