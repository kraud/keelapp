import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {Grid, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {FriendshipData, NotificationData} from "../ts/interfaces";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import IconButton from "@mui/material/IconButton";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ClearIcon from '@mui/icons-material/Clear';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import {updateNotification, getNotifications, deleteNotification} from "../features/notifications/notificationSlice";
import LinearIndeterminate from "../components/Spinner";
import Tooltip from "@mui/material/Tooltip";

interface NotificationHubProps {

}

export const NotificationHub = (props: NotificationHubProps) => {
    const dispatch = useDispatch()
    const {isSuccessFriendships, isLoadingFriendships, friendships} = useSelector((state: any) => state.friendships)
    const [changedNotificationList, setChangedNotificationList] = useState(false)
    const {notifications, isLoadingNotifications, isSuccessNotifications} = useSelector((state: any) => state.notifications)
    useEffect(() => {
        // @ts-ignore
        dispatch(getNotifications())
    }, [])

    useEffect(() => {
        if(isSuccessNotifications && changedNotificationList && !isLoadingNotifications){
            // @ts-ignore
            dispatch(getNotifications())
            setChangedNotificationList(false)
        }
    }, [isSuccessNotifications, changedNotificationList, isLoadingNotifications])

    // TODO: if id in URL does not match currently logged-in user => change URL to match? go back dashboard?

    const getDescription = (notification: NotificationData) => {
        switch (notification.variant) {
            case("friendRequest"): {
                const friendUsername: string = notification.content.requesterUsername
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
                                                // margin: globalTheme.spacing(1),
                                                bgcolor: (notification.dismissed) ?"black" :"#0072CE"
                                            }}
                                        >
                                            {/* TODO: this should have the initials of the requester */}
                                            <PersonIcon/>
                                        </Avatar>
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
                                    title={"Accept friendship request"}
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
                                                <PersonAddIcon/>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Tooltip>
                                {/* DELETE */}
                                <Tooltip
                                    title={"Delete notification"}
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
                                                <ClearIcon/>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Tooltip>
                                {/* SNOOZE */}
                                <Tooltip
                                    title={"Set notification as read"}
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
                                                <NotificationsOffIcon/>
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
        // TODO: create friendship on BE and then delete the notification
        setChangedNotificationList(true)
        // @ts-ignore
        dispatch(deleteNotification(notification._id))

        switch(notification.variant){
            case('friendRequest'):{
                const friendship = friendships.filter((friendship: FriendshipData) => {
                    return(friendship.userIds[0] == notification.content.requesterId)
                })
                // @ts-ignore
                dispatch(deleteNotification(notification._id))
                break
            }
            default: return(null)
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