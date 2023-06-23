import React from "react";
import {Button, Grid, Typography} from "@mui/material";
import {useState, useEffect} from "react";
import {TextInputFormWithHook} from "../components/TextInputFormHook";
import {SubmitHandler, useForm} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import globalTheme from "../theme/theme";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {register, resetState} from '../features/auth/authSlice'
import LinearIndeterminate from "../components/Spinner";

export interface IFormInput {
    name: string;
    email: string;
    password: string;
    password2?: string;
    // exampleType: { label: string; value: string };
}


export function Register() {

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

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    })

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
            container={true}
            spacing={4}
            direction={"column"}
            alignItems={"center"}
        >
            <Grid
                item={true}
                sx={{
                    marginTop: globalTheme.spacing(6),
                }}
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
            >
                <form>
                    <Grid
                        item={true}
                        container={true}
                        spacing={2}
                        direction={"column"}
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
                                >
                                    Reset
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid
                            item={true}
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