import globalTheme from "../theme/theme";
import {Grid, Typography} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React from "react";

interface UserBadgeProps {
    userData: {
        id: string,
        name: string,
        email: string,
        username?: string
        // eventually add data about profile picture
    }
}

export const UserBadge = (props: UserBadgeProps) => {

    return(
        <Grid
            container={true}
            justifyContent={"flex-start"}
            item={true}
            xs={12}
            sx={{
                border: '2px solid #0072CE',
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
                                md: 'h2',
                            },
                            textTransform: "capitalize"
                        }}
                    >
                        {props.userData.name}
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
                                md: 'h4',
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
                                md: 'h5',
                                textTransform: "all-lowercase"
                            },
                        }}
                    >
                        {props.userData.email}
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
                        sx={{
                            width: {
                                xs:'75px',
                                md:'125px',
                            },
                            height: {
                                xs:'75px',
                                md:'125px',
                            },
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}