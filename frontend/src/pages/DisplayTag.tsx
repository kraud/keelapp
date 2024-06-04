import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {LoadingScreen} from "../components/LoadingScreen";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Grid} from "@mui/material";
import {
    acceptExternalTag,
    clearClonedTagData, clearFollowedTagData,
    clearFullTagData,
    followTag, getFollowedTagsByUser,
    getTagById, unfollowTag
} from "../features/tags/tagSlice";
import {TagDataForm} from "../components/forms/tags/TagDataForm";
import {SearchResult, TagData} from "../ts/interfaces";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface RouterTagProps{
    tagId: string
}
interface DisplayTagProps {
    defaultDisabled?: boolean
}

export function DisplayTag(props: DisplayTagProps){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // @ts-ignore
    const { tagId } = useParams<RouterTagProps>()
    const {otherUserTags, followedTagResponse, clonedTagResponse, fullTagData, isLoadingTags, isSuccessTags, isError, message} = useSelector((state: any) => state.tags)
    const {user} = useSelector((state: any) => state.auth)

    const emptyTagData = {
        author: "",
        label: "",
        description: "",
        public: 'Private' as 'Private', // to make TS happy.
        words: [],
    }
    const [displayContent, setDisplayContent] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [tagCurrentData, setTagCurrentData] = useState<TagData>(emptyTagData)
    const [currentTagHasBeenDeleted, setIsCurrentTagHasBeenDeleted] = useState(false)
    const [currentlyCopyingTag, setCurrentlyCopyingTag] = useState(false)
    const [currentlyFollowingOrUnfollowingTag, setCurrentlyFollowingOrUnfollowingTag] = useState(false)
    const [userFollowsTag, setUserFollowsTag] = useState(false)

    useEffect(() => {
        if((otherUserTags.length > 0) && (fullTagData !== undefined) && !userFollowsTag){
            if((otherUserTags.map((tagSearchResult: SearchResult) => {
                return(tagSearchResult.id)
            })).includes(fullTagData._id)){
                setUserFollowsTag(true)
            }
        }
    },[otherUserTags])

    useEffect(() => {
        if(tagId!!) {
            //@ts-ignore
            dispatch(getTagById(tagId))
            //@ts-ignore
            dispatch(getFollowedTagsByUser(user._id))
        }
    },[])

    useEffect(() => {
        // currentlyFollowingOrUnfollowingTag is there to avoid displaying loading cycle when copying/following tag
        if(isLoadingTags && !(currentlyCopyingTag || currentlyFollowingOrUnfollowingTag)){
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

    // TODO: this could be re-factored into a custom hook to handle toast display logic to be user elsewhere?
    // these next 2 useEffect are related to dealing with the state after clicking on copy tag+words
    useEffect(() => {
        if(currentlyCopyingTag){
            //@ts-ignore
            dispatch(acceptExternalTag(fullTagData._id))
        }
    }, [currentlyCopyingTag])

    useEffect(() => {
        // this will only be true if the tag request has been accepted and successfully cloned
        if((clonedTagResponse !== undefined) && (!isLoadingTags) && (isSuccessTags)){
            // we don't need the cloned tag data anymore, so we reset the state
            dispatch(clearClonedTagData())
            toast.success(`Tag and words were successfully added to your account!`)
        }
    }, [isLoadingTags, isSuccessTags, clonedTagResponse])
    //---------------
    // this is related to dealing with the state after clicking on follow tag
    useEffect(() => {
        // this will only be true if the tag follow/unfollow request has been successful
        if((followedTagResponse !== undefined) && (!isLoadingTags) && (isSuccessTags)){
            setCurrentlyFollowingOrUnfollowingTag(false)
            if(userFollowsTag){
                toast.success(`You do not follow this tag anymore`)
                //@ts-ignore
                dispatch(getFollowedTagsByUser(user._id))
                setUserFollowsTag(false)
            } else {
                toast.success(`You are now following this tag`)
                setUserFollowsTag(true)
            }
            // we don't need the cloned tag data anymore, so we reset the state
            dispatch(clearFollowedTagData())
        }
    }, [isLoadingTags, isSuccessTags, followedTagResponse])

    const onClickFollow = (currentUserFollowsTag: boolean) => {
        setCurrentlyFollowingOrUnfollowingTag(true)
        if(currentUserFollowsTag){
            //@ts-ignore
            dispatch(unfollowTag({tagId: fullTagData._id, userId: user._id}))
        } else {
            //@ts-ignore
            dispatch(followTag({tagId: fullTagData._id, userId: user._id}))
        }
    }

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
                    displayTime={2400}
                />
            }
            <div
                style={{
                    display: (displayContent) ?undefined :"none",
                }}
            >
                <Grid
                    container={true}
                    spacing={2}
                    item={true}
                    xs
                    sx={{
                        paddingBottom: globalTheme.spacing(4)
                    }}
                >
                    <Grid
                        item={true}
                        xs
                    >
                        <Button
                            variant={"contained"}
                            color={"secondary"}
                            onClick={() => {
                                navigate(-1)
                                dispatch(clearFullTagData())
                            }}
                            fullWidth={true}
                            startIcon={<ArrowBackIcon />}
                        >
                            Return
                        </Button>
                    </Grid>
                    {(
                        (fullTagData !== undefined) &&
                        (fullTagData.author !== user._id) &&
                        (fullTagData.public === 'Public')
                    ) &&
                        <Grid
                            container={true}
                            spacing={2}
                            item={true}
                            xs
                        >
                            <Grid
                                item={true}
                                xs={6}
                            >
                                <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    disabled={isLoadingTags}
                                    onClick={() => {
                                        setCurrentlyCopyingTag(true)
                                    }}
                                    fullWidth={true}
                                    startIcon={<ContentCopyIcon/>}
                                >
                                    Clone tag and words
                                </Button>
                            </Grid>
                            <Grid
                                item={true}
                                xs={6}
                            >
                                <Button
                                    variant={"contained"}
                                    color={(userFollowsTag) ?"warning" :"primary"}
                                    disabled={isLoadingTags}
                                    onClick={() => {
                                        onClickFollow(userFollowsTag)
                                    }}
                                    fullWidth={true}
                                    startIcon={(userFollowsTag) ? <BookmarkRemoveIcon/> :<BookmarkAddIcon/>}
                                >
                                    {(userFollowsTag) ?'Unfollow tag' :'Follow tag'}
                                </Button>
                            </Grid>
                        </Grid>
                    }
                </Grid>
                {/*
                    TODO: will be refactored into DisplayTagData component,
                     which will include prop for list of action buttons, and another prop to define where to display them (top-bot)
                */}
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