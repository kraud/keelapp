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

export function Login() {
    const componentStyles = {
        mainContainer: {
            marginTop: globalTheme.spacing(6),
            border: '2px solid #0072CE',
            borderRadius: '25px',
            paddingBottom: globalTheme.spacing(2),
        }
    }
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user, isLoading, isError, isSuccess, message} = useSelector((state: any) => state.auth)

    const validationSchema = Yup.object().shape({
        email: Yup.string().required("Valid e-mail is required").email("Valid e-mail is required"),
        password: Yup.string().required("Password is required"),
    })

    const {
        handleSubmit, control, formState: { errors }
    } = useForm<IFormInput>({
        resolver: yupResolver(validationSchema),
    })

    interface IFormInput {
        email: string;
        password: string;
    }

    const onSubmit = (data: IFormInput) => {
        const userData: IFormInput = {
            email: data.email,
            password: data.password
        }
        //@ts-ignore
        dispatch(login(userData))
    }

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
                                xs={4}
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