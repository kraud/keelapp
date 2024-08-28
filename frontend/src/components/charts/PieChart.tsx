import React, {useEffect, useState} from 'react';
import C3Chart from "./C3Chart";
import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import {Data} from "c3";
import globalTheme from "../../theme/theme";

const defaultOptions = (untis) => {
    return {
        legend: {
            position: 'right'
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    // example: 980 translations
                    return value + " " + untis
                }
            }
        }
    }
}

// transforma el array devuelto de DATOS con por el BE a una estrucutra
function transformArray(originalArray, idKey, propertyKey) {
    return originalArray.map(obj => {
        const idValue = obj[idKey];
        const propertyValue = obj[propertyKey];
        return {[idValue]: propertyValue};
    });
}

// Funcion que toma una entrada con la estructura de exampleJsonData y le da el formato esperado de la librería C3
const parseData = (dataArray: []): Data => {
    let newArray = {}
    console.log("aca mostrame esto nicolas", dataArray)
    if(dataArray.length > 0) {
        newArray = transformArray(dataArray, "_id", "count")
        console.log("aca nicolas",Object.keys(newArray))
    }

    return ({
        json: [newArray],
        keys: {
            // ["Spanish", "Estonian", ... ]
            value: Object.keys(newArray),
        },
        type: 'pie'
    })
}

interface PieChartProps {
    data: any,
    unit: string,
    options?: any
}

const PieChart = (props: PieChartProps) => {
    // check if using custom or default options for pie chart
    const {data, unit, options} = props

    let chart_options = options!! ? options : defaultOptions(unit)

    const [pieData, setPieData] = useState<Data>(parseData([]))

    useEffect(() => {
        let parsedData = parseData(data)
        // todo: del parsed data sacar la peor categoria
        console.log("parsedData:", parsedData)
        setPieData(parsedData)
    }, [data])

    return (
        <Card
            sx={{paddingX: globalTheme.spacing(1)}}
        >
            <CardContent>
                <C3Chart
                    data={pieData}
                    options={chart_options}
                />
            </CardContent>
            <CardActions>
                <Typography>
                    Your worse category is: <Button> "tu culito" </Button>
                </Typography>
                <Button size="small" color="primary">
                </Button>
            </CardActions>
        </Card>
    )
};


export default PieChart;
