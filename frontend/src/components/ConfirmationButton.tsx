import {Button, Grid} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import React, {useState} from "react";
import globalTheme from "../theme/theme";

interface ConfirmationButtonProps{
    // children: any
    onConfirm: () => void
    buttonProps: any,
    buttonLabel: string,
}

// This component accepts a component (probably a button) as its children, and when clicked it displays a confirmation button
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
            {(buttonWasClicked)
                ?
                <Grid
                    container={true}
                    justifyContent={"center"}
                    item={true}
                    spacing={1}
                >
                    <Grid
                        item={true}
                        xs
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
                            Confirm
                        </Button>
                    </Grid>
                    <Grid
                        item={true}
                        xs
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
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
                :
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => setButtonWasClicked(true)}
                    fullWidth={true}
                    {...props.buttonProps}
                >
                    {props.buttonLabel}
                </Button>
            }
        </Grid>
    )
}