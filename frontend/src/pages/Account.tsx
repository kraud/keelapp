import React, {useEffect, useState} from "react"
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {Button, Grid, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import LinearIndeterminate from "../components/Spinner";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {FriendSearchModal} from "../components/FriendSearchModal";
import {UserBadge} from "../components/UserBadge";
import {TagInfoModal} from "../components/TagInfoModal";
import {toast} from "react-toastify";
import {updateUser} from "../features/auth/authSlice";
import {useNavigate} from "react-router-dom";
import {getFriendshipsByUserId} from "../features/friendships/friendshipSlice";
import {FriendshipData, SearchResult, TagData} from "../ts/interfaces";
import {clearUserResultData} from "../features/users/userSlice";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import {clearFullTagData, getTagsForCurrentUser} from "../features/tags/tagSlice";
import {FriendList, ChipList} from "../components/GeneralUseComponents";
import {clearRequesterNotifications, createNotification} from "../features/notifications/notificationSlice";

interface AccountProps {

}

export interface UserBadgeData {
    id: string,
    name: string,
    username: string,
    email: string
}

export const Account = (props: AccountProps) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user, isLoadingAuth, isSuccess, isError, message} = useSelector((state: any) => state.auth)
    const {friendships, isLoadingFriendships} = useSelector((state: any) => state.friendships)
    const {tags, isLoadingTags} = useSelector((state: any) => state.tags)
    const {notificationResponse, isSuccessNotifications, isLoadingNotifications} = useSelector((state: any) => state.notifications)

    const [allTags, setAllTags] = useState<TagData[]>([])
    const [activeFriendships, setActiveFriendships] = useState<FriendshipData[]>([])
    const [openFriendsModal, setOpenFriendsModal] = useState(false)
    const [triggerGetFriendships, setTriggerGetFriendships] = useState(false)
    const [openTagModal, setOpenTagModal] = useState(false)
    const [selectedTag, setSelectedTag] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [isUpdatingUserData, setIsUpdatingUserData] = useState(false)
    const [localUserData, setLocalUserData] = useState<UserBadgeData | null>(null)
    const [reloadTagList, setReloadTagList] = useState(false)
    const [tagIdToShare, setTagIdToShare] = useState("")

    useEffect(() => {
        if(friendships!!){
            const acceptedFriendships = friendships.filter((friendship: FriendshipData) => {
                return(friendship.status === 'accepted')
            })
            if(acceptedFriendships.length > 0){
                setActiveFriendships(acceptedFriendships)
            } else {
                setActiveFriendships([])
            }
        }
    },[friendships])

    useEffect(() => {
        // if while using the modal we changed the friend list we need to update the displayed list
        if(!openFriendsModal && triggerGetFriendships){
            // @ts-ignore
            dispatch(getFriendshipsByUserId(user._id))
            setTriggerGetFriendships(false)
        }
    },[triggerGetFriendships, openFriendsModal])

    useEffect(() => {
        if(selectedTag !== ""){
            setOpenTagModal(true)
        }
    },[selectedTag])

    useEffect(() => {
        setAllTags(tags)
    },[tags])

    // so when we edit the profile data, it also changes the local data
    useEffect(() => {
        setLocalUserData(user)
    },[user])

    useEffect(() => {
        setDefaultModalUserId(undefined)
        // @ts-ignore
        dispatch(getTagsForCurrentUser(user._id))
        // @ts-ignore
        dispatch(getFriendshipsByUserId(user._id))
        dispatch(clearUserResultData())
        // dispatch(clearFullTagData()) // TODO: review this, since it's causing issues when creating a new tag after reviewing another before that
    },[])

    const onSaveChanges = (newLocalUserData: UserBadgeData) => {
        setIsUpdatingUserData(true)
        // @ts-ignore
        dispatch(updateUser(newLocalUserData))
    }
    const onCancel = () => {
        setLocalUserData(user)
        setIsEditing(false)
    }

    const [defaultModalUserId, setDefaultModalUserId] = useState<string|undefined>(undefined)

    const displayFriendDetails = (friendshipInfo: FriendshipData) => {
        const friendId: string = (friendshipInfo.userIds[0] === user._id) ? friendshipInfo.userIds[1] : friendshipInfo.userIds[0]
        setDefaultModalUserId(friendId)
    }

    const sendShareTagNotification = (selectedUser: SearchResult[], tagIdToShare: string) => {
        const usersIds = selectedUser.map((userItem: SearchResult) => {
            return(userItem.id)
        })
        const newNotification = {
            user: usersIds, // users (one or more) to be notified
            variant: "shareTagRequest",
            content: {
                tagId: tagIdToShare, // tag to share
                requesterId: user._id, // user that created the request
            }
        }
        // @ts-ignore
        dispatch(createNotification(newNotification))
    }

    useEffect(() => {
        if(defaultModalUserId !== undefined){
            setOpenFriendsModal(true)
        }
    },[defaultModalUserId])

    useEffect(() => {
        if(!openFriendsModal){
            setDefaultModalUserId(undefined)
        }
    },[openFriendsModal])

    useEffect(() => {
        if(!openTagModal && reloadTagList){
            // @ts-ignore
            dispatch(getTagsForCurrentUser(user._id))
            setReloadTagList(false)
        }
    },[openTagModal, reloadTagList])

    const [sendingNotification, setSendingNotification] = useState(false)

    // this is related to dealing with the state after sending a shareTagRequest
    useEffect(() => {
        // this will only be true if the share-tag-request has been created and sent to the other user
        if((sendingNotification) && (notificationResponse.length >0) && (!isLoadingNotifications) && (isSuccessNotifications)){
            setSendingNotification(false)
            dispatch(clearRequesterNotifications())
            setTagIdToShare("")
            setOpenFriendsModal(false)
            toast.success(`Request to share tag was sent successfully!`)
        }
    }, [notificationResponse, isLoadingNotifications, isSuccessNotifications, sendingNotification])

    useEffect(() => {
        if(isUpdatingUserData) {
            if(isError) {
                toast.error(message)
                if(isUpdatingUserData){
                    onCancel()
                    setIsUpdatingUserData(false)
                }
            }
            if(!isLoadingAuth && isSuccess && !openFriendsModal){
                toast.success("User data updated successfully!")
                setIsUpdatingUserData(false)
            }
        }
    }, [isLoadingAuth, isError, isSuccess, message, isUpdatingUserData])

    return(
        <Grid
            component={motion.div} // to implement animations with Framer Motion
            variants={routeVariantsAnimation}
            initial="initial"
            animate="final"
            container={true}
            item={true}
            sx={{
                marginTop: globalTheme.spacing(4),
            }}
            rowSpacing={2}
            xs={12}
            md={6}
            lg={4}
        >
            {/* USER DATA */}
            <UserBadge
                userData={(localUserData!!) ?localUserData :{
                    id: "",
                    name: "",
                    email: "",
                    username: ""
                }}
                isEditing={isEditing}
                returnFieldsData={(updatedData) => {
                    if(localUserData !== null){
                        setLocalUserData({
                            ...localUserData,
                            username: updatedData.username!,
                            name: updatedData.name,
                        })
                    }
                }}
                isLoading={isLoadingAuth && !(openFriendsModal || openTagModal)}
            />
            {/* BUTTONS */}
            <Grid
                container={true}
                justifyContent={"space-around"}
                item={true}
                xs={12}
            >
                {(!isEditing) &&
                    <>
                        <Grid
                            item={true}
                            xs={4}
                        >
                            <Button
                                variant={"contained"}
                                color={"primary"}
                                onClick={() => {
                                    setTagIdToShare("") // we make sure that no list will be displayed on FriendSearchModal
                                    setOpenFriendsModal(true)
                                }}
                                fullWidth={true}
                                startIcon={<PersonAddIcon />}
                            >
                                Add friends
                            </Button>
                        </Grid>
                        <Grid
                            container={true}
                            item={true}
                            justifyContent={"center"}
                            xs={4}
                        >
                            <Grid
                                item={true}
                                xs={"auto"}
                            >
                                <Button
                                    variant={"contained"}
                                    color={"info"}
                                    onClick={() => setOpenTagModal(true)}
                                    fullWidth={true}
                                    startIcon={<LocalOfferIcon />}
                                >
                                    Create tag
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                }

                <Grid
                    container={true}
                    justifyContent={"center"}
                    item={true}
                    xs={isEditing ?10 :4}
                    spacing={1}
                >
                    <Grid
                        item={true}
                        xs
                    >
                        <Button
                            variant={"contained"}
                            color={(isEditing) ?"success" :"secondary"}
                            onClick={() => {
                                if(isEditing && (localUserData !== null)){
                                    onSaveChanges(localUserData)
                                    setIsEditing(false)
                                } else {
                                    setIsEditing(true)
                                }
                            }}
                            fullWidth={true}
                            endIcon={(isEditing) ?<CheckIcon /> :<SettingsIcon />}
                            disabled={
                                (
                                    (isEditing) &&
                                    (localUserData !== null) &&
                                    (
                                        (
                                            (localUserData.username === "")
                                            ||
                                            // TODO: username is missing on some early users
                                            //  !== undefined check will not be necessary in the future
                                            (localUserData.username === undefined)
                                            ||
                                            ((localUserData.username !== undefined) && localUserData.username.length < 3)
                                        )
                                        ||
                                        (
                                            (localUserData.name === "")
                                            ||
                                            (localUserData.name.length < 3)
                                        )
                                    )
                                )
                            }
                        >
                            {(isEditing) ?"Save" :"Edit profile"}
                        </Button>
                    </Grid>
                    {(isEditing) &&
                        <Grid
                            item={true}
                            xs
                        >
                            <Button
                                variant={"contained"}
                                color={"error"}
                                onClick={() => {
                                    onCancel()
                                }}
                                fullWidth={true}
                                endIcon={<ClearIcon/>}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    }
                </Grid>
            </Grid>
            {/* TAGS */}
            <Grid
                container={true}
                justifyContent={"center"}
                item={true}
                xs={12}
                spacing={2}
            >
                <Grid
                    item={true}
                >
                    <Typography
                        sx={{
                            typography: {
                                xs: 'h3',
                                sm: 'h2',
                                md: 'h1',
                            },
                            textTransform: "uppercase",
                            textDecoration: "underline"
                        }}
                    >
                        Tags:
                    </Typography>
                </Grid>
                <Grid
                    item={true}
                    container={true}
                    spacing={1}
                    justifyContent={"center"}
                >
                    {((isLoadingTags) && (!openFriendsModal))
                        ?
                        <LinearIndeterminate/>
                        :
                        <>
                            {(allTags.length > 0)
                                ?
                                <ChipList
                                    itemList={allTags}
                                    onClickAction={(tagId: string) => {
                                        setSelectedTag(tagId)
                                    }}
                                />
                                :
                                <>
                                    <Typography
                                        sx={{
                                            typography: {
                                                xs: 'body2',
                                                sm: 'h6',
                                                md: 'h5',
                                            },
                                        }}
                                    >
                                        You haven't added tags to any words yet.
                                    </Typography>
                                    <Button
                                        variant="text"
                                        size="small"
                                        color={"primary"}
                                        onClick={() => navigate('/review')}
                                    >
                                        Click here to go review your saved words and add tags!
                                    </Button>
                                </>}
                        </>
                    }
                </Grid>
            </Grid>
            {/* FRIENDS */}
            <Grid
                container={true}
                justifyContent={"center"}
                item={true}
                xs={12}
                rowSpacing={2}
            >
                <Grid
                    item={true}
                >
                    <Typography
                        sx={{
                            typography: {
                                xs: 'h3',
                                sm: 'h2',
                                md: 'h1',
                            },
                            textTransform: "uppercase",
                            textDecoration: "underline"
                        }}
                    >
                        Friends:
                    </Typography>
                </Grid>
                <Grid
                    item={true}
                    container={true}
                    xs={12}
                >
                    {((isLoadingFriendships) && !openFriendsModal)
                        ?
                        <LinearIndeterminate/>
                        :(activeFriendships.length === 0)
                        ?
                        <Grid
                            container={true}
                            item={true}
                            justifyContent={"center"}
                        >
                            <Grid
                                item={true}
                            >
                                <Typography
                                    variant={"h6"}
                                >
                                    You don't have any friends yet.
                                </Typography>
                                <Typography
                                    variant={"body2"}
                                    onClick={() => {
                                        setOpenFriendsModal(true)
                                    }}
                                    color={'primary'}
                                    textAlign={"center"}
                                    sx={{
                                        cursor: "pointer"
                                    }}
                                    fontWeight={"bold"}
                                >
                                    Click here to search and add new friends!
                                </Typography>
                            </Grid>
                        </Grid>
                        :
                        <FriendList
                            friendList={activeFriendships}
                            onClickAction={(friendshipItem: FriendshipData) => {
                                displayFriendDetails(friendshipItem)
                            }}
                        />
                    }
                </Grid>
            </Grid>
            <FriendSearchModal
                open={openFriendsModal}
                setOpen={(value: boolean) => {
                    setOpenFriendsModal(value)
                    // in case we were sending a tag to a Friend and closed the tag, we reset tagIdToShare
                    if(!value && (tagIdToShare !== "")){
                        setTagIdToShare("")
                        setSelectedTag("")
                    }
                }}
                defaultUserId={defaultModalUserId}
                reloadFriendList={() => setTriggerGetFriendships(true)}
                title={(tagIdToShare !== "") ?'Select a friend:' :'Search friends:'}
                // this prop is only used when sharing tag with friends
                userList={(tagIdToShare !== "") ?activeFriendships :undefined}
                onClickUserListSelection={(usersIds: SearchResult[]) => {
                    if((usersIds.length > 0) && (tagIdToShare !== "")){
                        setSendingNotification(true)
                        sendShareTagNotification(usersIds, tagIdToShare)
                    }
                }}
                loadingOnClickUserListSelection={isLoadingNotifications}
            />
            <TagInfoModal
                open={openTagModal}
                setOpen={(value: boolean) => {
                    if(!value){
                        setSelectedTag("")
                    }
                    setOpenTagModal(value)
                }}
                tagId={selectedTag}
                setMadeChangesToTagList={(status: boolean) => {
                    setReloadTagList(status)
                }}
                triggerAction={(tagId: string) => {
                    setTagIdToShare(tagId)
                    setOpenTagModal(false)
                    setOpenFriendsModal(true)
                }}
                title={(selectedTag !== "") ?undefined :'Create new tag:'}
            />
        </Grid>
    )
}