import {Route, Routes, useLocation} from "react-router-dom";
import Dashboard from "../Dashboard";
import AddWord from "../AddWord";
import Login from "../Login";
import Register from "../Register";
import React, {useEffect, useState} from "react";
import ResponsiveAppBar from "../../components/Header";
import {Grid} from "@mui/material";
import {Review} from "../Review";
import {RoutesWithAnimation} from "./RoutesWithAnimation";
import {LocationProvider} from "./LocationProvider";

export function MainView(){
    const componentStyles = {
        mainColumn:{
            margin: 0,
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