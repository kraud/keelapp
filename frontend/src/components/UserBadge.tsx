import globalTheme from "../theme/theme";
import {Grid, TextField, Typography} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React from "react";

type EditingProps = {
    isEditing?: boolean // when true => user and username become TextFields
    returnFieldsData?:
        (fieldsData: {
            username?: string,
            name?: string
            // later it will be possible to change currently active languages and others
        }) => void
}

type UserBadgeProps = {
    userData: {
        id: string,
        name: string,
        email: string,
        username?: string
        // eventually add data about profile picture
    }
} & EditingProps

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
                    {(props.isEditing!!)
                        ?
                        <TextField
                            label={"Username"}
                            type={"text"}
                            fullWidth={true}
                            value={props.userData.username}
                            // onChange={(value) => props.returnFieldsData({
                            //     username: value.target.value,
                            // })}
                        />
                        :
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
                            {(props.userData.username !== undefined)
                                ? props.userData.username
                                : "-username"
                            }
                        </Typography>
                    }
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