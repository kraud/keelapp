import {useLocation} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import ResponsiveAppBar from "../../components/Header";
import {Grid} from "@mui/material";
import {RoutesWithAnimation} from "./RoutesWithAnimation";
import {LocationProvider} from "./LocationProvider";
import globalTheme from "../../theme/theme";
import {logout} from "../../features/auth/authSlice";
import {useDispatch} from "react-redux";
import AuthVerify from "../../common/AuthVerify";
import {AppDispatch} from "../../app/store";
import {toast} from "react-toastify";

export function MainView(){
    const componentStyles = {
        mainColumn:{
            margin: 0,
            marginBottom: globalTheme.spacing(6)
        }
    }
    const dispatch = useDispatch<AppDispatch>()
    const location = useLocation()
    const [displayToolbar, setDisplayToolbar] = useState(false)

    const urlListNoToolbar: RegExp[] = [
        new RegExp("^/login$"), // matches with "/login"
        new RegExp("^/register$"), // matches with "/register"
        new RegExp("^/user/.*/verify/.*$"), // matches with "/user/*/verify/*"
        new RegExp("^/resetPassword.*$") // matches with "/resetPassword/*"
    ]

    useEffect(() => {
        if (urlListNoToolbar.some((regex: RegExp) => {
            return regex.test(location.pathname)
        })) {
            setDisplayToolbar(false)
        } else {
            setDisplayToolbar(true)
        }
    },[location])

    const onLogOut = useCallback(() => {
        dispatch(logout())
        toast.error('Your credentials have expired. Please login again.')
    }, [dispatch])

    const onRenderNotFoundHideHeader = (userExist: boolean) => {
        setDisplayToolbar((userExist))
    }

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
                    <RoutesWithAnimation
                        onRenderNotFound={(userExist: boolean) => onRenderNotFoundHideHeader(userExist)}
                    />
                    {/* AuthVerify handles auto-logout when JWT expires */}
                    <AuthVerify
                        onLogOut={() => onLogOut()}
                        key={'verify'}
                    />
                </LocationProvider>
            </Grid>
        </>
    )
}