import React, {useEffect, useState} from 'react';
import C3Chart from "./C3Chart";
import {Button, Grid, Typography} from "@mui/material";
import {Data} from "c3";
import globalTheme from "../../theme/theme";
import {useNavigate} from "react-router-dom";
import {partOfSpeechChartColors} from "../../theme/chartsColors";
import Tooltip from "@mui/material/Tooltip";

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
        type: 'pie',
        colors: partOfSpeechChartColors
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
    const navigate = useNavigate()

    const handleRedirect = (link: string | undefined, word: string | undefined) => {
        if (link !== undefined) {
            navigate(link + word?.toString())
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
        <Grid
            container={true}
            justifyContent={"center"}
            item={true}
            sx={{
                border: '4px solid #0072CE',
                borderRadius: '25px',
                padding: globalTheme.spacing(3)
            }}
        >
            <Grid
                container={true}
                justifyContent={"center"}
                item={true}
            >
                <Grid
                    item={true}
                    xs={'auto'}
                >
                    <Typography
                        align={"center"}
                        sx={{
                            typography: {
                                xs: 'h4',
                                sm: 'h3',
                                lg: 'h4'
                            }
                        }}
                    >
                        {title}
                    </Typography>
                </Grid>
                <Grid
                    item={true}
                    xs={12}
                >
                    <C3Chart
                        data={pieData}
                        options={chart_options}
                    />
                </Grid>
            </Grid>
            <Grid
                item={true}
                xs={'auto'}
            >
                <Typography
                    variant={'h6'}
                    align={"center"}
                >
                    Your worst category is:

                    <Tooltip
                        title={'Click here to add a new '+(worstCategory).toLowerCase()}
                    >
                        <Button
                            onClick={() => {
                                handleRedirect("addWord/", worstCategory)
                            }}
                            variant={"text"}
                        >
                            {worstCategory}
                        </Button>
                    </Tooltip>
                </Typography>
            </Grid>
        </Grid>
    )
};


export default PieChart
