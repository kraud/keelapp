import React, {useEffect} from 'react';
import C3Chart from './C3Chart';
import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import globalTheme from "../../theme/theme";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../app/store";
import {getUserMetrics} from "../../features/metrics/metricSlice";


export function UserMetrics() {

    const dispatch = useDispatch<AppDispatch>()

     // On first render, this makes all the necessary requests to BE (and stores result data in Redux) to display account-screen info
    useEffect(() => {
        dispatch(getUserMetrics())
        // dispatch(clearFullTagData()) // TODO: review this, since it's causing issues when creating a new tag after reviewing another before tha
    },[dispatch])

    // Example data for a pie chart
    const pie_data = {
        columns: [
            ['data1', 30],
            ['data2', 50],
        ],
        type: 'pie', // Specify chart type here
    };

    const pie_options = {
        legend: {
            position: 'right'
        },
    };

    //Example data for spline data
    const line_data = {
        columns: [
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 50, 20, 10, 40, 15, 25],
        ],
        type: 'line', // Specify chart type here
    };

    const line_options = {
        axis: {
            x: {
                type: 'category',
                categories: ['A', 'B', 'C', 'D', 'E', 'F'],
            },
        },
    };

    return (
        <Grid
            marginTop={globalTheme.spacing(1)}
            container={true}
            spacing={globalTheme.spacing(4)}
        >
            <Grid
                item={true}
                xs={4}
            >
                <Card
                    sx={{ paddingX: globalTheme.spacing(1) }}
                >
                    <CardContent>
                        <h1>Tortas con C3.js</h1>
                        <C3Chart data={pie_data} options={pie_options} />

                    </CardContent>
                    <CardActions>
                        <Typography>
                            Your worse category is:
                        </Typography>
                        <Button size="small" color="primary">
                            Italiano
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
            <Grid
                item={true}
                xs={8}
            >
                <Card>
                    <CardContent>
                        <h1>Lineas con C3.js</h1>
                        <C3Chart data={line_data} options={line_options} />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

export default UserMetrics;
