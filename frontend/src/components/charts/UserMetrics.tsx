import React, {useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import {useSelector} from "react-redux";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import {MetricsType} from "../../ts/enums";
import {useTranslation} from "react-i18next";



export function UserMetrics() {
    const { t } = useTranslation(['dashboard'])
    const {isSuccess, data} = useSelector((state: any) => state.metrics)

    const [pieData, setPieData] = useState({})
    const [barCharData, setBarCharData] = useState({})
    const [currentMetricsPieType, setCurrentMetricPieType] = useState<MetricsType>(MetricsType.TRANSLATIONS)
    const [currentMetricsBarType, setCurrentMetricsBarType] = useState<MetricsType>(MetricsType.WORDS)

    useEffect(() => {
        if(isSuccess) {
            if (currentMetricsPieType === MetricsType.WORDS) {
                setPieData(data.wordsPerPOS)
            } else {
                setPieData(data.translationsPerLanguage)
            }
            if (currentMetricsBarType === MetricsType.WORDS) {
                setBarCharData(data.wordsPerMonth)
            } else {
                setBarCharData(data.translationsPerLanguageAndPOS)
            }
        }
    }, [isSuccess, data.wordsPerPOS, data.wordsPerMonth, currentMetricsPieType, currentMetricsBarType])

    return (
        <Grid>
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
                        unit={(currentMetricsPieType === MetricsType.WORDS)
                            ? t('charts.pie.unit.words', {ns: 'dashboard'})
                            : t('charts.pie.unit.translations', {ns: 'dashboard'})
                        }
                        title={(currentMetricsPieType === MetricsType.WORDS)
                            ? t('charts.pie.title.wordMetric', {ns: 'dashboard'})
                            : t('charts.pie.title.translationMetric', {ns: 'dashboard'})
                        }
                        currentType={currentMetricsPieType}
                        onTypeChange={(type: MetricsType) => {
                            setCurrentMetricPieType(type)
                        }}
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
                            (currentMetricsBarType === MetricsType.WORDS)
                                ? t('charts.bar.title.wordMetric', {ns: 'dashboard'})
                                : t('charts.bar.title.translationMetric', {ns: 'dashboard'})
                        }
                        currentType={currentMetricsBarType}
                        onTypeChange={(type: MetricsType) => {
                            setCurrentMetricsBarType(type)
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default UserMetrics
