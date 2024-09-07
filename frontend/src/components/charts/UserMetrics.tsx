import React, {useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import globalTheme from "../../theme/theme";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../app/store";
import {getUserMetrics} from "../../features/metrics/metricSlice";
import PieChart from "./PieChart";
import BarChart from "./BarChart";


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
        }

    }, [isSuccess, data])

    return (
        <Grid
            marginTop={globalTheme.spacing(1)}
            container={true}
            spacing={globalTheme.spacing(4)}
        >
            <Grid
                item={true}
                xs={12}
                md={4}
            >
                <PieChart
                    data={pieData}
                    unit={"translations"}
                    title={"Distribution of word types"}
                />
            </Grid>
            <Grid
                item={true}
                xs={12}
                md={8}
            >
                <BarChart
                    data={columnsData}
                    xType={"category"}
                    title={"Words added per month."}
                />
            </Grid>
        </Grid>
    );
}

export default UserMetrics;
