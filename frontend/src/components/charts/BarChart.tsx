import React, {useEffect, useState} from 'react';
import C3Chart from "./C3Chart";
import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import {Data} from "c3";
import globalTheme from "../../theme/theme";

interface BarChartProps{
    data: any,
    xType: string
    options?: any
}

function defaultOptions(xType: string) {
    return {
        axis: {
            x: {
                type: xType,
                categories: [],
            },
        }
    }
}

const parseData = (dataArray: []): Data => {
    console.log("Estas viendo esto", dataArray)
    return {
        columns: dataArray,
        type: 'bar', // Specify chart type here
    };
}

const BarChart = (props: BarChartProps) => {
    const {data, xType, options} = props

    let chart_options = options!! ? options : defaultOptions(xType)

    const [barData, setBarData] = useState<Data>(parseData([]))

    useEffect(() => {
        setBarData(parseData(data))
    }, [data]);

    return(
        <Grid
        item={true}
        xs={8}
    >
        <Card>
            <CardContent>
                <h1>Lineas con C3.js</h1>
                <C3Chart data={barData} options={chart_options} />
            </CardContent>
        </Card>
    </Grid>)

};

export default BarChart;