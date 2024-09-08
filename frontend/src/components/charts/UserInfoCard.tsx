import {Grid, Typography} from "@mui/material";
import React from "react";
import globalTheme from "../../theme/theme";
import IosShareIcon from '@mui/icons-material/IosShare';
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
                container={true}
                xs={12}
            >
                <Grid
                    item={true}
                    container={true}
                    xs={12}
                    alignItems={"center"}
                    justifyContent={"center"}
                    onClick={() => {
                        handleRedirect(prop.link)
                    }}
                    sx={{
                        cursor: prop.link ? "pointer" : "initial"
                    }}
                >
                    <Typography
                        sx={{
                            typography: {
                                xs: 'h4',
                                sm: 'h3',
                                md: 'h2',
                            },
                            fontWeight: 'bold',
                            textDecoration: 'underline'
                        }}
                        color={'primary'}
                    >
                        {prop.data}
                    </Typography>
                </Grid>
            </Grid>
            <Grid
                item={true}
                container={true}
                justifyContent={"center"}
                alignItems={"center"}
                xs={12}
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

