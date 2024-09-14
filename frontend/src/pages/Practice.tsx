import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../app/store";
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {Grid, Typography} from "@mui/material";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import LinearIndeterminate from "../components/Spinner";
import {CountryFlag} from "../components/GeneralUseComponents";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface CardAnswerData {
    index: number,
    answer: string,
}

interface PracticeProps {

}

export const Practice = (props: PracticeProps) => {
    const {exercises, isErrorExercises, isSuccessExercises, isLoadingExercises} = useSelector((state: any) => state.exercises)

    const { t } = useTranslation(['partOfSpeechCases', 'exercises', 'common'])
    const dispatch = useDispatch<AppDispatch>()

    const [currentCardIndex, setCurrentCardIndex] = useState(0)

    const [cardAnswers, setCardAnswers] = useState<CardAnswerData[]>([])


    return(
        <Grid
            component={motion.div} // to implement animations with Framer Motion
            variants={routeVariantsAnimation}
            initial="initial"
            animate="final"
            container={true}
            item={true}
            sx={{
                marginTop: globalTheme.spacing(4),
                border: '3px solid black'
            }}
            // rowSpacing={2}
            xs={12}
            md={11}
            lg={10}
            xl={9}
        >
            <Grid
                container={true}
                justifyContent={'center'}
                item={true}
                sx={{
                    border: '3px solid #2E2E2EFF',
                }}
            >
                <Grid
                    item={true}
                    xs={true}
                    sx={{
                        border: '3px solid blue',
                        // borderColor: '#2e2e2e',
                    }}
                >
                    <Typography
                        sx={{
                            typography: {
                                xs: 'h4',
                                sm: 'h3',
                                md: 'h1',
                            },
                        }}
                        align={"center"}
                    >
                        {`Exercises ${currentCardIndex+1}/${exercises.length}`}
                    </Typography>
                </Grid>
            </Grid>
            <Grid
                container={true}
                justifyContent={'center'}
                alignItems={'center'}
                item={true}
                xs={12}
                sx={{
                    border: '3px solid #2E2E2EFF',
                }}
            >
                {(isLoadingExercises && !isSuccessExercises)
                    ?
                        <LinearIndeterminate/>
                    :
                    <Grid
                        container={true}
                        justifyContent={'center'}
                        alignItems={'center'}
                        // direction={'column'}
                        item={true}
                        xs={12}
                        sm={10}
                        md={8}
                        lg={7}
                        xl={6}
                        sx={{
                            border: '4px solid gray',
                            // borderRadius: '25px',
                            height: '55vh',
                            // background: '#d3d3d3',
                        }}
                    >
                        {/*BUTTON BACK*/}
                        <Grid
                            container={true}
                            item={true}
                            justifyContent={'center'}
                            // rowSpacing={3}
                            alignItems={'center'}
                            xs={'auto'}
                            sx={{
                                border: '4px solid red',
                            }}
                        >
                            <Grid
                                item={true}
                                xs={true}
                                sx={{
                                    border: '4px solid green',
                                    // width: '40px'
                                }}
                            >
                                <IconButton
                                    color={'primary'}
                                    disabled={(currentCardIndex === 0)}
                                    onClick={() => {
                                        setCurrentCardIndex((currentIndex) => {
                                            if(currentIndex > 0){
                                                return(currentIndex-1)
                                            } else {
                                                // Not possible, but TS requires it. Button is disabled.
                                                return(currentIndex)
                                            }
                                        })
                                    }}
                                >
                                    <ChevronLeftIcon
                                        sx={{
                                            fontSize: 100,
                                            // width: '40px'
                                            marginLeft: '-35px',
                                            marginRight: '-35px'
                                        }}
                                    />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Grid
                            container={true}
                            justifyContent={'center'}
                            alignItems={'center'}
                            direction={'column'}
                            item={true}
                            xs={true}
                            sx={{
                                border: '4px solid blue',
                                borderRadius: '25px',
                                height: '55vh',
                                background: '#d3d3d3',
                            }}
                        >
                            <Grid
                                container={true}
                                item={true}
                                direction={'column'}
                                justifyContent={'space-around'}
                                xs={true}
                                // rowSpacing={3}
                                alignItems={'center'}
                                sx={{
                                    border: '4px solid red',
                                    height: '100%'
                                }}
                            >
                                <Grid
                                    container={true}
                                    justifyContent={'center'}
                                    item={true}
                                    sx={{
                                        border: '4px solid green',
                                    }}
                                >
                                    <Grid
                                        item={true}
                                        xs={'auto'}
                                        sx={{
                                            border: '2px solid gray',
                                        }}
                                    >
                                        <CountryFlag
                                            country={exercises[currentCardIndex].matchingTranslations.itemA.language}
                                            border={true}
                                        />
                                    </Grid>
                                    <Grid
                                        item={true}
                                        xs={12}
                                        sx={{
                                            border: '2px solid gray',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                typography: {
                                                    xs: 'h6',
                                                    sm: 'h5',
                                                    md: 'h3',
                                                },
                                            }}
                                            align={"center"}
                                        >
                                            {/* TODO: itemA or itemB should be random selection */}
                                            {exercises[currentCardIndex].matchingTranslations.itemA.value}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item={true}
                                        xs={12}
                                        sx={{
                                            border: '2px solid gray',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                typography: {
                                                    xs: 'body2',
                                                    sm: 'body1',
                                                    md: 'h6',
                                                },
                                            }}
                                            align={"center"}
                                        >
                                            {t(`${(exercises[currentCardIndex].partOfSpeech as string).toLowerCase()}.${exercises[currentCardIndex].matchingTranslations.itemA.case}`, {ns: 'partOfSpeechCases'})}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid
                                    container={true}
                                    justifyContent={'center'}
                                    item={true}
                                    sx={{
                                        border: '4px solid green',
                                    }}
                                >
                                    <Grid
                                        item={true}
                                        xs={'auto'}
                                        sx={{
                                            border: '2px solid gray',
                                        }}
                                    >
                                        <CountryFlag
                                            country={exercises[currentCardIndex].matchingTranslations.itemB.language}
                                            border={true}
                                        />
                                    </Grid>
                                    <Grid
                                        item={true}
                                        xs={12}
                                        sx={{
                                            border: '2px solid gray',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                typography: {
                                                    xs: 'h6',
                                                    sm: 'h5',
                                                    md: 'h3',
                                                },
                                            }}
                                            align={"center"}
                                        >
                                            {/* TODO: itemB or itemB should be random selection */}
                                            {exercises[currentCardIndex].matchingTranslations.itemB.value}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid
                                    container={true}
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    item={true}
                                    sx={{
                                        border: '4px solid green',
                                    }}
                                >

                                    <Grid
                                        item={true}
                                        xs={8}
                                        sx={{
                                            border: '2px solid gray',
                                        }}
                                    >
                                        <Button
                                            variant={'contained'}
                                            color={'success'}
                                            fullWidth={true}
                                        >
                                            Check
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* BUTTON FORWARD */}
                        <Grid
                            container={true}
                            item={true}
                            justifyContent={'center'}
                            // rowSpacing={3}
                            alignItems={'center'}
                            xs={'auto'}
                            sx={{
                                border: '4px solid red',
                            }}
                        >
                            <Grid
                                item={true}
                                xs={true}
                                sx={{
                                    border: '4px solid green',
                                    // width: '40px'
                                }}
                            >
                                <IconButton
                                    color={'primary'}
                                    disabled={(currentCardIndex === (exercises.length -1))}
                                    onClick={() => {
                                        setCurrentCardIndex((currentIndex) => {
                                            if(currentIndex < (exercises.length -1)){
                                                return(currentIndex+1)
                                            } else {
                                                // Not possible, but TS requires it. Button is disabled.
                                                return(currentIndex)
                                            }
                                        })
                                    }}
                                >
                                    <ChevronRightIcon
                                        sx={{
                                            fontSize: 100,
                                            // width: '40px'
                                            marginLeft: '-35px',
                                            marginRight: '-35px'
                                        }}
                                    />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                }
            </Grid>
        </Grid>
    )
}