import React, {useEffect} from "react";
import {Grid, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import globalTheme from "../theme/theme";
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import {SpinningText} from "../components/SpinningText";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";
import {Lang} from "../ts/enums";
import UserMetrics from "../components/charts/UserMetrics";
import UserInfoPanel from "../components/charts/UserInfoPanel";

export function Dashboard() {
    const theme = useTheme()
    const lessThanSm = useMediaQuery(theme.breakpoints.down("sm"))
    const smallToMid = useMediaQuery(theme.breakpoints.between("sm", "md"))
    const navigate = useNavigate()
    const {user} = useSelector((state: any) => state.auth)

    useEffect(() => {
        if(!user){
            navigate('/login')
        }
    }, [user, navigate])

    return (
        <Grid
            component={motion.div} // to implement animations with Framer Motion
            variants={routeVariantsAnimation}
            initial="initial"
            animate="final"
            container={true}
            spacing={1}
            sx={{
                marginTop: globalTheme.spacing(2),
            }}
        >
            <Grid
                xs={12}
            >
                <Grid
                    container={true}
                    justifyContent={"center"}
                    item={true}
                >
                    <Grid
                        item={true}
                    >
                        <Typography
                            sx={{
                                typography: {
                                    xs: 'h5',
                                    sm: 'h4',
                                    md: 'h1',
                                },
                            }}
                        >
                            Welcome, {user?.name}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    container={true}
                    sx={{
                        paddingLeft: globalTheme.spacing(2),
                    }}
                    xs={12}
                >
                    <Grid
                        item={true}
                        md={12}
                        xs={12}
                    >
                        <Grid
                            container={true}
                            justifyContent={"center"}
                        >
                            <Grid
                                item={true}
                            >
                                <SpinningText
                                    translations={[
                                        {language: Lang.EN, label: "Ready to learn something new today?"},
                                        {language: Lang.ES, label: "¿Listo para aprender algo nuevo hoy?"},
                                        {language: Lang.DE, label: "Sind Sie bereit, heute etwas Neues zu lernen?"},
                                        {language: Lang.EE, label: "Kas sa oled valmis midagi uut täna õppida?"},
                                    ]}
                                    variant={
                                        (smallToMid)
                                            ? 'h6'
                                            : (lessThanSm)
                                                ? 'subtitle1'
                                                :'h4' // lg and up
                                    }
                                    color={"primary"}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            <Grid
                container={true}
                justifyContent={"center"}
                sx={{
                    marginTop: globalTheme.spacing(3),
                    border: '2px solid red',
                    borderRadius: '25px',
                }}
            >
                <Grid
                    container={true}
                    justifyContent={"center"}
                    item={true}
                    xl={'auto'}
                    xs={12}
                    sx={{
                        border: '2px solid green',
                        borderRadius: '25px',
                    }}
                >
                    <UserInfoPanel/>
                </Grid>
                <Grid
                    container={true}
                    item={true}
                    justifyContent={"center"}
                    xs={12}
                    lg={8}
                    xl={'auto'}
                    sx={{
                        border: '2px solid #0072CE',
                        borderRadius: '25px',
                        padding: globalTheme.spacing(2),
                    }}
                >
                    <UserMetrics />
                </Grid>
            </Grid></Grid>
        </Grid>
    )
}

export default Dashboard