import React from "react"
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {Grid, Typography} from "@mui/material";
import {useSelector} from "react-redux";

interface UserDataProps {

}

export const UserData = (props: UserDataProps) => {
    const {user} = useSelector((state: any) => state.auth)

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
                        {user?.name}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}