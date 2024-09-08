import React, {useEffect, useState} from 'react';
import C3Chart from "./C3Chart";
import {Grid, Typography} from "@mui/material";
import {partOfSpeechChartColors} from "../../theme/chartsColors";
import globalTheme from "../../theme/theme";

interface BarChartProps {
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
            //We get the index where the label being processed is.
            const index = arrayData.findIndex((timeSlap) => timeSlap.name.includes(element.label))
            if (index >0) {
                //If the array have the label being processed, it will only add the new partOfSpech data.
                arrayData[index] = {
                    ...arrayData[index],
                    [element._id.partOfSpeech]: element.count
                }
            } else {
                //If the array doesnt have the label being processed, it will add it.
                arrayData.push({
                    "name": element.label,
                    [element._id.partOfSpeech]: element.count
                })
            }
            //We verify if the label had been processed.
            const keys = arrayKeys.find((key) => key.includes(element._id.partOfSpeech))
            if(keys === undefined){
                //if the label doesnt exist in array, we will add the label to the array.
                arrayKeys.push(element._id.partOfSpeech)
            }
        })
    }
    return ({
        /*
        example
        json: [
                {name: '2023-01', verbs: 200, nouns: 200},
                {name: '2023-02', verbs: 100, nouns: 300},
                {name: '2023-04', verbs: 300, nouns: 200},
                {name: '2023-05', verbs: 400, nouns: 100},
            ]

        */
        json: arrayData,
        keys: {
            x: 'name',
            value: arrayKeys,
        },
        type: 'bar',
        groups: [arrayKeys],
        colors: partOfSpeechChartColors
    })
}

const BarChart = (props: BarChartProps) => {
    const {data, xType, title} = props

    const [barData, setBarData] = useState<any>(parseData([]))
    const [options, setOptions] = useState<any>(defaultOptions(xType))

    useEffect(() => {
        setBarData(parseData(data))
        setOptions(defaultOptions(xType))
    }, [data, xType])

    return(
        <Grid
            container={true}
            justifyContent={"center"}
            item={true}
            sx={{
                border: '4px solid #0072CE',
                borderRadius: '25px',
                height: '100%',
                padding: globalTheme.spacing(3)
            }}
        >
            <Grid
                item={true}
                xs={12}
            >
                <Typography
                    variant={'h2'}
                    align={"center"}
                    sx={{
                        typography: {
                            xs: 'h3',
                            sm: 'h2',
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
                    data={barData}
                    options={options}
                />
            </Grid>
        </Grid>
    )

}

export default BarChart