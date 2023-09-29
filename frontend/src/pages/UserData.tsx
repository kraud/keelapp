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
import {useNavigate, useSearchParams} from "react-router-dom";
import LinearIndeterminate from "../components/Spinner";

interface UserDataProps {

}

export const UserData = (props: UserDataProps) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let  [searchParams, setSearchParams]  = useSearchParams();
    const {user} = useSelector((state: any) => state.auth)
    const {searchResults, isSearchLoading} = useSelector((state: any) => state.words)
    const [allTags, setAllTags] = useState<string[]>([])

    const friendList = ["friend1", "friend2", "friend3", "friend4","friend5", "friend6"]

    useEffect(() => {
        setAllTags(searchResults)
    },[searchResults])

    useEffect(() => {
        // @ts-ignore
        dispatch(searchAllTags(""))
    },[])

    return(
        <Grid
            component={motion.div} // to implement animations with Framer Motion
            variants={routeVariantsAnimation}
            initial="initial"
            animate="final"
            container={true}
            sx={{
                marginTop: globalTheme.spacing(4),
            }}
            rowSpacing={2}
        >
            <Grid
                container={true}
                justifyContent={"flex-start"}
                item={true}
                xs={12}
                sx={{
                    border: '1px solid black',
                    borderRadius: '25px',
                    padding: globalTheme.spacing(2),
                }}
            >
                <Grid
                    container={true}
                    item={true}
                    alignItems={"center"}
                    xs={9}
                >
                    <Grid
                        item={true}
                        xs={12}
                    >
                        <Typography
                            sx={{
                                typography: {
                                    xs: 'h4',
                                    sm: 'h3',
                                    md: 'h1',
                                },
                                textTransform: "capitalize"
                            }}
                        >
                            {user?.name}
                        </Typography>
                    </Grid>
                    <Grid
                        item={true}
                        xs={12}
                    >
                        <Typography
                            sx={{
                                typography: {
                                    xs: 'h6',
                                    sm: 'h5',
                                    md: 'h2',
                                    textTransform: "capitalize"
                                },
                            }}
                        >
                            {/*{user?.name}*/}
                            Username
                        </Typography>
                    </Grid>
                    <Grid
                        item={true}
                        xs={12}
                    >
                        <Typography
                            sx={{
                                typography: {
                                    xs: 'body1',
                                    sm: 'h6',
                                    md: 'h3',
                                    textTransform: "all-lowercase"
                                },
                            }}
                        >
                            {user?.email}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    container={true}
                    item={true}
                    xs={3}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <Grid
                        item={true}
                    >
                        <Avatar
                            alt="User photo"
                            src={(user) ? "" : "/"}
                            sx={{
                                width: '75px',
                                height: '75px',
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
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
                        onClick={() => null}
                        fullWidth={true}
                        startIcon={<PersonAddIcon />}
                    >
                        Add friends
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
                        endIcon={<SettingsIcon />}
                    >
                        Edit profile
                    </Button>
                </Grid>
            </Grid>
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
                >
                    {(isSearchLoading)
                        ?
                        <LinearIndeterminate/>
                        :
                        (allTags.map((tag: string, index: number) => {
                            return(
                                <Grid
                                    item={true}
                                    key={index}
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
                                            navigate('/review/tags?tags='+tag)
                                        }}
                                    />
                                </Grid>
                            )
                        }))
                    }
                </Grid>
            </Grid>
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
                        Friends:
                    </Typography>
                </Grid>
                <Grid
                    item={true}
                    container={true}
                >
                    {
                        (friendList.map((friend: string, index: number) => {
                            return(
                                <Grid
                                    container={true}
                                    item={true}
                                    xs={12}
                                    key={index}
                                    sx={{
                                        background: (index % 2 === 0) ?"#c7c7c7" :undefined,
                                        paddingY: globalTheme.spacing(1),
                                        borderBottom: (index === friendList.length -1) ?'1px solid black' :"none",
                                    }}
                                >
                                    <Grid
                                        item={true}
                                        sx={{
                                            borderRight: '1px solid black',
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
                                        >
                                            {friend}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item={true}
                                    >

                                    </Grid>
                                </Grid>
                            )
                        }))
                    }
                </Grid>
            </Grid>
        </Grid>
    )
}