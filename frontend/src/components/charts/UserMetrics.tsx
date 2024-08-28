import React, {useEffect, useState} from 'react';
import C3Chart from './C3Chart';
import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import globalTheme from "../../theme/theme";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../app/store";
import {getUserMetrics} from "../../features/metrics/metricSlice";
import PieChart from "./PieChart";


export function UserMetrics() {
    const dispatch = useDispatch<AppDispatch>()
    const {isError, isSuccess, isLoading, message, data} = useSelector((state: any) => state.metrics)

    // On first render, this makes all the necessary requests to BE (and stores result data in Redux) to display account-screen info
    useEffect(() => {
        dispatch(getUserMetrics())
    },[dispatch])

    const [pieData, setPieData] = useState({})
    const [columnsData, setColumnsData] = useState({})
    
    useEffect(() => {
        if(isSuccess) {
            setPieData(data.wordsPerPOS)
            setColumnsData(data.wordsPerMonth)
            // const columns_month: any[] = []
            // const columns_count: any[] = ['Languages']
            // let minus_language: string = ""
            // let minus_language_count: any = 0
            // minus_language_count = data.totalWords
            // //To format pie data
            // data.translationsPerLanguage.forEach((element: { _id: string, count: number }) => {
            //     // data example: [ ["estonian", 60], ["spanish", 30], ... ]
            //
            //     const columns_pie = columnsPieValue
            //     columns_pie.push([{_id:element._id, count:element.count}])
            //     setColumnsPieValue(columns_pie)
            //     //to get the worst category
            //     if (element.count <= minus_language_count) {
            //         minus_language = element._id
            //         minus_language_count = element.count
            //     }
            // })
            //To format bars data
            // data.wordsPerMonth.forEach((element: { label: any, count: any }) => {
            //     columns_month.push(element.label)
            //     columns_count.push(element.count)
            // })
            //
            // setColumnsBarMonth(columns_month)
            // setColumnsBarCount(columns_count)
            // setWorseLanguage(minus_language)
            //
            // setPiedata(data.translationsPerLanguage)
        }

    }, [isSuccess, data])

    //Example data for spline data
    const line_data = {
        columns: [],
        type: 'bar', // Specify chart type here
    }

    const line_options = {
        axis: {
            x: {
                type: 'category',
                categories: [],
            },
        }
    }

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
                <PieChart
                    data={pieData}
                    unit={"translations"}
                />

                {/*<Card*/}
                {/*    sx={{paddingX: globalTheme.spacing(1)}}*/}
                {/*>*/}
                {/*    <CardContent>*/}
                {/*        <PieChart*/}
                {/*            data={pieData}*/}
                {/*            unit={"translations"}*/}
                {/*        />*/}
                {/*    </CardContent>*/}
                {/*    <CardActions>*/}
                {/*        <Typography>*/}
                {/*            Your worse category is: <Button> {worseLanguage} </Button>*/}
                {/*        </Typography>*/}
                {/*        <Button size="small" color="primary">*/}
                {/*        </Button>*/}
                {/*    </CardActions>*/}
                {/*</Card>*/}
            </Grid>
            {/*<Grid*/}
            {/*    item={true}*/}
            {/*    xs={8}*/}
            {/*>*/}
            {/*    <Card>*/}
            {/*        <CardContent>*/}
            {/*            <h1>Lineas con C3.js</h1>*/}
            {/*            <C3Chart data={line_data} options={line_options} />*/}
            {/*        </CardContent>*/}
            {/*    </Card>*/}
            {/*</Grid>*/}
        </Grid>
    );
}

export default UserMetrics;
