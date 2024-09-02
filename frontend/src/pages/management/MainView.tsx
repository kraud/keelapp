import {useLocation} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import ResponsiveAppBar from "../../components/Header";
import {Grid} from "@mui/material";
import {RoutesWithAnimation} from "./RoutesWithAnimation";
import {LocationProvider} from "./LocationProvider";
import globalTheme from "../../theme/theme";
import {logout} from "../../features/auth/authSlice";
import {useDispatch, useSelector} from "react-redux";
import AuthVerify from "../../common/AuthVerify";
import {AppDispatch} from "../../app/store";
import {toast} from "react-toastify";
import {useIntervalFunction} from "../../hooks/useInterval";
import {getNotifications} from "../../features/notifications/notificationSlice";
import {getLangKeyByLabel} from "../../components/generalUseFunctions";
import i18n from "i18next";

export function MainView(){
    const {user} = useSelector((state: any) => state.auth)
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

    // NB! We set this here, because to be listening for UI-languages in any part of the app.
    // Tried doing this inside authSlice (just the part inside the "if"), but there were problems with the i18n import.
    useEffect(() => {
        // NB! This should only run once on setup, and this way we update UI-lang in case it was changed in another computer/session
        if(user.uiLanguage!! && (getLangKeyByLabel(user.uiLanguage)!!)){
            i18n.changeLanguage(getLangKeyByLabel(user.uiLanguage).toLowerCase())
        }
    },[user.uiLanguage])

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

    useIntervalFunction(
        () => {
            if((JSON.parse(localStorage.getItem("user")!))!!){
                dispatch(getNotifications())
            }
        },
        1000 * 90, // make request every 60 seconds
        true // make request once before starting countdown
    )

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