import React, {useEffect} from "react";
import {Grid, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import globalTheme from "../theme/theme";
import {motion} from "framer-motion";
import {childVariantsAnimation, routeVariantsAnimation} from "./management/RoutesWithAnimation";

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
                item={true}
                component={motion.div}
                variants={childVariantsAnimation}
                initial="initial"
                animate="final"
            >
                <Grid
                    item={true}
                >
                    <Typography
                        variant={"h6"}
                    >
                        Ready to learn something today?
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Dashboard