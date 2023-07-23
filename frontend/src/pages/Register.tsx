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

export interface IFormInput {
    name: string;
    email: string;
    password: string;
    password2?: string;
}


export function Register() {
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

    const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().required("E-mail is required").email("Valid e-mail is required"),
    password: Yup.string().required("Password is required"),
    password2: Yup.string().required("Password2 is required")
        .oneOf([Yup.ref('password')], "Passwords don't match"),
    })

    const {
        handleSubmit, reset, control, formState: { errors }
    } = useForm<IFormInput>({
        resolver: yupResolver(validationSchema),
    })

    const {user, isLoading, isError, isSuccess, message} = useSelector((state: any) => state.auth)

    const onSubmit = (data: IFormInput) => {
        const userData: IFormInput = {
            name: data.name,
            email: data.email,
            password: data.password
        }
        //@ts-ignore
        dispatch(register(userData))
    }

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if(isError) {
            toast.error(message)
        }
        if(isSuccess || user){
            navigate('/')
        }
        dispatch(resetState())
    }, [user, isError, isSuccess, message, navigate, dispatch])

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
                            {(isLoading) && <LinearIndeterminate/>}
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