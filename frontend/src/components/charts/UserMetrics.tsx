import React, {useEffect, useState} from 'react';
import {Grid, ToggleButtonGroup, ToggleButton} from "@mui/material";
import {useSelector} from "react-redux";
import PieChart from "./PieChart";
import BarChart from "./BarChart";

enum MetricsType {
    WORDS, TRANSLATIONS
}


export function UserMetrics() {
    const {isSuccess, data} = useSelector((state: any) => state.metrics)

    const [pieData, setPieData] = useState({})
    const [barCharData, setBarCharData] = useState({})
    const [currentMetricsType, setCurrentMetricsType] = useState<MetricsType>(MetricsType.WORDS)

    useEffect(() => {
        if(isSuccess) {
            if (currentMetricsType === MetricsType.WORDS) {
                setPieData(data.wordsPerPOS)
                setBarCharData(data.wordsPerMonth)
            } else {
                setPieData(data.translationsPerLanguage)
                setBarCharData(data.translationsPerLanguageAndPOS)
            }
        }
    }, [isSuccess, data.wordsPerPOS, data.wordsPerMonth, currentMetricsType])

    return (
        <Grid>
            <ToggleButtonGroup
                color="primary"
                exclusive
                value={currentMetricsType}
                onChange={(event, value) => {
                    setCurrentMetricsType(value)
                }}
                aria-label="Platform"
            >
                <ToggleButton value={MetricsType.WORDS}>Words</ToggleButton>
                <ToggleButton value={MetricsType.TRANSLATIONS}>Translations</ToggleButton>
            </ToggleButtonGroup>
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
                        unit={(currentMetricsType === MetricsType.WORDS) ? "words" : "translations"}
                        title={(currentMetricsType === MetricsType.WORDS) ? "Distribution of word types" : "Distribution of languages"}
                    />
                </Grid>
                <Grid
                    item={true}
                    xs={12}
                    lg={8}
                >
                    <BarChart
                        data={barCharData}
                        xType={"category"}
                        title={
                            (currentMetricsType === MetricsType.WORDS)
                                ? 'Words added per month.'
                                : 'Translations added per type.'
                        }
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default UserMetrics
