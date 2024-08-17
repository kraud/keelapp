import React, {useEffect, useState} from 'react';
import C3Chart from "./C3Chart";

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

interface PieChartProps {
    data: any,
    unit: string,
    options?: any
}

// Json Data example
let exampleJsonData = {
    Spanish: 200,
    Estonian: 100,
    German: 300,
    English: 400
}


// Funcion que toma una entrada con la estructura de exampleJsonData y le da el formato esperado de la librería C3
function parseData(jsonData: any) {
    return {
        json: [jsonData],
        keys: {
            // ["Spanish", "Estonian", ... ]
            value: Object.keys(jsonData),
        },
        type: 'pie'
    }
}

const PieChart = (props: PieChartProps) => {
    // check if using custom or default options for pie chart
    let options = props.options!! ? props.options : defaultOptions(props.unit)

    const [dataPie, setDataPie] = useState()

    useEffect(() => {
        // let data = props.data
        let parsedData = parseData(exampleJsonData)
        console.log("ejecuting", parsedData)
        try {
            setDataPie(parsedData)
        } catch (e) {
            console.log("error:", e)
        }
        console.log("ejecuted", dataPie)
    }, [dataPie, props])


    useEffect(() => {
        console.log("la data", dataPie)
    }, [dataPie])

    return <C3Chart data={dataPie} options={options}></C3Chart>;
};


export default PieChart;
