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
import {useTranslation} from "react-i18next";
import {LaduLogo} from "../components/LaduLogo";

interface UserLoginData {
    email: string;
    password: string;
}

export function Login() {
    const { t } = useTranslation(['common', 'loginRegister'])
    // --------------- STYLING ---------------
    const componentStyles = {
        mainContainer: {
            marginTop: globalTheme.spacing(2),
            border: '2px solid #0072CE',
            borderRadius: '25px',
            paddingBottom: globalTheme.spacing(2),
            paddingX: globalTheme.spacing(6),
        }
    }

    // --------------- FORM VALIDATION SCHEMA ---------------
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required(t('errors.invalidEmail', { ns: 'loginRegister' }))
            .email(t('errors.invalidEmail', { ns: 'loginRegister' })),
        password: Yup.string()
            .required(t('errors.passwordRequired', { ns: 'loginRegister' })),
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
                        {t('login.title', { ns: 'loginRegister' })}
                    </Typography>
                    <Typography
                        variant={"subtitle2"}
                        align={"center" }
                    >
                        {t('login.subtitle', { ns: 'loginRegister' })}
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
                                    label={t('formLabels.name', { ns: 'loginRegister' })}
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
                                    label={t('formLabels.password', { ns: 'loginRegister' })}
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
                                direction={"column"}
                                alignItems={"center"}
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
                                        {t('buttons.submit', { ns: 'common' })}
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
                                            marginTop: globalTheme.spacing(2),
                                            textAlign: 'center',
                                            textTransform: 'none',
                                        }}
                                        disabled={isLoadingAuth}
                                    >
                                        {t('switchSectionButtons.notRegistered', { ns: 'loginRegister' })}
                                    </Button>
                                </Grid>
                                <Grid
                                    item={true}
                                    xs={12}
                                >
                                    <Button
                                        variant={"text"}
                                        onClick ={() => {
                                            navigate("/resetPassword")
                                        }}
                                        fullWidth={true}
                                        sx={{
                                            marginTop: `-${globalTheme.spacing(1)}`,
                                            textAlign: 'center',
                                            textTransform: 'none',
                                        }}
                                        disabled={isLoadingAuth}
                                    >
                                        {t('switchSectionButtons.forgotPassword', { ns: 'loginRegister' })}
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
            <LaduLogo
                width={150}
                variant={"filled"}
                color={"primary"}
                direction={"vertical"}
                type={'logo'}
                sxProps={{
                    marginTop: globalTheme.spacing(3),
                }}
            />
        </Grid>
    )
}

export default Login