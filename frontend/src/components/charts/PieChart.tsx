import React, {useEffect, useState} from 'react';
import C3Chart from "./C3Chart";
import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import {Data} from "c3";
import globalTheme from "../../theme/theme";
import {useNavigate} from "react-router-dom";
import {Spring} from "framer-motion";

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
function transformArray(originalArray: PieCharC3[]) {
    let response = {}
    originalArray.forEach(obj => {
        response[obj._id] = obj.count
    });
    return response
}

interface PieCharC3{
    _id : any,
    count: number
}

// Funcion que toma una entrada con la estructura de exampleJsonData y le da el formato esperado de la librería C3
const parseData = (dataArray: []): Data => {
    let newArray = {}
    if(dataArray.length > 0) {
        newArray = transformArray(dataArray)
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
    title: string,
    options?: any
}

const PieChart = (props: PieChartProps) => {
    // check if using custom or default options for pie chart
    const {data, unit, options, title} = props
    const navigate = useNavigate();

    const handleRedirect = (link: string | undefined, word: string | undefined) => {
        // Redirigir a otra ruta
        if (link !== undefined) {
            navigate(link + word?.toString());
        }
    };

    let chart_options = options!! ? options : defaultOptions(unit)

    const [pieData, setPieData] = useState<Data>(parseData([]))
    const [worstCategory, setWorstCategory] = useState<string>("")

    function getWorstCategory(parsedData: [PieCharC3]) {
        if(parsedData.length > 0){
            let worst = parsedData[0]._id
            let count = parsedData[0].count
            parsedData.forEach(pieData =>{
                if(pieData.count < count){
                    worst = pieData._id
                    count = pieData.count
                }
            })
            return worst
        }
        return ""
    }

    useEffect(() => {
        setPieData(parseData(data))
        setWorstCategory(getWorstCategory(data))
    }, [data])

    return (
        <Card
            sx={{paddingX: globalTheme.spacing(1)}}
        >
            <CardContent>
                <h1>{title}</h1>
                <C3Chart
                    data={pieData}
                    options={chart_options}
                />
            </CardContent>
            <CardActions>
                <Typography>
                    Your worse category is: <Button onClick={() => {
                    handleRedirect("addWord/", worstCategory)
                }}> {worstCategory} </Button>
                </Typography>
                <Button size="small" color="primary">
                </Button>
            </CardActions>
        </Card>
    )
};


export default PieChart;
