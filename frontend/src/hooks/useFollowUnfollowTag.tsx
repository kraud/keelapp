import {useEffect, useState} from "react";
import {SearchResult} from "../ts/interfaces";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {clearFollowedTagData, followTag, getFollowedTagsByUser, unfollowTag} from "../features/tags/tagSlice";

interface useFollowUnfollowTagProps {
    isUserFollowingTag: boolean,
    setIsUserFollowingTag: (isFollowingValue: boolean) => void
}

export const useFollowUnfollowTag = (props: useFollowUnfollowTagProps) => {
    const dispatch = useDispatch()
    const {followedTagResponse, fullTagData, isLoadingTags, isSuccessTags, isError, message} = useSelector((state: any) => state.tags)
    const {user} = useSelector((state: any) => state.auth)
    const [currentlyFollowingOrUnfollowingTag, setCurrentlyFollowingOrUnfollowingTag] = useState(false)

    useEffect(() => {
        if(isError){
            toast.error(`Something went wrong: ${message}`, {
                toastId: "click-on-modal"
            })
        }
    }, [isError, message])

    useEffect(() => {
        // this will only be true if the tag follow/unfollow request has been successful
        if((followedTagResponse !== undefined) && (!isLoadingTags) && (isSuccessTags)){
            setCurrentlyFollowingOrUnfollowingTag(false)
            if(props.isUserFollowingTag){
                toast.success(`You do not follow this tag anymore`)
                //@ts-ignore
                dispatch(getFollowedTagsByUser(user._id))
                props.setIsUserFollowingTag(false)
            } else {
                toast.success(`You are now following this tag`)
                props.setIsUserFollowingTag(true)
            }
            // we don't need the followed tag data anymore, so we reset the state
            dispatch(clearFollowedTagData())
        }
    }, [isLoadingTags, isSuccessTags, followedTagResponse])

    const onClickFollowUnfollow = () => {
        setCurrentlyFollowingOrUnfollowingTag(true)
        if(props.isUserFollowingTag){
            //@ts-ignore
            dispatch(unfollowTag({tagId: fullTagData._id, userId: user._id}))
        } else {
            //@ts-ignore
            dispatch(followTag({tagId: fullTagData._id, userId: user._id}))
        }
    }

    return({
        currentlyFollowingOrUnfollowingTag: currentlyFollowingOrUnfollowingTag,
        onClickFollowUnfollow: onClickFollowUnfollow
    })
}

interface useIsUserFollowingTagProps {
    tagList: SearchResult[],
    tagIdToCheck: string
}

// TODO: review if 'useIsUserFollowingTag' should be incorporated by default inside 'useFollowUnfollowTag'.
export const useIsUserFollowingTag = (props: useIsUserFollowingTagProps) => {
    const [userFollowsTag, setUserFollowsTag] = useState(false)

    useEffect(() => {
        if((props.tagList.length > 0) && (props.tagIdToCheck !== "")){
            setUserFollowsTag(
                (
                    props.tagList.map(
                        (tagSearchResult: SearchResult) => {
                            return(tagSearchResult.id)
                        }
                    )
                ).includes(props.tagIdToCheck)
            )
        }
    },[props.tagList, props.tagIdToCheck])

    return({userFollowsTag: userFollowsTag, setUserFollowsTag: setUserFollowsTag})
}

