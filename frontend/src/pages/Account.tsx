import React, {useEffect, useState} from "react"
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {Button, Divider, Grid, Typography} from "@mui/material";
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
import {FriendshipData, NotificationData, SearchResult, TagData} from "../ts/interfaces";
import {clearUserResultData} from "../features/users/userSlice";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import {getTagsForCurrentUser, getFollowedTagsByUser} from "../features/tags/tagSlice";
import {FriendList, ChipList} from "../components/GeneralUseComponents";
import {clearRequesterNotifications, createNotification} from "../features/notifications/notificationSlice";
import {Lang} from "../ts/enums";
import {AppDispatch} from "../app/store";
import {checkEnvironmentAndIterationToDisplay} from "../components/forms/commonFunctions";
import { useTranslation } from 'react-i18next';


export interface UserBadgeData {
    id: string,
    name: string,
    username: string,
    email: string,
    languages: Lang[],
    uiLanguage?: Lang
}

export const Account = () => {
    // --------------- THIRD-PARTY HOOKS ---------------
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { t } = useTranslation(['common', 'friendship', 'tags'])

    // --------------- REDUX STATE ---------------
    const {user, isLoadingAuth, isSuccess, isError, message} = useSelector((state: any) => state.auth)
    const {friendships, isLoadingFriendships} = useSelector((state: any) => state.friendships)
    const {tags, isLoadingTags, followedTagsByUser} = useSelector((state: any) => state.tags)
    const {notificationResponse, isSuccessNotifications, isLoadingNotifications} = useSelector((state: any) => state.notifications)

    // --------------- LOCAL STATE ---------------
    // Related to logic for UserBadge and changing user data.
    const [localUserData, setLocalUserData] = useState<UserBadgeData | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isUpdatingUserData, setIsUpdatingUserData] = useState(false)

    const [activeFriendships, setActiveFriendships] = useState<FriendshipData[]>([])
    const [triggerGetFriendships, setTriggerGetFriendships] = useState(false)

    const [openFriendsModal, setOpenFriendsModal] = useState(false)
    const [defaultModalUserId, setDefaultModalUserId] = useState<string|undefined>(undefined)

    const [allTags, setAllTags] = useState<TagData[]>([])
    const [followedTags, setFollowedTags] = useState<TagData[]>([])
    const [triggerGetTagList, setTriggerGetTagList] = useState(false)

    // Related to logic for Modal displaying details about a Tag (also used when sharing a tag).
    const [openTagModal, setOpenTagModal] = useState(false)
    const [selectedTag, setSelectedTag] = useState("")

    // Related to logic for selecting a Tag and sharing it with another user (friend)
    const [tagIdToShare, setTagIdToShare] = useState("")
    const [sendingNotification, setSendingNotification] = useState(false)

    // --------------- USE-EFFECTS ---------------

    // On first render, this makes all the necessary requests to BE (and stores result data in Redux) to display account-screen info
    useEffect(() => {
        setDefaultModalUserId(undefined)
        dispatch(getTagsForCurrentUser()) // TODO: should this function get ALL tags, including followed tags?
        dispatch(getFollowedTagsByUser(user._id)) // TODO: should this function get ALL tags, including followed tags?
        dispatch(getFriendshipsByUserId(user._id))
        dispatch(clearUserResultData())
        // dispatch(clearFullTagData()) // TODO: review this, since it's causing issues when creating a new tag after reviewing another before that
    },[dispatch]) // NB! [] and [dispatch] ARE THE SAME. It's simply there because TS requires it. THIS WILL ONLY RUN AT FIRST RENDER

    // so when we edit the profile data, it also changes the local data
    useEffect(() => {
        setLocalUserData({
            ...user,
            // TODO: revert once cleaning old users from DB
            // NB! Originally, users did not have a list of languages.
            // So we first check if there is language data, and if not, we set an empty array.
            languages: (user.languages!!) ? user.languages : [],
            uiLanguage: (user.uiLanguage!!) ? user.uiLanguage : Lang.EN
        })
    },[user])

    useEffect(() => {
        if(isUpdatingUserData) {
            if(isError) {
                toast.error(message)
                if(isUpdatingUserData){
                    onCancelEditingUSer()
                    setIsUpdatingUserData(false)
                }
            }
            if(!isLoadingAuth && isSuccess && !openFriendsModal){
                toast.success(t('userData.toastMessages.updateSuccess', { ns: 'common' }))
                setIsUpdatingUserData(false)
            }
        }
    }, [isLoadingAuth, isError, isSuccess, message, isUpdatingUserData])

    // when friendships list is updated in redux-state => we copy to local state ONLY the active friendships,
    // Friendships in local state will be used to display Friend's list
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
        if(defaultModalUserId !== undefined){
            setOpenFriendsModal(true)
        }
    },[defaultModalUserId])

    useEffect(() => {
        if(!openFriendsModal){
            setDefaultModalUserId(undefined)
        }
    },[openFriendsModal])

    // if while using the modal we changed the friend list we need to update the displayed list, ONLY the modal is closed
    useEffect(() => {
        if(!openFriendsModal && triggerGetFriendships){
            dispatch(getFriendshipsByUserId(user._id))
            setTriggerGetFriendships(false)
        }
    },[triggerGetFriendships, openFriendsModal, dispatch])

    useEffect(() => {
        setAllTags(tags)
    },[tags])

    useEffect(() => {
        setFollowedTags(followedTagsByUser)
    },[followedTagsByUser])

    useEffect(() => {
        if(selectedTag !== ""){
            setOpenTagModal(true)
        }
    },[selectedTag])

    // if while using the modal we changed the tag list we need to update the displayed list, ONLY the modal is closed
    useEffect(() => {
        if(!openTagModal && triggerGetTagList){
            dispatch(getTagsForCurrentUser())
            setTriggerGetTagList(false)
        }
    },[openTagModal, triggerGetTagList, dispatch])

    // Related to logic for dealing with the state after sending a shareTagRequest
    useEffect(() => {
        // this will only be true if the share-tag-request has been created and sent to the other user
        if((sendingNotification) && (notificationResponse.length >0) && (!isLoadingNotifications) && (isSuccessNotifications)){
            setSendingNotification(false)
            dispatch(clearRequesterNotifications())
            setTagIdToShare("")
            setOpenFriendsModal(false)
            toast.success(t('toastMessages.tagShared', { ns: 'tags' }))
        }
    }, [notificationResponse, isLoadingNotifications, isSuccessNotifications, sendingNotification])

    // --------------- ADDITIONAL FUNCTIONS ---------------
    // UserBadge related functions
    const onSaveUserChanges = (newLocalUserData: UserBadgeData) => {
        setIsUpdatingUserData(true)
        dispatch(updateUser(newLocalUserData))
    }
    const onCancelEditingUSer = () => {
        setLocalUserData(user)
        setIsEditing(false)
    }

    // FriendList related functions
    // This function extracts the other user from a friendship (that is not the current user).
    const displayFriendDetails = (friendshipInfo: FriendshipData) => {
        const friendId: string = (friendshipInfo.userIds[0] === user._id) ? friendshipInfo.userIds[1] : friendshipInfo.userIds[0]
        setDefaultModalUserId(friendId)
    }

    // TagInfoModal & FriendSearchModal related functions (send Tag to another user)
    // After selecting one of your own tags, and you want to share it with another user from your friend list,
    // we open the FriendSearchModal, and from there you can search or pick a user from your friend list.
    // Once selected, we create a notification on their account with this function.
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
        dispatch(createNotification(newNotification as NotificationData))
    }

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
            spacing={4}
            xs={12}
            md={8}
            lg={10}
        >
            {/* FIRST COLUMN */}
            <Grid
                container={true}
                justifyContent={"space-around"}
                rowSpacing={2}
                item={true}
                xs={12}
                lg={6}
                sx={{
                    height: 'fit-content'
                }}
            >
                {/* USER DATA */}
                <UserBadge
                    userData={(localUserData!!) ?localUserData :{
                        id: "",
                        name: "",
                        email: "",
                        username: "",
                        languages: [],
                        uiLanguage: Lang.EN // TODO: defaults to value from i18n auto detect?
                    }}
                    isEditing={isEditing}
                    returnFieldsData={(updatedData) => {
                        if(localUserData !== null){
                            setLocalUserData({
                                ...localUserData,
                                username: updatedData.username!,
                                name: updatedData.name,
                                languages: updatedData.languages,
                                uiLanguage: updatedData.uiLanguage
                            })
                        }
                    }}
                    isLoading={isLoadingAuth && !(openFriendsModal || openTagModal)}
                />
                {/* ACTION BUTTONS */}
                <Grid
                    container={true}
                    justifyContent={"space-around"}
                    item={true}
                    rowSpacing={1}
                    spacing={{
                        xs: 0,
                        sm: 1
                    }}
                    xs
                >
                    {(!isEditing) &&
                        <>
                            {(checkEnvironmentAndIterationToDisplay(4)) &&
                                <Grid
                                    item={true}
                                    xs={12}
                                    sm // so it shares all available space equally with other sm items
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
                                        {t('buttons.addFriends', { ns: 'common' })}
                                    </Button>
                                </Grid>
                            }
                            {(checkEnvironmentAndIterationToDisplay(2)) &&
                                <Grid
                                    container={true}
                                    item={true}
                                    justifyContent={"center"}
                                    xs={12}
                                    sm // so it shares all available space equally with other sm items
                                >
                                    <Grid
                                        item={true}
                                        xs
                                    >
                                        <Button
                                            variant={"contained"}
                                            color={"info"}
                                            onClick={() => setOpenTagModal(true)}
                                            fullWidth={true}
                                            startIcon={<LocalOfferIcon />}
                                        >
                                            {t('buttons.createTag', { ns: 'common' })}
                                        </Button>
                                    </Grid>
                                </Grid>
                            }
                        </>
                    }
                    {/* Edit user data buttons */}
                    <Grid
                        container={true}
                        justifyContent={"center"}
                        item={true}
                        xs={isEditing ?10 :12}
                        // sm={4}
                        sm // so it shares all available space equally with other sm items
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
                                        onSaveUserChanges(localUserData)
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
                                                (localUserData.username === undefined)
                                                ||
                                                (localUserData.username.length < 3)
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
                                {(isEditing)
                                    ? t('buttons.saveChanges', { ns: 'common' })
                                    : t('buttons.editProfile', { ns: 'common' })
                                }
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
                                        onCancelEditingUSer()
                                    }}
                                    fullWidth={true}
                                    endIcon={<ClearIcon/>}
                                >
                                    {t('buttons.cancel', { ns: 'common' })}
                                </Button>
                            </Grid>
                        }
                    </Grid>
                </Grid>
                {/* TAGS */}
                {(checkEnvironmentAndIterationToDisplay(2)) &&
                    <Grid
                        container={true}
                        justifyContent={"center"}
                        item={true}
                        xs={12}
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
                                    textDecoration: "underline",
                                }}
                            >
                                {t('sections.tags', { ns: 'common' })}:
                            </Typography>
                        </Grid>
                        <Grid
                            item={true}
                            container={true}
                            justifyContent={"center"}
                            sx={{
                                borderRadius: '25px',
                                border: '2px solid black',
                                padding: globalTheme.spacing(2),
                                marginTop: globalTheme.spacing(2)
                            }}
                            xs={12}
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
                                                {t('noTagsCreated', { ns: 'tags' })}
                                            </Typography>
                                            <Button
                                                variant="text"
                                                size="small"
                                                color={"primary"}
                                                onClick={() => navigate('/review')}
                                                disabled={!(checkEnvironmentAndIterationToDisplay(3))}
                                            >
                                                {t('goToAddTags', { ns: 'tags' })}
                                            </Button>
                                        </>
                                    }
                                    {/* FOLLOWED TAGS */}
                                    {(checkEnvironmentAndIterationToDisplay(3)) &&
                                        <Grid
                                            container={true}
                                            justifyContent={'center'}
                                            sx={{
                                                marginTop: globalTheme.spacing(2),
                                                marginBottom: globalTheme.spacing(1)
                                            }}
                                        >
                                            <Grid
                                                item={true}
                                                xs={12}
                                            >
                                                <Divider
                                                    orientation="horizontal"
                                                    flexItem={true}
                                                    sx={{
                                                        "&::before, &::after": {
                                                            borderColor: "black",
                                                        },
                                                    }}
                                                >
                                                    {t('followedTags', { ns: 'tags' })}
                                                </Divider>
                                            </Grid>
                                        </Grid>
                                    }
                                    {((followedTags!!) && (followedTags.length > 0))
                                        ?
                                        <ChipList
                                            itemList={followedTags}
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
                                                {t('noTagsFollowed', { ns: 'tags' })}
                                            </Typography>
                                        </>
                                    }
                                </>
                            }
                        </Grid>
                    </Grid>
                }
            </Grid>
            {/* SECOND COLUMN */}
            {(checkEnvironmentAndIterationToDisplay(4)) &&
                <Grid
                    container={true}
                    justifyContent={"space-around"}
                    item={true}
                    xs={12}
                    lg={6}
                    rowSpacing={2}
                    sx={{
                        paddingTop: '0px !important',
                    }}
                >
                    {/* FRIENDS */}
                    <Grid
                        container={true}
                        justifyContent={"center"}
                        item={true}
                        xs={12}
                        rowSpacing={2}
                        sx={{
                            height: 'fit-content'
                        }}
                    >
                        <Grid
                            item={true}
                            sx={{
                                // paddingTop: '0px !important',
                            }}
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
                                {t('sections.friends', { ns: 'common' })}:
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
                                    direction={'column'}
                                >
                                    <Grid
                                        item={true}
                                        xs={'auto'}
                                    >
                                        <Typography
                                            variant={"h6"}
                                            align={"center"}
                                        >
                                            {t('noFriends', { ns: 'friendship' })}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item={true}
                                        xs={'auto'}
                                    >
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
                                            {t('searchAndAddFriends', { ns: 'friendship' })}
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
                </Grid>
            }
            {(openFriendsModal) &&
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
                    title={(tagIdToShare !== "")
                        ? t('selectFriend', { ns: 'friendship' })
                        : t('searchFriend', { ns: 'friendship' })
                    }
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
            }
            {(openTagModal) &&
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
                        setTriggerGetTagList(status)
                    }}
                    triggerAction={(tagId: string) => {
                        setTagIdToShare(tagId)
                        setOpenTagModal(false)
                        setOpenFriendsModal(true)
                    }}
                    title={(selectedTag !== "")
                        ?undefined
                        : t('buttons.createTag', { ns: 'common' })
                }
                />
            }
        </Grid>
    )
}