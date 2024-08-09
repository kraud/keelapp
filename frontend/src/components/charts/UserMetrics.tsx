import React, {useEffect} from 'react';
import C3Chart from './C3Chart';
import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import globalTheme from "../../theme/theme";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../app/store";
import {getUserMetrics} from "../../features/metrics/metricSlice";


export function UserMetrics() {
    const dispatch = useDispatch<AppDispatch>()
    const {isError, isSuccess, isLoading, message, data} = useSelector((state: any) => state.metrics)

    // On first render, this makes all the necessary requests to BE (and stores result data in Redux) to display account-screen info
    useEffect(() => {
        dispatch(getUserMetrics())
    },[dispatch])

    const columns_pie: any[][] = [];
    const columns_month: any[] = [];
    const columns_count: any[] = ['Languages'];
    let minus_language: string = "";
    let minus_language_count: any = 0;
    if(isSuccess){
        minus_language_count = data.totalWords;
        data.translationsPerLanguage.forEach((element: { _id: string; count: number; }) => {
            const column: any[] = [element._id, element.count];
            columns_pie.push(column);
            if(element.count <= minus_language_count){
                minus_language = element._id;
            }
        })

        data.wordsPerMonth.forEach((element: { label: any; count: any; }) => {
            columns_month.push(element.label);
            columns_count.push(element.count);
        })

    }

    // Example data for a pie chart
    const pie_data = {
        columns: columns_pie,
        type: 'pie', // Specify chart type here
    };

    const pie_options = {
        legend: {
            position: 'right'
        },
    };

    //Example data for spline data
    const line_data = {
        columns: [columns_count],
        type: 'bar', // Specify chart type here
    };

    const line_options = {
        axis: {
            x: {
                type: 'category',
                categories: columns_month,
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
                            {minus_language}
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
