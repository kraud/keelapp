import React, {useEffect, useState} from 'react';
import C3Chart from "./C3Chart";
import {Button, Grid, Typography} from "@mui/material";
import {Data, Primitive} from "c3";
import globalTheme from "../../theme/theme";
import {useNavigate} from "react-router-dom";
import {partOfSpeechChartColors} from "../../theme/chartsColors";
import Tooltip from "@mui/material/Tooltip";
import {MetricsType} from "../../ts/enums";
import {useTranslation} from "react-i18next";
import {languageTranslator, partOfSpeechTranslator} from "../generalUseFunctions";

const defaultOptions = (untis: string) => {
    return {
        legend: {
            position: 'right'
        },
        tooltip: {
            format: {
                value: function (value: Primitive, ratio: number | undefined, id: string, index: number): string {
                    return value + " " + untis
                }
            }
        }
    }
}

// transforma el array devuelto de DATOS con por el BE a una estrucutra
function translateAndTransform(translator: (access: string) => string, originalArray: PieCharC3[]) {
    let translatedData = {}
    let worstCategory: string = ""
    let worstCategoryCount: number

    originalArray.forEach((obj) => {
        let translatedLabel = translator(obj[obj.type])
        translatedData[translatedLabel] = obj.count
        if (worstCategoryCount === undefined || obj.count < worstCategoryCount) {
            worstCategory = obj[obj.type]
            worstCategoryCount = obj.count
        }
    });

    return {translatedData, worstCategory}
}

interface PieCharC3 {
    _id: any,
    label: string,
    type: string,
    count: number
}

// Funcion que toma una entrada con la estructura de exampleJsonData y le da el formato esperado de la librería C3
const parseData = (dataArray: {}): Data => {
    return ({
        json: [dataArray],
        keys: {
            // ["Spanish", "Estonian", ... ]
            value: Object.keys(dataArray),
        },
        type: 'pie',
        colors: partOfSpeechChartColors
    })
}

interface PieChartProps {
    data: any,
    unit: string,
    title: string,
    options?: any,
    currentType: MetricsType
    onTypeChange: (type: MetricsType) => void
}

const PieChart = (props: PieChartProps) => {
    const { t } = useTranslation(['dashboard', 'common'])
    // check if using custom or default options for pie chart
    const {data, unit, options, title, currentType} = props
    const navigate = useNavigate()

    const handleRedirect = (link: string | undefined, word: string | undefined) => {
        if (link !== undefined) {
            navigate(link + word?.toString())
        }
    }

    let chart_options = options!! ? options : defaultOptions(unit)

    const lanTranslator = languageTranslator(t)
    const posTranslator = partOfSpeechTranslator(t)

    const [pieData, setPieData] = useState<Data>(parseData([]))
    const [worstCategory, setWorstCategory] = useState<string>("")

    useEffect(() => {
        if (data.length > 0) {
            let translatorFunction = currentType === MetricsType.WORDS ? posTranslator : lanTranslator
            let {translatedData, worstCategory} = translateAndTransform(translatorFunction, data)
            setPieData(parseData(translatedData))
            setWorstCategory(worstCategory)
        }
    }, [data, currentType])

    return (
        <Grid
            container={true}
            direction={'column'}
            justifyContent={"space-between"}
            alignContent={"center"}
            item={true}
            sx={{
                border: '4px solid #0072CE',
                borderRadius: '25px',
                padding: globalTheme.spacing(3),
                height: '100%',
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
                                {t('buttons.distributionByWordType', {ns: 'common'})}
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
                                {t('buttons.distributionByLanguage', {ns: 'common'})}
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
                            data={pieData}
                            options={chart_options}
                        />
                    </Grid>
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
                    {t('charts.pie.worstCategory', {ns: 'dashboard'})}
                    <Tooltip
                        title={(props.currentType === MetricsType.WORDS)
                            ? t(
                                'charts.pie.tooltip.newWordByCategory',
                                {
                                    ns: 'dashboard',
                                    category: worstCategory
                                        // t(`partOfSpeech.${(worstCategory).toLowerCase()}`, {ns: 'common'})
                                }
                            )
                            : t(
                                'charts.pie.tooltip.newWordByLanguage',
                                {
                                    ns: 'dashboard',
                                    language: (worstCategory).toLowerCase()
                                    // TODO: add translations for all languages?
                                    // language: t(`languages.${(worstCategory).toLowerCase()}`, {ns: 'common'})
                                })
                        }
                    >
                        <Button
                            onClick={() => {
                                handleRedirect("addWord/", worstCategory)
                            }}
                            variant={"text"}
                        >
                            {(props.currentType === MetricsType.WORDS)
                                ? posTranslator(worstCategory)
                                : lanTranslator(worstCategory)
                            }
                            {/* TODO: add translations for all languages? */}
                            {/*{t(`languages.${(worstCategory).toLowerCase()}`, {ns: 'common'})}*/}
                        </Button>
                    </Tooltip>
                </Typography>
            </Grid>
        </Grid>
    )
};


export default PieChart
