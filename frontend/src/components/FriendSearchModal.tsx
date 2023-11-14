import globalTheme from "../theme/theme";
import {Button, Grid, Modal} from "@mui/material";
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import React from "react";
import {AutocompleteSearch} from "./AutocompleteSearch";
import {searchUser} from "../features/auth/authSlice";
import {FriendshipData, SearchResult} from "../ts/interfaces";
import {useDispatch, useSelector} from "react-redux";
import {UserBadge} from "./UserBadge";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ClearIcon from '@mui/icons-material/Clear';
import {toast} from "react-toastify";
import LinearIndeterminate from "./Spinner";
import {createNotification} from "../features/notifications/notificationSlice";
import {createFriendship} from "../features/friendships/friendshipSlice";

interface FriendSearchModalProps {
    open: boolean
    setOpen: (value: boolean) => void
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
    const dispatch = useDispatch()
    const {user, userList, isLoading} = useSelector((state: any) => state.auth)
    const {isLoadingNotifications, isSuccessNotifications} = useSelector((state: any) => state.notifications)
    const {isSuccessFriendships, isLoadingFriendships, friendships} = useSelector((state: any) => state.friendships)
    const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null)


    const handleOnClose = () => {
        props.setOpen(false)
        setSelectedUser(null)
    }

    const [sentRequest, setSentRequest] = useState(false)
    useEffect(() => {
        if(isSuccessNotifications && isSuccessFriendships && sentRequest){
            toast.info("Friend request sent") // TODO: message should change depending on action? Sent/cancelled?
            setSentRequest(false)
        }
    }, [isSuccessFriendships, isSuccessNotifications, sentRequest])

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
            userIds: [user.id, selectedUser.id],
            status: 'pending',
        }
        // @ts-ignore
        dispatch(createFriendship(newFriendship))
    }

    const checkIfAlreadyFriend = (potentialFriendId: string): (FriendshipData | undefined) => {
        return(
            friendships.find((friendship: FriendshipData) => {
                friendship.userIds.includes(potentialFriendId)
                // implied that currently-logged-in user's id is present in all locally-available friendships
                // friendship.userIds.includes(user._id)
            })
        )
    }

    const getFriendRequestButtonLabel = (potentialFriendId: string): string => {
        const friendship = checkIfAlreadyFriend(potentialFriendId)

        if(friendship === undefined){ // No friendship (yet!)
            return('Add friend')
        } else {
            if(friendship.userIds[0] === potentialFriendId){ // potentialFriend listed first => they made the request
                return('Accept request')
            } else { // currently logged-in user made the request => disable button? Cancel request?
                return('Cancel request')
            }
        }
    }

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
                    {(selectedUser === null)
                        ?
                        <Grid
                            item={true}
                        >
                            <AutocompleteSearch
                                options={userList}
                                getOptions={(inputValue: string) => {
                                    // @ts-ignore
                                    dispatch(searchUser(inputValue))
                                }}
                                onSelect={(selection: SearchResult) => {
                                    // trigger more detailed search for user data?
                                    // navigate(`/word/${selection.id}`) // should we somehow check if value.id is something valid?
                                    setSelectedUser(selection)
                                }}
                                isSearchLoading={isLoading}
                                sxPropsAutocomplete={{
                                    background: '#c7c7c7',
                                }}
                                sxPropsInput={{
                                    color: 'black',
                                }}
                                placeholder={"Search for friends..."}
                                iconColor={"primary"}
                            />
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
                            {/* TODO: should check if friend is on logged-in user's friend list => display different buttons */}
                            <UserBadge
                                userData={{
                                    id: selectedUser?.id,
                                    name: selectedUser?.label,
                                    email: (selectedUser.type === "user") ?selectedUser?.email : "",
                                    username: (selectedUser.type === "user") ?selectedUser?.username : "",
                                }}
                            />
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
                                    <Button
                                        variant={"contained"}
                                        color={"primary"}
                                        onClick={() => {
                                            const potentialFriend = checkIfAlreadyFriend(selectedUser.id)
                                            if(potentialFriend !== undefined){
                                                if(potentialFriend.userIds[0] === selectedUser.id){ // potentialFriend listed first => they made the request
                                                    // accept request => delete notification (at currently logged-in user) + update friendship
                                                } else { // currently logged-in user made the request => disable button? Cancel request?
                                                    // cancel request => delete notification (at selectedUser.id user) + delete friendship
                                                }
                                            } else { // no friendship status yet => create request
                                                sendNotification(selectedUser)
                                                addFriendship(selectedUser)
                                            }
                                        }}
                                        fullWidth={true}
                                        startIcon={<PersonAddIcon />}
                                    >
                                        {getFriendRequestButtonLabel(selectedUser.id)}
                                    </Button>
                                </Grid>
                                <Grid
                                    item={true}
                                    xs={5}
                                >
                                    <Button
                                        variant={"contained"}
                                        color={"secondary"}
                                        onClick={() => null}
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