import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {Grid, Typography} from "@mui/material";
import React from "react";

interface NotificationHubProps {

}

export const NotificationHub = (props: NotificationHubProps) => {

    return(
        <Grid
            component={motion.div} // to implement animations with Framer Motion
            variants={routeVariantsAnimation}
            initial="initial"
            animate="final"
            container={true}
            item={true}
            sx={{
                marginTop: globalTheme.spacing(4),
            }}
            rowSpacing={2}
            xs={12}
            md={6}
            lg={4}
        >
        <Grid
            container={true}
            justifyContent={"center"}
            item={true}
            xs={12}
            spacing={2}
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
                        textTransform: "uppercase",
                        textDecoration: "underline"
                    }}
                >
                    Notifications:
                </Typography>
            </Grid>
            <Grid
                item={true}
            >
                <Typography
                    sx={{
                        typography: {
                            xs: 'body2',
                            sm: 'h6',
                            md: 'h5',
                        },
                    }}
                >
                    Nothing to see here (yet!)...
                </Typography>
            </Grid>
        </Grid>
        </Grid>
    )

}