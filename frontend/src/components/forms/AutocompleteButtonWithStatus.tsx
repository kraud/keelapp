import {Grid} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import React from "react";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

interface tooltipLabelStructure {
    emptyQuery: string,
    noMatch: string,
    foundMatch: string,
    partialMatch?: string,
}

interface AutocompleteButtonWithStatusProps {
    queryValue: string,
    tooltipLabels: tooltipLabelStructure,
    autocompleteResponse: any,
    loadingState: boolean,
    forceDisabled?: boolean,
    actionButtonLabel?: string,

    onAutocompleteClick: () => void
}

export const AutocompleteButtonWithStatus = (props: AutocompleteButtonWithStatusProps) => {

    return(
        <Grid
            container={true}
            item={true}
            spacing={1}
            xs={12}
            lg={6}
            xl={3}
        >
            <Grid
                item={true}
                xs={'auto'}
            >
                <Tooltip
                    title={
                        (props.queryValue!!)
                            ? (props.autocompleteResponse)
                                ? (props.tooltipLabels.partialMatch)
                                    ? props.tooltipLabels.partialMatch
                                    : props.tooltipLabels.foundMatch
                                : props.tooltipLabels.noMatch
                            : props.tooltipLabels.emptyQuery
                    }
                >
                    {getIconButton({
                        ...props
                    })}
                </Tooltip>
            </Grid>
            <Grid
                item={true}
                xs
            >
                <Button
                    variant={'contained'}
                    color={'primary'}
                    onClick={() => props.onAutocompleteClick()}
                    disabled={(
                        (!(props.queryValue !== ""))
                        ||
                        (
                            (props.queryValue !== "") && (props.autocompleteResponse === undefined)
                        )
                        ||
                        (props.loadingState)
                        ||
                        (props.forceDisabled)
                    )}
                    fullWidth={true}
                >
                    {(props.actionButtonLabel!!)
                        ? props.actionButtonLabel
                        : 'Autocomplete'
                    }
                </Button>
            </Grid>
        </Grid>
    )
}

interface getIconButtonProps {
    queryValue: string,
    autocompleteResponse: any,
    loadingState: boolean,
    tooltipLabels: tooltipLabelStructure,
}

const getIconButton = (props: getIconButtonProps) => {

    if((props.queryValue !== "") && !props.loadingState){
        if(props.tooltipLabels.partialMatch !== undefined){
            return(
                <Button
                    variant={'contained'}
                    color={'warning'}
                    sx={{
                        paddingX: '6px',
                        minWidth: 'max-content',
                        cursor: 'help',
                    }}
                >
                    <AutoFixHighIcon/>
                </Button>
            )
        } else if(props.autocompleteResponse !== undefined){
            return(
                <Button
                    variant={'contained'}
                    color={'success'}
                    sx={{
                        paddingX: '6px',
                        minWidth: 'max-content',
                        cursor: 'help',
                    }}
                    disableRipple={true}
                >
                    <DoneIcon/>
                </Button>
            )
        } else {
            return(
                <Button
                    variant={'contained'}
                    color={'error'}
                    sx={{
                        paddingX: '6px',
                        minWidth: 'max-content',
                        cursor: 'help',
                    }}
                    disableRipple={true}
                >
                    <CloseIcon/>
                </Button>
            )
        }
    } else {
        return(
            <Button
                variant={'contained'}
                color={'secondary'}
                sx={{
                    paddingX: '6px',
                    minWidth: 'max-content',
                    cursor: 'help',
                }}
                disableRipple={true}
            >
                <QuestionMarkIcon/>
            </Button>
        )
    }
}