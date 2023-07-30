import React, {useEffect} from "react";
import {Grid, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import globalTheme from "../theme/theme";
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import {SpinningText} from "../components/SpinningText";

export function Dashboard() {
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
                        variant={"h1"}
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
                            "Ready to learn something today?",
                            "¿Listo para aprender algo hoy?",
                            "Sind Sie bereit, heute etwas Neues zu lernen?",
                            "Kas sa oled valmis midagi uut täna õppida?"
                        ]}
                        variant={'h6'}
                        color={"primary"}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Dashboard