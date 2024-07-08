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

    return(
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
                justifyContent={"center"}
                sx={{
                    paddingLeft: globalTheme.spacing(2),
                }}
            >
                <Grid
                    item={true}
                >
                    <SpinningText
                        translations={[
                            "Ready to learn something new today?",
                            "¿Listo para aprender algo nuevo hoy?",
                            "Sind Sie bereit, heute etwas Neues zu lernen?",
                            "Kas sa oled valmis midagi uut täna õppida?"
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
    )
}

export default Dashboard