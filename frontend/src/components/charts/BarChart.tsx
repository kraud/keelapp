import React, {useEffect, useState} from 'react';
import C3Chart from "./C3Chart";
import {Card, CardContent} from "@mui/material";

interface BarChartProps{
    data: any,
    xType: string
    title: string
    options?: any
}

const defaultOptions = (xType: string): any => {
    return {
        axis: {
            x: {
                type: xType,
            },
        }
    }
}

type WordsPerMonth = { _id: IdWordsPerMonth, label: string, count: number}
type IdWordsPerMonth = {year: number, month: string, partOfSpeech: string}


const parseData = (dataArray: WordsPerMonth []): any => {
    const arrayData : any [] = []
    const arrayKeys : any [] = []
    if(dataArray.length > 0) {
        dataArray.forEach((element: WordsPerMonth) => {
            const index = arrayData.findIndex((timeSlap) => timeSlap.name.includes(element.label))
            if (index >0) {
                arrayData[index] = {
                    ...arrayData[index],
                    [element._id.partOfSpeech]: element.count
                }
            } else {
                arrayData.push({
                    "name": element.label,
                    [element._id.partOfSpeech]: element.count
                })
            }

            const keys = arrayKeys.find((key) => key.includes(element._id.partOfSpeech))
            if(keys === undefined){
                arrayKeys.push(element._id.partOfSpeech)
            }
        })
    }
    return {
         json: arrayData,
            keys: {
                x: 'name',
                value: arrayKeys,
            },
            type: 'bar',
            groups: [arrayKeys]
        }
}

const BarChart = (props: BarChartProps) => {
    const {data, xType, title} = props

    const [barData, setBarData] = useState<any>(parseData([]))
    const [options, setOptions] = useState<any>(defaultOptions(xType))

    useEffect(() => {
        setBarData(parseData(data))
        setOptions(defaultOptions(xType))
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