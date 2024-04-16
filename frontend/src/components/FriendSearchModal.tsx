import globalTheme from "../theme/theme";
import {Button, Grid, Modal, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import React from "react";
import {AutocompleteSearch} from "./AutocompleteSearch";
import {getUserById, searchUser} from "../features/users/userSlice";
import {FriendshipData, SearchResult, TagData} from "../ts/interfaces";
import {useDispatch, useSelector} from "react-redux";
import {UserBadge} from "./UserBadge";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {toast} from "react-toastify";
import LinearIndeterminate from "./Spinner";
import {createNotification, deleteNotification} from "../features/notifications/notificationSlice";
import {
    createFriendship,
    deleteFriendship,
    getFriendshipsByUserId,
    updateFriendship
} from "../features/friendships/friendshipSlice";
import {acceptFriendRequest, checkIfAlreadyFriend, getFriendRequestButtonLabel} from "./generalUseFunctions";
import {clearOtherUserTags, getTagsByAnotherUserID} from "../features/tags/tagSlice";
import {clearUserResultData} from "../features/users/userSlice";
import {FriendList, TagChipList} from "./GeneralUseComponents";
import {useNavigate} from "react-router-dom";
import {ConfirmationButton} from "./ConfirmationButton";
import SendIcon from '@mui/icons-material/Send';

interface FriendSearchModalProps {
    open: boolean
    setOpen: (value: boolean) => void
    defaultUserId?: string
    reloadFriendList?: () => void
    userList?: FriendshipData[]
    title?: string
}

export const FriendSearchModal = (props: FriendSearchModalProps) => {
    const componentStyles = {
        mainContainer: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(80vw, max-content)',
            background: 'white',
            border: '4px solid #0072CE',
            borderRadius: '25px',
            padding: globalTheme.spacing(3),
            boxShadow: 24,
        },

    }
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state: any) => state.auth)
    const {userList, userResult, isLoadingUser} = useSelector((state: any) => state.user)
    const {isLoadingNotifications, isSuccessNotifications} = useSelector((state: any) => state.notifications)
    const {isSuccessFriendships, isLoadingFriendships, friendships} = useSelector((state: any) => state.friendships)
    const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null)


    const handleOnClose = () => {
        setSelectedUser(null)
        dispatch(clearOtherUserTags())
        dispatch(clearUserResultData())
        props.setOpen(false)
    }

    const [sentRequest, setSentRequest] = useState(false)
    const [cancelledRequest, setCancelledRequest] = useState(false)
    const [deletedRequest, setDeletedRequest] = useState(false)

    useEffect(() => {
        if(props.defaultUserId !== undefined){
            // @ts-ignore
            dispatch(getUserById(props.defaultUserId))
            // @ts-ignore
            dispatch(getTagsByAnotherUserID(props.defaultUserId))
        }
    },[props.defaultUserId])


    useEffect(() => {
        if(userResult !== undefined){
            setSelectedUser({
                id: userResult._id,
                label: userResult.name,
                type: 'user',
                email: userResult.email,
                username: userResult.username
            })
        } else {
            setSelectedUser(null)
        }
    },[userResult])

    useEffect(() => {
        if(
            (
                // delete request does not trigger notifications, so we make it an exception
                ((isSuccessNotifications && !isLoadingNotifications) || deletedRequest)
                && // it's a '&&', so toast is triggered only when both notification and friendship have been updated successfully.
                (isSuccessFriendships && !isLoadingFriendships)
            ) &&
            (sentRequest || cancelledRequest || deletedRequest)
        ){
            if(sentRequest){
                toast.info("Friend request sent")
                setSentRequest(false)
            }
            if(cancelledRequest){
                toast.info("Friend request deleted")
                setCancelledRequest(false)
            }
            if(deletedRequest){
                toast.info("Friendship deleted")
                setDeletedRequest(false)
            }
            if(sentRequest || cancelledRequest || deletedRequest){
                // this will update the button labels
                // @ts-ignore
                dispatch(getFriendshipsByUserId(user._id))
            }
        }
    }, [isSuccessFriendships, isSuccessNotifications, isLoadingNotifications, isLoadingFriendships, sentRequest, cancelledRequest, deletedRequest])

    const sendNotification = (selectedUser: SearchResult) => {
        const newNotification = {
            user: selectedUser.id, // user to be notified
            variant: "friendRequest",
            content: {
                requesterId: user._id, // user that created the request
                requesterUsername: user.username // user that created the request
            }
        }
        // @ts-ignore
        dispatch(createNotification(newNotification))
    }

    const addFriendship = (selectedUser: SearchResult) => {
        setSentRequest(true)
        const newFriendship: FriendshipData = {
            // NB! first userId on the list corresponds to the user that made the request
            // This will be relevant when deciding on the info to display on a pending request
            userIds: [user._id, selectedUser.id],
            status: 'pending',
        }
        // @ts-ignore
        dispatch(createFriendship(newFriendship))
    }

    const cancelRequest = (friendship: FriendshipData) => {
        // @ts-ignore
        dispatch(deleteFriendship(friendship._id))
        setCancelledRequest(true)
        // TODO:
        // => delete notification (at selectedUser.id user)
        // get other userID from friendship
        // get all notifications for that user (possible with current endpoints? Might be protected by middleware)
        // find matching notification (variant: friendship, with current userId as other ID)
        // delete notification by ID

        // alternative: create full endpoint for deleting other users notifications? specify type and id/ids to match?

    }

    const deleteActiveFriendship = (friendship: FriendshipData) => {
        // @ts-ignore
        dispatch(deleteFriendship(friendship._id))
        setDeletedRequest(true)
        if(props.reloadFriendList !== undefined){
            props.reloadFriendList()
        }
    }

    const {otherUserTags, fullTagData, isSuccessTags, isLoadingTags} = useSelector((state: any) => state.tags)
    const [allTags, setAllTags] = useState<TagData[]>([])

    useEffect(() => {
        setAllTags(otherUserTags)
    },[otherUserTags])

    return (
        <Modal
            open={props.open}
            onClose={() => handleOnClose()}
            disableAutoFocus={true}
        >
            <Box
                sx={componentStyles.mainContainer}
            >
                <Grid
                    container={true}
                    item={true}
                    justifyContent={"center"}
                >
                    {(isLoadingUser && (props.defaultUserId !== undefined))
                        ?
                        <Grid
                            item={true}
                            container={true}
                            sx={{
                                width: '500px'
                            }}
                        >
                            <LinearIndeterminate/>
                        </Grid>
                        :
                        (selectedUser === null)
                            ?
                            <Grid
                                item={true}
                                container={true}
                                direction={"column"}
                                alignItems={"center"}
                                rowSpacing={2}
                            >
                                {(props.title !== undefined) &&
                                    <Grid
                                        item={true}
                                    >
                                        <Typography
                                            variant={"h4"}
                                        >
                                            {props.title}
                                        </Typography>
                                    </Grid>
                                }
                                {/* TODO: should add action buttons to interact with selectedUsers list?*/}
                                <Grid
                                    item={true}
                                >
                                    <AutocompleteSearch
                                        options={userList}
                                        getOptions={(inputValue: string) => {
                                            // @ts-ignore
                                            dispatch(searchUser({
                                                nameOrUsernameMatch: inputValue,
                                                searchOnlyFriends: (props.userList !== undefined)!! // only search friends when sending Tag to friends
                                            }))
                                        }}
                                        onSelect={(selection: SearchResult) => {
                                            // TODO: if sharing tag => it should add selection to selectedUsers
                                            setSelectedUser(selection)
                                        }}
                                        isSearchLoading={isLoadingUser}
                                        sxPropsAutocomplete={{
                                            background: '#c7c7c7',
                                            width: '500px',
                                        }}
                                        sxPropsInput={{
                                            color: 'black',
                                        }}
                                        placeholder={"Search for friends..."}
                                        iconColor={"primary"}
                                    />
                                </Grid>
                                {/*  TODO: add userChipList populated with selectUsers */}
                                {(props.userList !== undefined) &&
                                    <Grid
                                        item={true}
                                    >
                                        <FriendList
                                            friendList={props.userList}
                                            onClickAction={(friendshipItem: FriendshipData) => {
                                            }}
                                            actionIcon={<SendIcon/>}
                                        />
                                    </Grid>
                                }
                            </Grid>
                            :
                            <Grid
                                item={true}
                                container={true}
                                rowSpacing={2}
                                sx={{
                                    marginTop: globalTheme.spacing(1)
                                }}
                            >
                                <UserBadge
                                    userData={{
                                        id: selectedUser?.id,
                                        name: selectedUser?.label,
                                        email: (selectedUser.type === "user") ?selectedUser?.email : "",
                                        username: (selectedUser.type === "user") ?selectedUser?.username : "",
                                    }}
                                />
                                {/* TODO: display friends-list of currently selected user */}
                                {(isLoadingTags)
                                    ?
                                    <LinearIndeterminate/>
                                    :
                                    <>
                                        {
                                            (allTags.length > 0) &&
                                            <Grid
                                                item={true}
                                                xs={12}
                                            >
                                                <Typography
                                                    sx={{
                                                        typography: {
                                                            xs: 'h6',
                                                            sm: 'h5',
                                                            md: 'h4',
                                                        },
                                                        textTransform: "uppercase",
                                                        textDecoration: "underline"
                                                    }}
                                                >
                                                    Tags:
                                                </Typography>
                                            </Grid>
                                        }
                                        <TagChipList
                                            tagList={allTags}
                                            onClickAction={(tagId: string) => {
                                                handleOnClose()
                                                // @ts-ignore
                                                navigate(`/tag/${tagId}`)
                                            }}
                                        />
                                    </>
                                }
                                <Grid
                                    container={true}
                                    justifyContent={"space-around"}
                                    item={true}
                                    xs={12}
                                >
                                    {(isLoadingNotifications || isLoadingFriendships) && <LinearIndeterminate/>}
                                    <Grid
                                        item={true}
                                        xs={5}
                                    >
                                        <ConfirmationButton
                                            onConfirm={() => {
                                                const potentialFriendship = checkIfAlreadyFriend(friendships, selectedUser.id)
                                                switch (getFriendRequestButtonLabel(friendships, selectedUser.id)){
                                                    case 0: { // no friendship status yet => create request
                                                        sendNotification(selectedUser)
                                                        addFriendship(selectedUser)
                                                        break
                                                    }
                                                    case 1: { // potentialFriendship listed first => they made the request
                                                        // accept request => delete notification (at currently logged-in user) + update friendship
                                                        break
                                                    }
                                                    case 2: { // potentialFriendship listed first => they made the request
                                                        if(potentialFriendship !== undefined){
                                                            cancelRequest(potentialFriendship)
                                                        }
                                                        break
                                                    }
                                                    case 3: { // potentialFriendship listed first => they made the request
                                                        if(potentialFriendship !== undefined){
                                                            deleteActiveFriendship(potentialFriendship)
                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        break
                                                    }
                                                }
                                            }}
                                            buttonLabel={['Add friend', 'Accept request', 'Cancel request', 'Delete Friendship'][getFriendRequestButtonLabel(friendships, selectedUser.id)]}
                                            buttonProps={{
                                                variant: "contained",
                                                color: ["primary", "success", "error", "error"][getFriendRequestButtonLabel(friendships, selectedUser.id)],
                                                fullWidth: true,
                                                startIcon: [<PersonAddIcon/>, <CheckCircleIcon/>, <CancelIcon/>, <CancelIcon/>][getFriendRequestButtonLabel(friendships, selectedUser.id)]
                                            }}
                                            ignoreConfirmation={
                                                getFriendRequestButtonLabel(friendships, selectedUser.id) === 0
                                                ||
                                                getFriendRequestButtonLabel(friendships, selectedUser.id) === 1
                                            }
                                            confirmationButtonLabel={[undefined, undefined, "Confirm cancel request", "Confirm delete friend"][getFriendRequestButtonLabel(friendships, selectedUser.id)]}
                                        />
                                    </Grid>
                                    <Grid
                                        item={true}
                                        xs={5}
                                    >
                                        <Button
                                            variant={"contained"}
                                            color={"secondary"}
                                            onClick={() => {
                                                setSelectedUser(null)
                                                // defaultUserId !== undefined when user is selected from friendList
                                                // and cancel button should return to friend list - NOT to search
                                                if(props.defaultUserId !== undefined){
                                                    props.setOpen(false)
                                                }
                                            }}
                                            fullWidth={true}
                                            endIcon={<ClearIcon />}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                    }
                </Grid>
            </Box>
        </Modal>
    )
}