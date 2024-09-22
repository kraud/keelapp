import {Grid, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {CountryFlag} from "./GeneralUseComponents";
import Button from "@mui/material/Button";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React from "react";
import {useTranslation} from "react-i18next";
import {shuffleArray} from "./generalUseFunctions";
import {ExerciseTypeSelection} from "../ts/enums";


interface ExerciseCardProps {
    type: ExerciseTypeSelection,
    currentCardIndex: number,
    setCurrentCardIndex: (index: number) => void
    exercises: any[],
    isLoadingExercises: boolean
    onClickReset: () => void
}

export const ExerciseCard = (props: ExerciseCardProps) => {
    const { t } = useTranslation(['partOfSpeechCases'])

    const getOptionsToDisplay = (type: ExerciseTypeSelection) => {
        switch(type){
            case(ExerciseTypeSelection["Multiple-Choice"]): {
                let allOptions = [
                    props.exercises[props.currentCardIndex].matchingTranslations.itemB.value,
                    ...props.exercises[props.currentCardIndex].matchingTranslations.itemB.otherValues
                ]
                shuffleArray(allOptions)
                return(
                    <Grid
                        container={true}
                        item={true}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        {allOptions.map((option: string, index: number) => {
                            return(
                                <Grid
                                    key={index}
                                    item={true}
                                    xs={12}
                                    sx={{
                                        border: '2px solid gray',
                                    }}
                                >
                                    <Button
                                        variant={'contained'}
                                        color={'success'}
                                        fullWidth={true}
                                    >
                                        {option}
                                    </Button>
                                </Grid>
                            )
                        })}
                    </Grid>
                )
            }
            case(ExerciseTypeSelection["Text-Input"]): {
                return(
                    <Grid
                        item={true}
                        xs={12}
                        sx={{
                            border: '2px solid gray',
                        }}
                    >
                        {/* TODO: this should be a text-input field */}
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
                            {props.exercises[props.currentCardIndex].matchingTranslations.itemB.value}
                        </Typography>
                    </Grid>
                )
            }
            default: {
                return('Something went wrong with this exercise... My bad.')
            }
        }
    }

    return(
        <Grid
            container={true}
            justifyContent={'center'}
            alignItems={'center'}
            item={true}
            xs={12}
            sm={10}
            md={8}
            lg={7}
            xl={6}
            sx={{
                border: '4px solid green',
            }}
        >
            {/*BUTTON BACK*/}
            <Grid
                container={true}
                item={true}
                justifyContent={'center'}
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
                        border: '4px solid yellow',
                    }}
                >
                    <IconButton
                        color={'primary'}
                        disabled={(props.currentCardIndex === 0)}
                        onClick={() => {
                            if(props.currentCardIndex > 0){
                                props.setCurrentCardIndex((props.currentCardIndex-1))
                            } else {
                                // Not possible, but TS requires it. Button is disabled.
                                props.setCurrentCardIndex((props.currentCardIndex))
                            }
                        }}
                    >
                        <ChevronLeftIcon
                            sx={{
                                fontSize: 100,
                                marginLeft: '-35px',
                                marginRight: '-35px'
                            }}
                        />
                    </IconButton>
                </Grid>
            </Grid>
            {!(props.exercises.length > 0)
                ? <Grid
                    container={true}
                    justifyContent={'center'}
                    item={true}
                    xs={6}
                >
                    <Grid
                        item={true}
                    >
                        <Typography
                            variant={'h3'}
                        >
                            No results matching those parameters, please try again with different settings.
                        </Typography>
                    </Grid>
                </Grid>
                : <Grid
                    container={true}
                    justifyContent={'center'}
                    alignItems={'center'}
                    direction={'column'}
                    item={true}
                    xs={true}
                    sx={{
                        border: '4px solid red',
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
                            border: '4px solid yellow',
                            height: '100%'
                        }}
                    >
                        <Grid
                            container={true}
                            justifyContent={'center'}
                            item={true}
                            sx={{
                                border: '4px solid black',
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
                                    country={props.exercises[props.currentCardIndex].matchingTranslations.itemA.language}
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
                                    {props.exercises[props.currentCardIndex].matchingTranslations.itemA.value}
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
                                    {t(`${(props.exercises[props.currentCardIndex].partOfSpeech as string).toLowerCase()}.${props.exercises[props.currentCardIndex].matchingTranslations.itemA.case}`, {ns: 'partOfSpeechCases'})}
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
                                    country={props.exercises[props.currentCardIndex].matchingTranslations.itemB.language}
                                    border={true}
                                />
                            </Grid>
                            {getOptionsToDisplay(props.type)}
                        </Grid>
                        {(props.type === 'Text-Input') &&
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
                        }
                    </Grid>
                </Grid>
            }
            {/* BUTTON FORWARD */}
            <Grid
                container={true}
                item={true}
                justifyContent={'center'}
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
                        border: '4px solid yellow',
                    }}
                >
                    <IconButton
                        color={'primary'}
                        disabled={(props.currentCardIndex === (props.exercises.length -1))}
                        onClick={() => {
                            if(props.currentCardIndex < (props.exercises.length -1)){
                                props.setCurrentCardIndex(props.currentCardIndex+1)
                            } else {
                                // Not possible, but TS requires it. Button is disabled.
                                props.setCurrentCardIndex(props.currentCardIndex)
                            }
                        }}
                    >
                        <ChevronRightIcon
                            sx={{
                                fontSize: 100,
                                marginLeft: '-35px',
                                marginRight: '-35px'
                            }}
                        />
                    </IconButton>
                </Grid>
            </Grid>
            {/* ACTION BUTTONS */}
            <Grid
                container={true}
                justifyContent={'center'}
                item={true}
                xs={12}
                sx={{
                    border: '4px solid red',
                }}
            >
                <Grid
                    item={true}
                    xs={true}
                >
                    <Button
                        variant={'contained'}
                        color={'warning'}
                        fullWidth={true}
                        disabled={props.isLoadingExercises}
                        onClick={() => {
                            props.onClickReset()
                        }}
                    >
                        Reset
                    </Button>
                </Grid>
                <Grid
                    item={true}
                    xs={true}
                >
                    <Button
                        variant={'contained'}
                        color={'secondary'}
                        fullWidth={true}
                        disabled={props.isLoadingExercises}
                        onClick={() => {

                        }}
                    >
                        Finish
                    </Button>
                </Grid>
                <Grid
                    item={true}
                    xs={true}
                >
                    <Button
                        variant={'contained'}
                        color={'primary'}
                        fullWidth={true}
                        disabled={props.isLoadingExercises}
                        onClick={() => {

                        }}
                    >
                        Clue
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}