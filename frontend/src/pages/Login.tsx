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

interface UserLoginData {
    email: string;
    password: string;
}

export function Login() {
    // --------------- STYLING ---------------
    const componentStyles = {
        mainContainer: {
            marginTop: globalTheme.spacing(6),
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
                            />
                        </Grid>
                        <Grid
                            item={true}
                        >
                            {(isLoadingAuth) && <LinearIndeterminate/>}
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
                                >
                                    You don't have an account?
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    )
}

export default Login