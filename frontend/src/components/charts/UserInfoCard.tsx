import {Grid, Typography} from "@mui/material";
import React from "react";
import globalTheme from "../../theme/theme";
import {useNavigate} from 'react-router-dom';


interface UserInfoCard {
    title: string,
    data: string,
    link?: string
}
export function UserInfoCard(prop: UserInfoCard) {

    const navigate = useNavigate();

    const handleRedirect = (link: string | undefined) => {
        if (link !== undefined) {
            navigate(link)
        }
    }

    return (
        <Grid
            container={true}
            alignItems={'center'}
            justifyContent={'center'}
            direction={"column"}
            item={true}
            sx={{
                border: '4px solid #0072CE',
                borderRadius: '25px',
                padding: globalTheme.spacing(1),
                paddingX: '2px',
                background: 'white'
            }}
        >
            <Grid
                item={true}
                onClick={() => {
                    handleRedirect(prop.link)
                }}
                sx={{
                    cursor: prop.link ? "pointer" : "initial"
                }}
            >
                <Typography
                    color={'primary'}
                    sx={{
                        typography: {
                            xs: 'h4',
                            sm: 'h3',
                            md: 'h2',
                        },
                        fontWeight: 'bold',
                        textDecoration: 'underline'
                    }}
                >
                    {prop.data}
                </Typography>
            </Grid>
            <Grid
                item={true}
            >
                <Typography
                    sx={{
                        typography: {
                            xs: 'body2',
                            sm: 'subtitle1',
                            md: 'h6',
                        }
                    }}
                >
                    {prop.title}
                </Typography>
            </Grid>
        </Grid>
    )
}
export default UserInfoCard

