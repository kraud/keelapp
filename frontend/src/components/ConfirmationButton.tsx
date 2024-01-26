import {Button, Grid} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import React, {useState} from "react";
import globalTheme from "../theme/theme";

interface ConfirmationButtonProps{
    // children: any
    onConfirm: () => void
    buttonProps: any,
    ignoreConfirmation?: boolean, // used in cases where confirmation is conditionally required
    buttonLabel: string,
    confirmationButtonLabel?: string,
    cancellationButtonLabel?: string,
}

// This component displays a button, which when clicked it switches to a confirmation-cancellation button
// If confirmed the function passed inside the props will be triggered
export const ConfirmationButton = (props: ConfirmationButtonProps) => {
    const [buttonWasClicked, setButtonWasClicked] = useState(false)
    return(
        <Grid
            container={true}
            justifyContent={"center"}
            item={true}
            xs={12}
        >
            {(buttonWasClicked && (!props.ignoreConfirmation!!))
                ?
                <Grid
                    container={true}
                    justifyContent={"center"}
                    item={true}
                    sx={{
                        border: '2px #666666 solid',
                        borderRadius: '10px',
                        backgroundColor: '#e1e1e1'
                    }}
                >
                    <Grid
                        item={true}
                        xs
                        sx={{
                            padding: globalTheme.spacing(1)
                        }}
                    >
                        <Button
                            variant={"contained"}
                            color={"secondary"}
                            onClick={() => {
                                props.onConfirm()
                                setButtonWasClicked(false)
                            }}
                            fullWidth={true}
                            endIcon={<CheckIcon />}
                        >
                            {(props.confirmationButtonLabel !== undefined) ?props.confirmationButtonLabel :'Confirm'}
                        </Button>
                    </Grid>
                    <Grid
                        item={true}
                        xs
                        sx={{
                            padding: globalTheme.spacing(1)
                        }}
                    >
                        <Button
                            variant={"contained"}
                            color={"error"}
                            onClick={() => {
                                setButtonWasClicked(false)
                            }}
                            fullWidth={true}
                            endIcon={<ClearIcon/>}
                        >
                            {(props.cancellationButtonLabel !== undefined) ?props.cancellationButtonLabel :'Cancel'}
                        </Button>
                    </Grid>
                </Grid>
                :
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => {
                        if(props.ignoreConfirmation!!){
                            props.onConfirm()
                        } else{
                            setButtonWasClicked(true)
                        }
                    }}
                    fullWidth={true}
                    {...props.buttonProps}
                >
                    {props.buttonLabel}
                </Button>
            }
        </Grid>
    )
}