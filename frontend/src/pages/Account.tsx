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
import {FriendshipData, SearchResult} from "../ts/interfaces";
import {getUsernamesByIds} from "../features/users/userSlice";

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
    const {user, isLoadingAuth, isSuccess} = useSelector((state: any) => state.auth)
    const {userList, isLoadingUser} = useSelector((state: any) => state.user)
    const {tags, isTagSearchLoading} = useSelector((state: any) => state.words)
    const {friendships, isSuccessFriendships, isLoadingFriendships} = useSelector((state: any) => state.friendships)
    const [allTags, setAllTags] = useState<string[]>([])
    const [activeFriendships, setActiveFriendships] = useState<FriendshipData[]>([])
    const [openFriendsModal, setOpenFriendsModal] = useState(false)
    const [openTagModal, setOpenTagModal] = useState(false)
    const [selectedTag, setSelectedTag] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [localUserData, setLocalUserData] = useState<UserBadgeData | null>(null)

    const friendList = ["Friendo One", "Amigou Dos", "Sõber kolm neli", "Freundy vier", "Another Dude", "friend6"]

    useEffect(() => {
        if(!openFriendsModal){
            if(userList!!){
                // TODO: move this whole logic to a separate function (should be done fully on BE maybe?)
                // userList data (into) => friendships
                const acceptedFriendships = friendships.filter((friendship: FriendshipData) => {
                    return(friendship.status === 'accepted')
                })
                let completeFriendshipData = acceptedFriendships.map((amistad: FriendshipData) => {
                    const otherUserId = (amistad.userIds[0] === user._id) ?amistad.userIds[1] :amistad.userIds[0]
                    const otherUserResult = userList.filter((storedUser: SearchResult) => {
                        return(storedUser.id === otherUserId)
                    })
                    let otherUserUsername
                    if(otherUserResult !== undefined && (otherUserResult.length > 0)){
                        // TODO: add other cases depending on the type of notification?
                        switch(otherUserResult[0].type){
                            case('user'): {
                                // TODO: check if always single result possible? Can't be friends twice, right?
                                otherUserUsername = otherUserResult[0].username
                                break
                            }
                            default: {
                                otherUserUsername = '-'
                                break
                            }
                        }
                    }
                    return({
                        ...amistad,
                        usernames: [otherUserUsername, user.username]
                    })
                })
                setActiveFriendships(completeFriendshipData)
            }
        }
    },[userList])

    useEffect(() => {
        const acceptedFriendships = friendships.filter((friendship: FriendshipData) => {
            return(friendship.status === 'accepted')
        })
        if(acceptedFriendships.length > 0){ // if there are no yet-accepted friendships, then no need to get any usernames
            // all the ids of the users that the current user is friends with
            const userIds = acceptedFriendships.map((friendship: FriendshipData) => {
                if(friendship.userIds[0] === user._id){
                    return friendship.userIds[1]
                } else {
                    return friendship.userIds[0]
                }
            })
            // @ts-ignore
            dispatch(getUsernamesByIds(userIds))
        }
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
        if(!isLoadingAuth && isSuccess && !openFriendsModal){
            toast.info("User data updated successfully!")
        }
    },[isLoadingAuth, isSuccess])

    const onSaveChanges = (newLocalUserData: UserBadgeData) => {
        // @ts-ignore
        dispatch(updateUser(newLocalUserData))
    }

    const displayFriendDetails = (friendshipInfo: FriendshipData) => {
        const friendId = (friendshipInfo.userIds[0] === user._id) ? friendshipInfo.userIds[1] : friendshipInfo.userIds[0]

        // TODO: create state to set as default in FriendSearchModal as selectedUser
        // maybe simply give userId and request should be made inside the modal?
        setOpenFriendsModal(true)
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
                isLoading={isLoadingAuth && !(openFriendsModal || openTagModal)}
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
                    {((isLoadingFriendships || isLoadingUser) && !openFriendsModal)
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
                        (activeFriendships.map((friendshipItem: FriendshipData, index: number) => {
                            // TODO: mostrar placeholders mientras cargan los useranames? dependerían de isLoadingUser
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
                                                    ...((stringAvatar((friendshipItem.usernames!!) ?friendshipItem.usernames![0] :"-", "color")).sx),
                                                }}
                                                {...stringAvatar((friendshipItem.usernames!!) ?friendshipItem.usernames![0] :"-", "children")}
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
                                                {friendshipItem.usernames![0]}
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
                                                onClick={() => {
                                                    displayFriendDetails(friendshipItem)
                                                }}
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