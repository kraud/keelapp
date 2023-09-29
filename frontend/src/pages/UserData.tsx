import React from "react"
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {Button, Grid, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import Avatar from "@mui/material/Avatar";

interface UserDataProps {

}

export const UserData = (props: UserDataProps) => {
    const {user} = useSelector((state: any) => state.auth)

    const friendList = ["friend1", "friend2", "friend3", "friend4","friend5", "friend6"]

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
                justifyContent={"space-between"}
                item={true}
                xs={12}
                spacing={2}
            >
                <Grid
                    item={true}
                    xs={6}
                >
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        onClick={() => null}
                        fullWidth={true}
                    >
                        Add friends
                    </Button>
                </Grid>
                <Grid
                    item={true}
                    xs={6}
                >
                    <Button
                        variant={"contained"}
                        color={"secondary"}
                        onClick={() => null}
                        fullWidth={true}
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
                                    item={true}
                                    xs={12}
                                    key={index}
                                >
                                    <Typography
                                        sx={{
                                            typography: {
                                                xs: 'h5',
                                                sm: 'h4',
                                                md: 'h3',
                                            },
                                        }}
                                    >
                                        {friend}
                                    </Typography>
                                </Grid>
                            )
                        }))
                    }
                </Grid>
            </Grid>
        </Grid>
    )
}