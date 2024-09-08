import React, {useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import {useSelector} from "react-redux";
import PieChart from "./PieChart";
import BarChart from "./BarChart";


export function UserMetrics() {
    const {isSuccess, data} = useSelector((state: any) => state.metrics)

    const [pieData, setPieData] = useState({})
    const [columnsData, setColumnsData] = useState({})

    useEffect(() => {
        if(isSuccess) {
            setPieData(data.wordsPerPOS)
            setColumnsData(data.wordsPerMonth)
        }
    }, [isSuccess, data.wordsPerPOS, data.wordsPerMonth])

    return (
        <Grid
            container={true}
            spacing={2}
        >
            <Grid
                item={true}
                xs={12}
                lg={4}
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
                lg={8}
            >
                <BarChart
                    data={columnsData}
                    xType={"category"}
                    title={"Words added per month."}
                />
            </Grid>
        </Grid>
    )
}

export default UserMetrics
