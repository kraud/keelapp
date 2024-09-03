import {Grid, Typography} from "@mui/material";
import React from "react";
import globalTheme from "../../theme/theme";
import IosShareIcon from '@mui/icons-material/IosShare';
import { useNavigate } from 'react-router-dom';


interface UserInfoCard{
    title: string,
    data: string,
    link?: string
}


export function UserInfoCard(prop : UserInfoCard){

    const navigate = useNavigate();

    const handleRedirect = (link : string | undefined) => {
        // Redirigir a otra ruta
        if(link !== undefined){
            navigate(link);
        }
    };

    return(<Grid>
        <Grid
            container={true}
            item={true}
            sx={{
                border: '2px solid #0072CE',
                borderRadius: '25px',
                padding: globalTheme.spacing(1),
                paddingX: '2px',
                background: 'white'
            }}
            >
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
                {(prop.link !== undefined) &&
                    <Grid>
                        <IosShareIcon
                            onClick={() => {
                                handleRedirect(prop.link)
                            }}
                        />
                    </Grid>
                }
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
                            xs: 'h9',
                            sm: 'h8',
                            md: 'h7',
                        },
                    }}
                    color={'secondary'}
                >
                    {prop.title}
                </Typography>
            </Grid>
        </Grid>
    </Grid>);
}
export default UserInfoCard;

