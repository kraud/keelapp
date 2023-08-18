import {useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import ResponsiveAppBar from "../../components/Header";
import {Grid} from "@mui/material";
import {RoutesWithAnimation} from "./RoutesWithAnimation";
import {LocationProvider} from "./LocationProvider";
import globalTheme from "../../theme/theme";

export function MainView(){
    const componentStyles = {
        mainColumn:{
            margin: 0,
            marginBottom: globalTheme.spacing(6)
        }
    }
    const location = useLocation()
    const [displayToolbar, setDisplayToolbar] = useState(false)
    const urlListNoToolbar = ["/login", "/register"]

    useEffect(() => {
        if((urlListNoToolbar).some((url: string) => (url === location.pathname))){
            setDisplayToolbar(false)
        } else {
            setDisplayToolbar(true)
        }
    },[location])

    return(
        <>
            {
                (displayToolbar) &&
                <ResponsiveAppBar/>
            }
            <Grid
                container={true}
                justifyContent={"center"}
                item={true}
                xs={12}
                sx={componentStyles.mainColumn}
            >
                <LocationProvider> {/* Framer Motion */}
                    <RoutesWithAnimation/>
                </LocationProvider>
            </Grid>
        </>
    )
}