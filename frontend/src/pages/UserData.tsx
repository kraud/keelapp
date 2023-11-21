import React, {useEffect, useState} from "react"
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {Button, Chip, Grid, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import Avatar from "@mui/material/Avatar";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import {searchAllTags} from "../features/words/wordSlice";
import LinearIndeterminate from "../components/Spinner";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {FriendSearchModal} from "../components/FriendSearchModal";
import {UserBadge} from "../components/UserBadge";
import {TagInfoModal} from "../components/TagInfoModal";
import {toast} from "react-toastify";
import {updateUser} from "../features/auth/authSlice";
import {useNavigate} from "react-router-dom";
import {stringAvatar} from "../components/generalUseFunctions";
import {getFriendshipsByUserId} from "../features/friendships/friendshipSlice";
import {FriendshipData} from "../ts/interfaces";

interface UserDataProps {

}

export interface UserBadgeData {
    id: string,
    name: string,
    username: string,
    email: string
}

export const UserData = (props: UserDataProps) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user, isLoading, isSuccess} = useSelector((state: any) => state.auth)
    const {tags, isTagSearchLoading} = useSelector((state: any) => state.words)
    const {friendships, isSuccessFriendships, isLoadingFriendships} = useSelector((state: any) => state.friendships)
    const [allTags, setAllTags] = useState<string[]>([])
    const [activeFriendships, setActiveFriendships] = useState<FriendshipData[]>([])
    const [openFriendsModal, setOpenFriendsModal] = useState(false)
    const [openTagModal, setOpenTagModal] = useState(false)
    const [selectedTag, setSelectedTag] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [localUserData, setLocalUserData] = useState<UserBadgeData | null>(null)

    // const friendList: string[] = []
    // const friendList = ["friendo"]
    const friendList = ["Friendo One", "Amigou Dos", "Sõber kolm neli", "Freundy vier", "Another Dude", "friend6"]

    useEffect(() => {
        setActiveFriendships(
            friendships.filter((friendship: FriendshipData) => {
                return(friendship.status === 'accepted')
            })
        )
    },[activeFriendships])

    useEffect(() => {
        setActiveFriendships(
            friendships.filter((friendship: FriendshipData) => {
                return(friendship.status === 'accepted')
            })
        )
    },[friendships])

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
        // @ts-ignore
        dispatch(searchAllTags(""))
        // @ts-ignore
        dispatch(getFriendshipsByUserId(user._id))
    },[])

    useEffect(() => {
        if(!isLoading && isSuccess && !openFriendsModal){
            toast.info("User data updated successfully!")
        }
    },[isLoading, isSuccess])

    const onSaveChanges = (newLocalUserData: UserBadgeData) => {
        // @ts-ignore
        dispatch(updateUser(newLocalUserData))
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
                isLoading={isLoading && !(openFriendsModal || openTagModal)}
            />
            {/* BUTTONS */}
            <Grid
                container={true}
                justifyContent={"space-around"}
                item={true}
                xs={12}
            >
                <Grid
                    item={true}
                    xs={5}
                >
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        onClick={() => setOpenFriendsModal(true)}
                        fullWidth={true}
                        startIcon={<PersonAddIcon />}
                    >
                        Add friends
                    </Button>
                </Grid>
                <Grid
                    container={true}
                    justifyContent={"center"}
                    item={true}
                    xs={5}
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
                                    setLocalUserData(user)
                                    setIsEditing(false)
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
                    {(isTagSearchLoading)
                        ?
                        <LinearIndeterminate/>
                        :
                        (allTags.length > 0)
                            ?
                            (allTags.map((tag: string, index: number) => {
                                return(
                                    <Grid
                                        item={true}
                                        key={index.toString()+'-'+tag}
                                    >
                                        <Chip
                                            variant="filled"
                                            label={tag}
                                            color={"secondary"}
                                            sx={{
                                                maxWidth: "max-content",
                                            }}
                                            onClick={() => {
                                                // TODO: temporary function? It should open modal with list of words
                                                //  + options to hide the tag from friends, send tag to friend, etc?
                                                // navigate('/review/tags?tags='+tag)
                                                setSelectedTag(tag)
                                            }}
                                        />
                                    </Grid>
                                )
                            }))
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
                    {(activeFriendships.length === 0)
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
                        (activeFriendships.map((friend: FriendshipData, index: number) => {
                            const friendId: string = friend.userIds.filter((friendshipMemberId: string) => {
                                return (friendshipMemberId !== user._id)
                            })[0]
                            return(
                                // TODO: make this into a separate component - to list users
                                <Grid
                                    container={true}
                                    item={true}
                                    xs={12}
                                    key={index}
                                    sx={{
                                        background: (index % 2 === 0) ?"#c7c7c7" :undefined,
                                        paddingY: globalTheme.spacing(1),
                                        borderRight: '1px solid black',
                                        borderLeft: '1px solid black',
                                        borderTop: (index === 0) ?'1px solid black' :"none",
                                        borderBottom: "1px solid black",
                                        borderRadius: (index === 0)
                                            ? "25px 25px 0 0"
                                            : (index === (activeFriendships.length -1))
                                                ? " 0 0 25px 25px"
                                                : undefined
                                    }}
                                >
                                    {/* AVATAR */}
                                    <Grid
                                        container={true}
                                        item={true}
                                        justifyContent={"center"}
                                        xs={"auto"} // width: max-content
                                        sx={{
                                            paddingX: globalTheme.spacing(1),
                                        }}
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
                                                    margin: globalTheme.spacing(1),
                                                    bgcolor: "#0072CE",
                                                    ...((stringAvatar(friendId, "color")).sx),
                                                }}
                                                {...stringAvatar(friendId, "children")}
                                            />
                                        </Grid>
                                    </Grid>
                                    {/* FRIEND'S NAME */}
                                    <Grid
                                        container={true}
                                        alignItems={"center"}
                                        item={true}
                                        xs // width: all-available
                                    >
                                        <Grid
                                            item={true}
                                            sx={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    typography: {
                                                        xs: 'h5',
                                                        sm: 'h4',
                                                        md: 'h3',
                                                    },
                                                    textTransform: "capitalize"
                                                }}
                                                noWrap={true}
                                            >
                                                {friendId}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    {/* ACTION BUTTON */}
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
                                                color={"primary"}
                                            >
                                                <ArrowForwardIosIcon/>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )
                        }))
                    }
                </Grid>
            </Grid>
            <FriendSearchModal
                open={openFriendsModal}
                setOpen={(value: boolean) => setOpenFriendsModal(value)}
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
            />
        </Grid>
    )
}