import React from "react";
import {Grid, Typography} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

interface LoadingScreenProps {
}

export function LoadingScreen(props: LoadingScreenProps) {

    return(
        <Grid
            container={true}
            justifyContent={"center"}
            alignItems={"center"}
            rowSpacing={3}
            direction={'column'}
            sx={{
                height: '50vh',
            }}
        >
            <Grid
                container={true}
                justifyContent={"center"}
                alignItems={"flex-end"}
                item={true}
                xs={4}
            >
                <Grid
                    item={true}
                    xs={'auto'}
                >
                    <Typography
                        variant={'h3'}
                    >
                        Loading...
                    </Typography>
                </Grid>
            </Grid>
            <Grid
                container={true}
                justifyContent={"center"}
                item={true}
                xs={4}
            >
                <Grid
                    item={true}
                    xs={6}
                >
                    <LinearProgress
                        color="secondary"
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default LoadingScreen