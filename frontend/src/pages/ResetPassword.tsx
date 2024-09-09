import React from "react";
import {Button, Grid, Typography} from "@mui/material";
import {useEffect} from "react";
import {TextInputFormWithHook} from "../components/TextInputFormHook";
import {useForm} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import globalTheme from "../theme/theme";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import LinearIndeterminate from "../components/Spinner";
import {resetState, updatePassword, requestPasswordResetToken} from "../features/auth/authSlice";
import {toast} from "react-toastify";
import {motion} from "framer-motion";
import {childVariantsAnimation, routeVariantsAnimation} from "./management/RoutesWithAnimation";
import {AppDispatch} from "../app/store";
import {getAppTitle} from "./Login";
import {useTranslation} from "react-i18next";

export interface UserPasswordData {
    userId: string;
    password: string;
    token: string;
}

//Using 'interfaces' instead of type resulted in the error "RouteResetPasswordProps does not satisfy constrain string | Record<string ..."
type RouteResetPasswordParams = {
    userId: string,
    tokenId: string
}

interface ResetPasswordProps {

}

export const ResetPassword = (props: ResetPasswordProps) => {
    const { t } = useTranslation(['common', 'loginRegister'])
    // --------------- STYLING ---------------
    const componentStyles = {
        mainContainer: {
            marginTop: globalTheme.spacing(2),
            border: '2px solid #0072CE',
            borderRadius: '25px',
            paddingBottom: globalTheme.spacing(2),
            padding: globalTheme.spacing(2)
        }
    }

    // --------------- THIRD-PARTY HOOKS ---------------
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const {userId, tokenId} = useParams<RouteResetPasswordParams>()

    const isSettingNewPassword = userId !== undefined && tokenId !== undefined

    // --------------- FORM VALIDATION SCHEMA ---------------
    // Validates password and confirmation only when
    const validationSchema = Yup.object().shape({
        email: (isSettingNewPassword
            ? Yup.string()
            : Yup.string()
                .required(t('errors.emailRequired', { ns: 'loginRegister' })))
                .email(t('errors.invalidEmail', { ns: 'loginRegister' })),
        password: (isSettingNewPassword
            ? Yup.string().required(t('errors.passwordRequired', { ns: 'loginRegister' }))
            : Yup.string()),
        password2: (isSettingNewPassword
            ? Yup.string().required(t('errors.passwordRepeatRequired', { ns: 'loginRegister' })).oneOf([Yup.ref('password')], "Passwords don't match")
            : Yup.string()
        ) 
    })
    
    const {
        handleSubmit, control, formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema),
    })

    // --------------- REDUX STATE ---------------
    const {isLoadingAuth, isError, isSuccess, message} = useSelector((state: any) => state.auth)

    // --------------- USE-EFFECTS ---------------
    useEffect(() => {
        if(isError) {
            toast.error(message)
        }
        if(isSuccess) {
            const successMessage =
                (isSettingNewPassword)
                    ? t('toastMessages.passwordUpdated', { ns: 'loginRegister' })
                    : t('toastMessages.emailSent', { ns: 'loginRegister' })
            toast.success(successMessage)
            navigate("/")
        }
        dispatch(resetState())
    }, [isSettingNewPassword, isError, isSuccess, message, navigate, dispatch])

    // --------------- ADDITIONAL FUNCTIONS ---------------
    
    const onSubmit = (data: any) => {
        //if (userId !== undefined && tokenId !== undefined) {
        
        if (isSettingNewPassword) {
            const passData: UserPasswordData = {
                userId: userId,
                password: data.password, 
                token: tokenId
            }

            dispatch(updatePassword(passData))
        } else if (data.email !== undefined && data.email !== '') {
            dispatch(requestPasswordResetToken(data.email))
        } 
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
                        align={"center"}
                    >
                        {isSettingNewPassword
                            ? t('resetPassword.titleReset', { ns: 'loginRegister' })
                            : t('resetPassword.titleForgot', { ns: 'loginRegister' })
                        }
                    </Typography>
                    <Typography
                        variant={"subtitle2"}
                        align={"center"}
                    >
                        {isSettingNewPassword
                            ? t('resetPassword.subtitleNewPassword', { ns: 'loginRegister' })
                            : t('resetPassword.subtitleEnterEmail', { ns: 'loginRegister' })}
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
                                hidden={isSettingNewPassword}
                            >
                                {/* TODO: should this also allow login in with username? */}
                                <TextInputFormWithHook
                                    control={control}
                                    label={t('formLabels.email', { ns: 'loginRegister' })}
                                    name={"email"}
                                    defaultValue={""}
                                    errors={errors.email}
                                    type={"email"}
                                    fullWidth={true}
                                    triggerOnEnterKeyPress={() => {
                                        handleSubmit(onSubmit)()
                                    }}
                                />
                            </Grid>
                            <Grid
                                item={true}
                                hidden={!isSettingNewPassword}
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
                                />
                            </Grid>
                            <Grid
                                item={true}
                                hidden={!isSettingNewPassword}
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
                                    xs={5}
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
                                        marginTop: `-${globalTheme.spacing(1)}`,
                                        textAlign: 'center',
                                        textTransform: 'none',
                                    }}
                                    disabled={isLoadingAuth}
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

export default ResetPassword