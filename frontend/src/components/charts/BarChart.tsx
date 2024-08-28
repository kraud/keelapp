import React, {useEffect, useState} from 'react';
import C3Chart from "./C3Chart";
import {Card, CardContent, Grid} from "@mui/material";

interface BarChartProps{
    data: any,
    xType: string
    title: string
    options?: any
}

const defaultOptions = (xType: string, dataArray: []): any => {
    let dataArrayCategories : any[] = []
    if(dataArray.length > 0){
        dataArray.forEach((element: { label: any, count: any }) => {
            dataArrayCategories.push(element.label)
        })
    }
    console.log("categorias", dataArrayCategories)
    return {
        axis: {
            x: {
                type: xType,
                categories: dataArrayCategories,
            },
        }
    }
}

const parseData = (dataArray: []): any => {
    const dataArrayToColumn: any[] = ['Languages']
    if(dataArray.length > 0){
        dataArray.forEach((element: { label: any, count: any }) => {
            dataArrayToColumn.push(element.count)
        })
    }
    return {
        columns: [dataArrayToColumn],
        type: 'bar', // Specify chart type here
    };
}

const BarChart = (props: BarChartProps) => {
    const {data, xType, title} = props

    const [barData, setBarData] = useState<any>(parseData([]))
    const [options, setOptions] = useState<any>(defaultOptions(xType,[]))

    useEffect(() => {
        setBarData(parseData(data))
        setOptions(defaultOptions(xType,data))
    }, [data, xType]);

    return(
        <Card>
            <CardContent>
                <h1>{title}</h1>
                <C3Chart
                    data={barData}
                    options={options}
                />
            </CardContent>
        </Card>
    )

};

export default BarChart;