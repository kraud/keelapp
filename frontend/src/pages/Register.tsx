import React from "react";
import {Button, Grid, Typography} from "@mui/material";
import {useEffect} from "react";
import {TextInputFormWithHook} from "../components/TextInputFormHook";
import {useForm} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import globalTheme from "../theme/theme";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {register, resetState} from '../features/auth/authSlice'
import LinearIndeterminate from "../components/Spinner";
import {motion} from "framer-motion";
import {childVariantsAnimation, routeVariantsAnimation} from "./management/RoutesWithAnimation";
import {AppDispatch} from "../app/store";

export interface UserRegisterData {
    name: string
    username: string
    email: string
    password: string
    password2?: string
}

export function Register() {
    // --------------- STYLING ---------------
    const componentStyles = {
        mainContainer: {
            marginTop: globalTheme.spacing(6),
            border: '2px solid #0072CE',
            borderRadius: '25px',
            paddingLeft: globalTheme.spacing(6),
            paddingRight: globalTheme.spacing(6),
            paddingBottom: globalTheme.spacing(2),
        }
    }

    // --------------- FORM VALIDATION SCHEMA ---------------
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string().required("E-mail is required").email("Valid e-mail is required"),
        username: Yup.string().required("Username is required"), // TODO: later check if username is not already registered
        password: Yup.string().required("Password is required"),
        password2: Yup.string().required("Password2 is required")
            .oneOf([Yup.ref('password')], "Passwords don't match"),
    })

    // --------------- THIRD-PARTY HOOKS ---------------
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const {
        handleSubmit, reset, control, formState: { errors }
    } = useForm<UserRegisterData>({
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
    const onSubmit = (data: UserRegisterData) => {
        const userData: UserRegisterData = {
            name: data.name,
            username: data.username,
            email: data.email,
            password: data.password
        }
        dispatch(register(userData))
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
                    Register
                </Typography>
                <Typography
                    variant={"subtitle2"}
                    align={"center" }
                >
                    Please create an account
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
                            <TextInputFormWithHook
                                control={control}
                                label={"Name"}
                                name={"name"}
                                defaultValue={""}
                                errors={errors.name}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid
                            item={true}
                        >
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
                                label={"Username"}
                                name={"username"}
                                defaultValue={""}
                                errors={errors.username}
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
                            />
                        </Grid>
                        <Grid
                            item={true}
                        >
                            <TextInputFormWithHook
                                control={control}
                                label={"Confirm password"}
                                name={"password2"}
                                defaultValue={""}
                                errors={errors.password2}
                                type={"password"}
                                fullWidth={true}
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
                            >
                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    variant={"outlined"}
                                    fullWidth={true}
                                    color={"success"}
                                >
                                    Submit
                                </Button>
                            </Grid>
                            <Grid
                                item={true}
                            >
                                <Button
                                    onClick={() => reset()}
                                    variant={"outlined"}
                                    fullWidth={true}
                                    color={"error"}
                                >
                                    Reset
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <Button
                                variant={"text"}
                                onClick ={() => {
                                    navigate("/login")
                                }}
                                fullWidth={true}
                                sx={{
                                    textAlign: 'center',
                                    textTransform: 'none',
                                }}
                            >
                                Already registered?
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    )
}

export default Register