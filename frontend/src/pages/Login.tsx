import React from "react";
import {Button, Grid, Typography} from "@mui/material";
import {useEffect} from "react";
import {TextInputFormWithHook} from "../components/TextInputFormHook";
import {useForm} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import globalTheme from "../theme/theme";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import LinearIndeterminate from "../components/Spinner";
import {login, resetState} from "../features/auth/authSlice";
import {toast} from "react-toastify";
import {motion} from "framer-motion";
import {childVariantsAnimation, routeVariantsAnimation} from "./management/RoutesWithAnimation";
import {AppDispatch} from "../app/store";
import {getIconByEnvironment} from "../components/GeneralUseComponents";

interface UserLoginData {
    email: string;
    password: string;
}

export function Login() {
    // --------------- STYLING ---------------
    const componentStyles = {
        mainContainer: {
            marginTop: globalTheme.spacing(2),
            border: '2px solid #0072CE',
            borderRadius: '25px',
            paddingBottom: globalTheme.spacing(2),
        }
    }

    // --------------- FORM VALIDATION SCHEMA ---------------
    const validationSchema = Yup.object().shape({
        email: Yup.string().required("Valid e-mail is required").email("Valid e-mail is required"),
        password: Yup.string().required("Password is required"),
    })

    // --------------- THIRD-PARTY HOOKS ---------------
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const {
        handleSubmit, control, formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema),
    })

    // --------------- REDUX STATE ---------------
    const {user, isLoadingAuth, isError, isSuccess, message} = useSelector((state: any) => state.auth)

    // --------------- USE-EFFECTS ---------------
    useEffect(() => {
        if(isError) {
            toast.error(message)
        }
        if(isSuccess || user){
            navigate('/')
        }
        dispatch(resetState())
    }, [user, isError, isSuccess, message, navigate, dispatch])

    // --------------- ADDITIONAL FUNCTIONS ---------------
    const onSubmit = (data: any) => {
        const userData: UserLoginData = {
            email: data.email,
            password: data.password
        }
        dispatch(login(userData))
    }

    return(
        <>
            {getAppTitle()}
            <Grid
                component={motion.div} // to implement animations with Framer Motion
                variants={routeVariantsAnimation}
                initial="initial"
                animate="final"
                container={true}
                item={true}
                rowSpacing={4}
                direction={"column"}
                alignItems={"center"}
                sx={componentStyles.mainContainer}
                xs={'auto'}
            >
                <Grid
                    item={true}
                    component={motion.div}
                    variants={childVariantsAnimation}
                    initial="initial"
                    animate="final"
                >
                    <Typography
                        variant={"h2"}
                    >
                        Login
                    </Typography>
                    <Typography
                        variant={"subtitle2"}
                        align={"center" }
                    >
                        And get started!
                    </Typography>
                </Grid>
                <Grid
                    item={true}
                    component={motion.div}
                    variants={childVariantsAnimation}
                    initial="initial"
                    animate="final"
                >
                    <form>
                        <Grid
                            item={true}
                            container={true}
                            spacing={2}
                            direction={"column"}
                            alignItems={"center"}
                        >
                            <Grid
                                item={true}
                            >
                                {/* TODO: should this also allow login in with username? */}
                                <TextInputFormWithHook
                                    control={control}
                                    label={"E-mail"}
                                    name={"email"}
                                    defaultValue={""}
                                    errors={errors.email}
                                    type={"email"}
                                    fullWidth={true}
                                />
                            </Grid>
                            <Grid
                                item={true}
                            >
                                <TextInputFormWithHook
                                    control={control}
                                    label={"Password"}
                                    name={"password"}
                                    defaultValue={""}
                                    errors={errors.password}
                                    type={"password"}
                                    fullWidth={true}
                                    triggerOnEnterKeyPress={() => {
                                        handleSubmit(onSubmit)()
                                    }}
                                    disabled={isLoadingAuth}
                                />
                            </Grid>
                            <Grid
                                container={true}
                                justifyContent={'center'}
                                item={true}
                            >
                                <Grid
                                    item={true}
                                    xs={8}
                                >
                                    {(isLoadingAuth) && <LinearIndeterminate/>}
                                </Grid>
                            </Grid>
                            <Grid
                                item={true}
                                container={true}
                                spacing={2}
                                justifyContent={"center"}
                            >
                                <Grid
                                    item={true}
                                    xs={4}
                                >
                                    <Button
                                        onClick={() => handleSubmit(onSubmit)()}
                                        variant={"outlined"}
                                        fullWidth={true}
                                        color={"success"}
                                        disabled={isLoadingAuth}
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <Button
                                        variant={"text"}
                                        onClick ={() => {
                                            navigate("/register")
                                        }}
                                        fullWidth={true}
                                        sx={{
                                            textAlign: 'center',
                                            textTransform: 'none',
                                        }}
                                        disabled={isLoadingAuth}
                                    >
                                        You don't have an account?
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </>
    )
}

export const getAppTitle = () => {
    // --------------- STYLING ---------------
    const componentStyles = {
        titleContainer: {
            // border: '2px solid #0072CE',
            backgroundColor: '#0072CE',
            color: 'white',
            // color: '#0072CE',
            letterSpacing: '2rem',
            borderRadius: '25px',
            paddingY: globalTheme.spacing(2),
            paddingX: globalTheme.spacing(3),
            userSelect: 'none',
        },
        iconContainer: {
            marginTop: globalTheme.spacing(3),
            // border: '2px solid #0072CE',
            backgroundColor: '#0072CE',
            color: 'white',
            // color: '#0072CE',
            // letterSpacing: '2rem',
            borderRadius: '25px',
            paddingX: globalTheme.spacing(3),
            paddingY: globalTheme.spacing(2),
            marginBottom: `-${globalTheme.spacing(3)}`,
            zIndex:'2'
        },
        adbIcon: {
            width: '45px',
            height: '45px',
        }
    }

    return(
        <Grid
            component={motion.div} // to implement animations with Framer Motion
            variants={routeVariantsAnimation}
            initial="initial"
            animate="final"
            container={true}
            item={true}
            direction={"column"}
            alignItems={"center"}
            xs={12}
        >
            <Grid
                item={true}
                xs={'auto'}
                sx={componentStyles.iconContainer}
                component={motion.div}
                variants={childVariantsAnimation}
                initial="initial"
                animate="final"
            >
                {getIconByEnvironment(componentStyles.adbIcon)}
            </Grid>
            <Grid
                item={true}
                xs={'auto'}
                sx={componentStyles.titleContainer}
                component={motion.div}
                variants={childVariantsAnimation}
                initial="initial"
                animate="final"
            >
                <Typography
                    variant={"h2"}
                    sx={{
                        letterSpacing: '.5rem',
                        marginRight: '-.5rem',
                    }}
                >
                    KEELAPP
                </Typography>
            </Grid>
        </Grid>
    )
}

export default Login