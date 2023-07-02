import {Route, Routes, useLocation} from "react-router-dom";
import Dashboard from "../Dashboard";
import AddWord from "../AddWord";
import Login from "../Login";
import Register from "../Register";
import React, {useEffect, useState} from "react";
import ResponsiveAppBar from "../../components/Header";
import {Grid} from "@mui/material";

export function MainView(){
    const componentStyles = {
        mainColumn:{

        }
    }
    const location = useLocation()
    const [displayToolbar, setDisplayToolbar] = useState(true)
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
                <Routes>
                    <Route
                        path='/'
                        element={<Dashboard/>}
                    />
                    <Route
                        path='/addWord'
                        element={<AddWord/>}
                    />
                    <Route
                        path='/login'
                        element={<Login/>}
                    />
                    <Route
                        path='/register'
                        element={<Register/>}
                    />
                </Routes>
            </Grid>
        </>
    )
}