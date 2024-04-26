import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {Grid, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {NotificationData} from "../ts/interfaces";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import {updateNotification, getNotifications, deleteNotification} from "../features/notifications/notificationSlice";
import LinearIndeterminate from "../components/Spinner";
import Tooltip from "@mui/material/Tooltip";
import {updateFriendship, getFriendshipsByUserId} from "../features/friendships/friendshipSlice";
import {toast} from "react-toastify";
import {acceptFriendRequest, stringAvatar} from "../components/generalUseFunctions";
import {useNavigate, useParams} from "react-router-dom";

interface RouterNotificationProps{
    userId: string
}

interface NotificationHubProps {

}

export const NotificationHub = (props: NotificationHubProps) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state: any) => state.auth)
    const {isSuccessFriendships, isLoadingFriendships, friendships} = useSelector((state: any) => state.friendships)
    const {notifications, isLoadingNotifications, isSuccessNotifications} = useSelector((state: any) => state.notifications)
    // @ts-ignore
    const { userId } = useParams<RouterNotificationProps>()

    const [changedNotificationList, setChangedNotificationList] = useState(false)
    const [changedFriendshipList, setChangedFriendshipList] = useState(false)

    useEffect(() => {
        if(userId !== user._id){
            navigate(`/user/${user._id}/notifications`)
        } else {
            // @ts-ignore
            dispatch(getNotifications())
            // @ts-ignore
            dispatch(getFriendshipsByUserId(user._id))
        }
    }, [])

    useEffect(() => {
        if(isSuccessNotifications && changedNotificationList && !isLoadingNotifications){
            // @ts-ignore
            dispatch(getNotifications())
            setChangedNotificationList(false)
        }
    }, [isSuccessNotifications, changedNotificationList, isLoadingNotifications])

    useEffect(() => {
        if(isSuccessFriendships && changedFriendshipList && !isLoadingFriendships){
            // @ts-ignore
            dispatch(getFriendshipsByUserId(user._id))
            setChangedFriendshipList(false)
            toast.info("Friend request accepted")
        }
    }, [isLoadingFriendships, changedNotificationList])

    const getDescription = (notification: NotificationData) => {
        switch (notification.variant) {
            case("friendRequest"): {
                const friendUsername: string = notification.notificationSender!.username
                return (
                    <Typography
                        sx={{
                            typography: {
                                xs: 'body2',
                                sm: 'body1',
                                md: 'h6',
                            },
                        }}
                    >
                        {friendUsername} sent a friend request
                    </Typography>
                )
            }
            case("shareTagRequest"): {
                const otherUserUsername: string = notification.notificationSender!.username
                const tagName: string = (notification.notificationTag !== undefined)  ? notification.notificationTag.label : '--'
                return (
                    <Typography
                        sx={{
                            typography: {
                                xs: 'body2',
                                sm: 'body1',
                                md: 'h6',
                            },
                        }}
                    >
                        {otherUserUsername} wants to share the '{tagName}' tag with you.
                    </Typography>
                )
            }
            default:
                return (
                    <Typography
                        sx={{
                            typography: {
                                xs: 'h5',
                                sm: 'h4',
                                md: 'h3',
                            },
                            textTransform: "capitalize"
                        }}
                    >
                        - there was an unexpected error -
                    </Typography>
                )
        }
    }

    const getListOfNotification = () => {
        if(notifications!!){
            return(
                <Grid
                    container={true}
                    item={true}
                >
                    {(notifications).map((notification: NotificationData, index: number) => {
                        const avatarUsername: string = notification.notificationSender!.username
                        return (
                            <Grid
                                container={true}
                                item={true}
                                // spacing={1}
                                xs={12}
                                key={index}
                                sx={{
                                    paddingX: globalTheme.spacing(3),
                                    background: (index % 2 === 0) ? "#c7c7c7" : undefined,
                                    paddingY: globalTheme.spacing(2),
                                    borderRight: '3px solid black',
                                    borderLeft: '3px solid black',
                                    borderTop: (index === 0) ? '3px solid black' : "none",
                                    borderBottom: "3px solid black",
                                    borderRadius:
                                        (notifications.length === 1)
                                            ? '25px'
                                            : (index === 0)
                                                ? "25px 25px 0 0"
                                                : (index === (notifications.length - 1))
                                                    ? " 0 0 25px 25px"
                                                : undefined,
                                    borderColor: (notification.dismissed) ?"black" :"#0072CE",
                                }}
                            >
                                {/* AVATAR */}
                                <Grid
                                    container={true}
                                    item={true}
                                    justifyContent={"center"}
                                    xs={"auto"} // width: max-content
                                >
                                    <Grid
                                        item={true}
                                    >
                                        <Avatar
                                            alt="User photo"
                                            src={(index % 2 === 0) ? "" : "/"}
                                            color={"primary"}
                                            sx={{
                                                width: '45px',
                                                height: '45px',
                                                bgcolor: (notification.dismissed) ?"black" :"#0072CE",

                                                ...((stringAvatar(avatarUsername, "color")).sx),
                                            }}

                                            {...stringAvatar(avatarUsername, "children")
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                {/* DESCRIPTION */}
                                <Grid
                                    container={true}
                                    alignItems={"center"}
                                    item={true}
                                    xs // width: all-available
                                    sx={{
                                        paddingLeft: globalTheme.spacing(2),
                                    }}
                                >
                                    <Grid
                                        item={true}
                                    >
                                        {getDescription(notification)}
                                    </Grid>
                                </Grid>
                                {/* ACTION BUTTON */}
                                <Tooltip
                                    title={getTooltipLabel({variant: notification.variant, action: 'accept'})}
                                >
                                    <Grid
                                        container={true}
                                        alignItems={"center"}
                                        item={true}
                                        xs={"auto"} // width: max-content
                                    >
                                        <Grid
                                            item={true}
                                        >
                                            <IconButton
                                                onClick={() => onClickAccept(notification)}
                                                color={"primary"}
                                                sx={{
                                                    color: (notification.dismissed) ?"black" :"#0072CE"
                                                }}
                                            >
                                                {getIcon({variant: notification.variant, action: 'accept'})}
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Tooltip>
                                {/* DELETE */}
                                <Tooltip
                                    title={getTooltipLabel({variant: notification.variant, action: 'delete'})}
                                >
                                    <Grid
                                        container={true}
                                        alignItems={"center"}
                                        item={true}
                                        xs={"auto"} // width: max-content
                                    >
                                        <Grid
                                            item={true}
                                        >
                                            <IconButton
                                                onClick={() => onClickDelete(notification)}
                                                color={"primary"}
                                                sx={{
                                                    color: (notification.dismissed) ?"black" :"#0072CE"
                                                }}
                                            >
                                                {getIcon({variant: notification.variant, action: 'delete'})}
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Tooltip>
                                {/* SNOOZE */}
                                <Tooltip
                                    title={getTooltipLabel({variant: notification.variant, action: 'ignore'})}
                                >
                                    <Grid
                                        container={true}
                                        alignItems={"center"}
                                        item={true}
                                        xs={"auto"} // width: max-content
                                    >
                                        <Grid
                                            item={true}
                                        >
                                            <IconButton
                                                onClick={() => onClickSnooze(notification)}
                                                color={"primary"}
                                                sx={{
                                                    color: (notification.dismissed) ?"black" :"#0072CE"
                                                }}
                                            >
                                                {getIcon({variant: notification.variant, action: 'ignore'})}
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Tooltip>
                            </Grid>
                        )
                    })}
                </Grid>
            )
        } else  {
            return null
        }
    }

    const onClickDelete = (notification: NotificationData) => {
        setChangedNotificationList(true)
        // @ts-ignore
        dispatch(deleteNotification(notification._id))
    }

    const onClickAccept = (notification: NotificationData) => {
        switch(notification.variant){
            case('friendRequest'):{
                acceptFriendRequest(
                    notification,
                    friendships,
                    (notificationId) => {
                        // @ts-ignore
                        dispatch(deleteNotification(notificationId))
                    },
                    (notificationData) => {
                        // @ts-ignore
                        dispatch(updateFriendship(notificationData))
                    },
                    () => {
                        setChangedNotificationList(true)
                        setChangedFriendshipList(true)
                    }
                )
                break
            }
            // TODO: shareTagRequest
            default: return null
        }
    }

    const getIcon = (notificationData: {variant: 'friendRequest'|'shareTagRequest', action: 'accept'|'ignore'|'delete'}) => {
        switch(notificationData.variant){
            case('friendRequest'):{
                switch(notificationData.action){
                    case('accept'):{
                        return(<PersonAddIcon/>)
                    }
                    case('ignore'):{
                        return(<NotificationsOffIcon/>)
                    }
                    case('delete'):{
                        return(<ClearIcon/>)
                    }
                    default: return(<DoneIcon/>)
                }
            }
            case('shareTagRequest'):{
                switch(notificationData.action){
                    case('accept'):{
                        return(<BookmarkAddIcon/>)
                    }
                    case('ignore'):{
                        return(<NotificationsOffIcon/>)
                    }
                    case('delete'):{
                        return(<BookmarkRemoveIcon/>)
                    }
                    default: return(<DoneIcon/>)
                }
            }
            default: return(<DoneIcon/>)
        }
    }

    const getTooltipLabel = (notificationData: {variant: 'friendRequest'|'shareTagRequest', action: 'accept'|'ignore'|'delete'}) => {
        switch(notificationData.variant){
            case('friendRequest'):{
                switch(notificationData.action){
                    case('accept'):{
                        return("Accept friendship request")
                    }
                    case('ignore'):{
                        return("Set notification as read")
                    }
                    case('delete'):{
                        return("Delete notification")
                    }
                    default: return("") // Tooltip will not be displayed if label === ""
                }
            }
            case('shareTagRequest'):{
                switch(notificationData.action){
                    case('accept'):{
                        return("Add tag")
                    }
                    case('ignore'):{
                        return("Set notification as read")
                    }
                    case('delete'):{
                        return("Delete notification")
                    }
                    default: return("") // Tooltip will not be displayed if label === ""
                }
            }
            default: return(<DoneIcon/>)
        }
    }

    const onClickSnooze = (notification: NotificationData) => {
        const updatedNotificationData = {
            _id: notification._id,
            dismissed: !(notification.dismissed)
        }
        setChangedNotificationList(true)
        // @ts-ignore
        dispatch(updateNotification(updatedNotificationData))
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
            xs={12}
            md={6}
            lg={4}
        >
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
                        Notifications:
                    </Typography>
                </Grid>
                {(isLoadingNotifications) && <LinearIndeterminate/>}
                {(notifications.length > 0)
                    ?
                        getListOfNotification()
                    :
                        <Grid
                            item={true}
                        >
                            <Typography
                                sx={{
                                    typography: {
                                        xs: 'body2',
                                        sm: 'h6',
                                        md: 'h5',
                                    },
                                }}
                            >
                                Nothing to see here (yet!)...
                            </Typography>
                        </Grid>
                }
            </Grid>
        </Grid>
    )

}