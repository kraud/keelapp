import React, {useEffect, useState} from 'react';
import C3Chart from "./C3Chart";
import {Button, Grid, Typography} from "@mui/material";
import {chartColors} from "../../theme/chartsColors";
import globalTheme from "../../theme/theme";
import {Data} from "c3";
import {MetricsType} from "../../ts/enums";
import {useTranslation} from "react-i18next";
import {languageTranslator, partOfSpeechTranslator} from "../generalUseFunctions";

interface BarChartProps {
    data: any,
    xType: string
    title: string
    options?: any
    currentType: MetricsType
    onTypeChange: (type: MetricsType) => void
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

type BarCharData = {
    _id: any,
    label: string,
    partOfSpeech: string,
    type: "date" | "language",
    count: number
}

const BarChart = (props: BarChartProps) => {
    const { t } = useTranslation(['dashboard', 'common'])
    const {data, xType, title} = props
    const [groupsChecked, setGroupsChecked] = useState<boolean>(true)

    const lanTranslator = languageTranslator(t)
    const posTranslator = partOfSpeechTranslator(t)

    const parseData = (dataArray: BarCharData []): any => {
        const arrayData : any [] = []
        const arrayKeys : any [] = []
        if(dataArray.length > 0) {
            dataArray.forEach((element: BarCharData) => {
                //We get the index where the label being processed is.
                const labelTranslated = (element.type === "language") ? lanTranslator(element.label) : element.label
                const index = arrayData.findIndex((timeSlap) => timeSlap.name.includes(labelTranslated))
                const posTranslated = posTranslator(element.partOfSpeech)
                if (index !== -1) {
                    // If the array has the label being processed, it will only add the new partOfSpeech data.
                    arrayData[index] = {
                        ...arrayData[index],
                        [posTranslated]: element.count
                    }
                } else {

                    // If the array doesn't have the label being processed, it will add it.
                    arrayData.push({
                        "name": labelTranslated,
                        [posTranslated]: element.count
                    })
                }
                // We verify if the label had been processed.
                const keys = arrayKeys.find((key) => key.includes(posTranslated))
                if (keys === undefined) {
                    // If the label doesn't exist in array, we will add the label to the array.
                    arrayKeys.push(posTranslated)
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
            groups: groupsChecked ? [arrayKeys] : [],
            colors: chartColors
        })
    }

    const [barData, setBarData] = useState<Data>(parseData([]))
    const [options, setOptions] = useState<any>(defaultOptions(xType))

    useEffect(() => {
        //
        setBarData(parseData(data))
        setOptions(defaultOptions(xType))
    }, [data, xType, groupsChecked])

    return(
        <Grid
            container={true}
            direction={'column'}
            justifyContent={"space-between"}
            alignContent={"center"}
            item={true}
            sx={{
                border: '4px solid #0072CE',
                borderRadius: '25px',
                height: '100%',
                padding: globalTheme.spacing(3)
            }}
        >
            <Grid
                container={true}
                justifyContent={"center"}
                item={true}
                rowSpacing={3}
            >
                <Grid
                    item={true}
                    container={true}
                    xs={'auto'}
                    rowSpacing={1}
                    direction={"column"}
                >
                    <Grid
                        container={true}
                        justifyContent={"center"}
                        item={true}
                        xs={'auto'}
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
                    </Grid>
                    <Grid
                        item={true}
                        container={true}
                        spacing={1}
                        justifyContent={"center"}
                        xs={true}
                    >
                        <Grid
                            item={true}
                            xs={true}
                        >
                            <Button
                                variant={(props.currentType === MetricsType.WORDS)
                                    ? 'contained'
                                    : 'outlined'
                                }
                                color={'primary'}
                                fullWidth={true}
                                size={"small"}
                                onClick={() => {
                                    props.onTypeChange(MetricsType.WORDS)
                                }}
                            >
                                {t('buttons.byMonth', {ns: 'common'})}
                            </Button>
                        </Grid>
                        <Grid
                            item={true}
                            xs={true}
                        >
                            <Button
                                variant={(props.currentType === MetricsType.TRANSLATIONS)
                                    ? 'contained'
                                    : 'outlined'
                                }
                                color={'primary'}
                                fullWidth={true}
                                size={"small"}
                                onClick={() => {
                                    props.onTypeChange(MetricsType.TRANSLATIONS)
                                }}
                            >
                                {t('buttons.byLanguage', {ns: 'common'})}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    container={true}
                    item={true}
                >
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
                <Grid
                    item={true}
                    container={true}
                    spacing={1}
                    justifyContent={"center"}
                    xs={6}
                >
                    <Grid
                        item={true}
                        xs={true}
                    >
                        <Button
                            variant={'text'}
                            color={'primary'}
                            fullWidth={true}
                            size={"small"}
                            onClick={() => {
                                setGroupsChecked(true)
                            }}
                            sx={{
                                color: (groupsChecked)
                                    ? undefined
                                    : 'black'
                            }}
                        >
                            {t('buttons.groupByType', {ns: 'common'})}
                        </Button>
                    </Grid>
                    <Grid
                        item={true}
                        xs={true}
                    >
                        <Button
                            variant={'text'}
                            color={'primary'}
                            fullWidth={true}
                            size={"small"}
                            onClick={() => {
                                setGroupsChecked(false)
                            }}
                            sx={{
                                color: (groupsChecked)
                                    ? 'black'
                                    : undefined
                            }}
                        >
                            {t('buttons.separateByType', {ns: 'common'})}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )

}

export default BarChart