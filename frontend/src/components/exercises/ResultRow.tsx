import globalTheme from "../../theme/theme";
import {Grid, Typography} from "@mui/material";
import {CountryFlag, ChipListOfWordDetailsElements} from "../GeneralUseComponents";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import React from "react";
import {EquivalentTranslationValues, ExerciseResult} from "../../ts/interfaces";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {useTranslation} from "react-i18next";
import {getWordDescriptionElements} from "../generalUseFunctions";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";

interface ResultRowProps {
    originalExerciseData: EquivalentTranslationValues
    exerciseResult: ExerciseResult
    index: number
    setCurrentCardIndex: (index: number) => void // needed to go back to a review exercise (can click on exercise to review)
}

export const ResultRow = (props: ResultRowProps) => {
    const { t } = useTranslation(['caseDescription'])
    const lessThanMd = useMediaQuery(globalTheme.breakpoints.down("md"))

    const relevantWordDescriptionElements = getWordDescriptionElements(props.originalExerciseData.partOfSpeech, props.originalExerciseData.matchingTranslations.itemA.case)


    return(
        <Grid
            key={props.index}
            container={true}
            justifyContent={'space-between'}
            item={true}
            xs={12}
            sx={{
                border: '3px solid',
                borderColor: (props.exerciseResult.correct) ?'#38bc4e' :'#d53636',
                backgroundColor: 'white',
                borderRadius: '25px',
                paddingY: globalTheme.spacing(1),
                paddingX: globalTheme.spacing(2),
                marginY: globalTheme.spacing(0.5)
            }}
        >
            {/* Correct/Incorrect Icon */}
            <Grid
                container={true}
                item={true}
                justifyContent={'center'}
                alignItems={'center'}
                xs={'auto'}
                sx={{
                    paddingX: globalTheme.spacing(1)
                }}
            >
                <Grid
                    item={true}
                >
                    {(props.exerciseResult.correct)
                        ?
                            <CheckCircleIcon
                                color={'success'}
                                sx={{
                                    height: '25px',
                                    width: '25px',
                                    verticalAlign: 'bottom'
                                }}
                            />
                        :
                            <CancelIcon
                                color={'error'}
                                sx={{
                                    height: '25px',
                                    width: '25px',
                                    verticalAlign: 'bottom'
                                }}
                            />
                    }
                </Grid>
            </Grid>
            {/* Exercise-Type Icon */}
            <Grid
                container={true}
                justifyContent={'center'}
                alignItems={'center'}
                xs={'auto'}
                sx={{
                    paddingX: globalTheme.spacing(1)
                }}
            >
                <Grid
                    item={true}
                    xs={'auto'}
                >
                    <Tooltip
                        title={t(`categories.${(props.originalExerciseData.type === "Multiple-Choice") ?'multipleChoice' :'textInput'}`, {ns: 'practice'})}
                        // title={(props.originalExerciseData.type === 'Multiple-Choice')
                        //     ? "Multiple-Choice"
                        //     : "Text-Input"
                        // }
                    >
                        {(props.originalExerciseData.type === 'Multiple-Choice')
                            ?
                                <FormatListBulletedIcon
                                    sx={{
                                        color: 'black',
                                        height: '25px',
                                        width: '25px',
                                        verticalAlign: 'bottom'
                                    }}
                                />
                            :
                                <BorderColorIcon
                                    sx={{
                                        color: 'black',
                                        height: '25px',
                                        width: '25px',
                                        verticalAlign: 'bottom'
                                    }}
                                />
                        }
                    </Tooltip>
                </Grid>
            </Grid>
            {/* Language Flags */}
            <Grid
                container={true}
                justifyContent={'flex-start'}
                alignItems={'center'}
                // xs={2}
                xs={'auto'}
                spacing={1}
                sx={{
                    paddingX: globalTheme.spacing(1),
                }}
            >
                <Grid
                    item={true}
                    xs={'auto'}
                    sx={{
                        marginRight: !(props.originalExerciseData.multiLang) ?'35px' :0
                    }}
                >
                    <CountryFlag
                        country={props.originalExerciseData.matchingTranslations.itemA.language}
                        border={true}
                        size={1}
                    />
                </Grid>
                {(props.originalExerciseData.multiLang === true) &&
                    <Grid
                        item={true}
                        xs={'auto'}
                    >
                        <CountryFlag
                            country={props.originalExerciseData.matchingTranslations.itemB.language}
                            border={true}
                            size={1}
                        />
                    </Grid>
                }
            </Grid>
            {/* Words */}
            <Grid
                container={true}
                justifyContent={'flex-start'}
                alignItems={'center'}
                xs={true}
                // xs={'auto'}
                spacing={1}
                sx={{
                    paddingX: globalTheme.spacing(1),
                    marginLeft: globalTheme.spacing(1)
                }}
            >
                <Grid
                    item={true}
                    xs={12}
                    sm={true}
                >
                    <Typography
                        sx={{
                            typography: {
                                xs: 'body2',
                                md: 'body1',
                                xl: 'h6',
                            },
                        }}
                        // align={"left"} // END CHANGES
                    >
                        {props.originalExerciseData.matchingTranslations.itemA.value}
                    </Typography>
                </Grid>
                <Grid
                    item={true}
                    xs={12}
                    sm={true}
                >
                    <Typography
                        sx={{
                            typography: {
                                xs: 'body2',
                                md: 'body1',
                                xl: 'h6',
                            },
                        }}
                    >
                        {props.exerciseResult.answer}
                    </Typography>
                </Grid>
            </Grid>
            {/* Word Detail Chips */}
            {!(lessThanMd) &&
                <Grid
                    container={true}
                    // justifyContent={'center'}
                    justifyContent={'flex-end'}
                    alignItems={'center'}
                    xs={true}
                    // xs={'auto'}
                    sx={{
                        paddingX: globalTheme.spacing(1)
                    }}
                >
                    <Grid
                        item={true}
                        xs={'auto'}
                    >
                        <ChipListOfWordDetailsElements
                            relevantWordDescription={relevantWordDescriptionElements}
                            relevantPoS={props.originalExerciseData.partOfSpeech}
                            chipColor={'primary'}
                            translateFunction={
                            (access: string, count: number) => {
                                return(
                                    t(access, {ns: 'caseDescription', count: count, ordinal: true})
                                )
                            }}
                        />
                    </Grid>
                </Grid>
            }
            {/* Review Button */}
            <Grid
                container={true}
                justifyContent={'flex-end'}
                alignItems={'center'}
                xs={'auto'}
                sx={{
                    paddingX: globalTheme.spacing(1)
                }}
            >
                <Grid
                    item={true}
                    xs={'auto'}
                >
                    <Tooltip
                        // title={'Go to exercise'}
                        title={t("tooltips.goToExercise", {ns: 'practice'})}
                    >
                        <IconButton
                            color={'info'}
                            onClick={() => {
                                props.setCurrentCardIndex(props.index)
                            }}
                        >
                            <VisibilityIcon
                                sx={{
                                    height: '25px',
                                    width: '25px',
                                    verticalAlign: 'bottom'
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </Grid>
    )
}