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
import {getAppTitle} from "./Login";
import {useTranslation} from "react-i18next";

export interface UserRegisterData {
    name: string
    username: string
    email: string
    password: string
    password2?: string
}

export function Register() {
    const { t } = useTranslation(['common', 'loginRegister'])
    // --------------- STYLING ---------------
    const componentStyles = {
        mainContainer: {
            marginTop: globalTheme.spacing(2),
            border: '2px solid #0072CE',
            borderRadius: '25px',
            paddingLeft: globalTheme.spacing(6),
            paddingRight: globalTheme.spacing(6),
            paddingBottom: globalTheme.spacing(2),
        }
    }

    // --------------- FORM VALIDATION SCHEMA ---------------
    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t('errors.nameRequired', { ns: 'loginRegister' })),
        email: Yup.string()
            .required(t('errors.emailRequired', { ns: 'loginRegister' }))
            .email(t('errors.invalidEmail', { ns: 'loginRegister' })),
        username: Yup.string().required(t('errors.usernameRequired', { ns: 'loginRegister' })), // TODO: later check if username is not already registered
        password: Yup.string().required(t('errors.passwordRequired', { ns: 'loginRegister' })),
        password2: Yup.string().required(t('errors.passwordRepeatRequired', { ns: 'loginRegister' }))
            .oneOf([Yup.ref('password')], t('errors.passwordRepeatMustMatch', { ns: 'loginRegister' })),
    })

    // --------------- THIRD-PARTY HOOKS ---------------
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const {
        handleSubmit, reset, control, formState: { errors }
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
        const userData: UserRegisterData = {
            name: data.name,
            username: data.username,
            email: data.email,
            password: data.password
        }
        dispatch(register(userData))
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
                        {t('register.title', { ns: 'loginRegister' })}
                    </Typography>
                    <Typography
                        variant={"subtitle2"}
                        align={"center" }
                    >
                        {t('register.subtitle', { ns: 'loginRegister' })}
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
                                    label={t('formLabels.name', { ns: 'loginRegister' })}
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
                                    label={t('formLabels.email', { ns: 'loginRegister' })}
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
                                    label={t('formLabels.username', { ns: 'loginRegister' })}
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
                                    label={t('formLabels.password', { ns: 'loginRegister' })}
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
                                    label={t('formLabels.confirmPassword', { ns: 'loginRegister' })}
                                    name={"password2"}
                                    defaultValue={""}
                                    errors={errors.password2}
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
                                item={true}
                                xs={10}
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
                                        disabled={isLoadingAuth}
                                    >
                                        {t('buttons.submit', { ns: 'common' })}
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
                                        disabled={isLoadingAuth}
                                    >
                                        {t('buttons.reset', { ns: 'common' })}
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
                                    {t('switchSectionButtons.alreadyRegistered', {ns: 'loginRegister'})}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </>
    )
}

export default Register