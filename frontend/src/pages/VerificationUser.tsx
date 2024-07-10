import React, {useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { useSelector } from "react-redux";
import { verifyUser } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {Divider, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import HelpIcon from '@mui/icons-material/Help';
import {waitDelay} from "../components/generalUseFunctions";
import LinearIndeterminate from "../components/Spinner";

interface RouteVerificationUserProps{
    userId: string,
    tokenId: string
}

interface VerificationUserProps{

}

export const VerificationUser = (props: VerificationUserProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>()
    // @ts-ignore
    const {userId, tokenId } = useParams<RouteVerificationUserProps>()

    const {user, isLoadingAuth, isSuccess} = useSelector((state: any) => state.auth)

    useEffect(() => {
        if((isSuccess && !isLoadingAuth) || user){
            const response = executeRedirection()
        }
    }, [user, isLoadingAuth, isSuccess])

    useEffect(() => {
        if(userId === undefined || tokenId === undefined){
            toast.error("There was an error with this link.")
            navigate("/Error")
        } else {
            dispatch(verifyUser({userId: userId, tokenId: tokenId}))
        }
    }, [])

    const executeRedirection = async () => {
        await waitDelay(3000)
        handleOnClickRedirect()
    }

    // only available after validating correctly
    const handleOnClickRedirect = () => {
        navigate("/")
    }

    return (
        <Grid
            component={motion.div} // to implement animations with Framer Motion
            variants={routeVariantsAnimation}
            initial="initial"
            animate="final"
            container={true}
            spacing={1}
            sx={{
                marginTop: globalTheme.spacing(4),
            }}
        >
            <Grid
                container={true}
                justifyContent={"center"}
                item={true}
            >
                <Grid
                    container={true}
                    justifyContent={"center"}
                    item={true}
                    xs={12}
                >
                    <Grid
                        item={true}
                    >
                        <Typography
                            sx={{
                                typography: {
                                    xs: 'h3',
                                    sm: 'h2',
                                    md: 'h1',
                                },
                            }}
                        >
                            {(isLoadingAuth)
                                ? 'Validating...'
                                : (isSuccess)
                                    ? 'Validated successfully!'
                                    : "Going in..."
                            }
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    item={true}
                    xs={8}
                >
                    <Divider
                        orientation="horizontal"
                        flexItem={true}
                        sx={{
                            "&::before, &::after": {
                                borderColor: "black",
                            },
                        }}
                    >
                        {(isLoadingAuth)
                            ? <PendingIcon/>
                            : (isSuccess)
                                ? <CheckCircleIcon/>
                                : <HelpIcon/>
                        }
                    </Divider>
                </Grid>
            </Grid>
            {(!isLoadingAuth || isSuccess) &&
                <Grid
                    container={true}
                    justifyContent={"center"}
                >
                    <Grid
                        item={true}
                        xs={8}
                    >
                        <LinearIndeterminate/>
                    </Grid>
                </Grid>
            }
            <Grid
                container={true}
                justifyContent={"center"}
            >
                {(isLoadingAuth || isSuccess) &&
                    <Grid
                        item={true}
                        xs={12}
                        sx={{
                            marginTop: globalTheme.spacing(2),
                        }}
                    >
                        <Typography
                            variant={"body2"}
                            onClick={() => {
                                if(!isLoadingAuth && isSuccess) {
                                    handleOnClickRedirect()
                                }
                            }}
                            color={'primary'}
                            textAlign={"center"}
                            sx={{
                                cursor: (isLoadingAuth) ?"auto" :"pointer"
                            }}
                            fontWeight={"bold"}
                        >
                            {(isLoadingAuth)
                                ? 'You will be redirected automatically after validation is completed.'
                                : (isSuccess)
                                    ? 'Not redirected automatically? Click here to continue.'
                                    : 'Oops. Something went wrong.'
                            }
                        </Typography>
                    </Grid>
                }
            </Grid>
        </Grid>
    )

}

export default VerificationUser