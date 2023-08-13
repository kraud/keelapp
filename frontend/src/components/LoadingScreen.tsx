import {SpinningText} from "./SpinningText";
import React, {useEffect} from "react";
import {Theme, useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import globalTheme from "../theme/theme";
import {Grid} from "@mui/material";
import {SxProps} from "@mui/system";

interface LoadingScreenProps{
    loadingTextList: string[],
    loadingSubtitle?: string,
    callback: () => void,
    displayTime?: number,
    sxProps?: SxProps<Theme>,
}

export function LoadingScreen(props: LoadingScreenProps){
    const theme = useTheme()
    const lessThanSm = useMediaQuery(theme.breakpoints.down("sm"))
    const smallToMid = useMediaQuery(theme.breakpoints.between("sm", "md"))

    useEffect(() => {
        const timeout = setTimeout(() => {
            props.callback()
        }, (props.displayTime) ? props.displayTime : 1000)

        return () => clearTimeout(timeout)
    }, [])

    return(
        <Grid
            container={true}
            justifyContent={"center"}
            spacing={1}
            sx={{
                marginTop: globalTheme.spacing(4),
                ...props.sxProps
            }}
        >
            <Grid
                item={true}
            >
                <SpinningText
                    translations={props.loadingTextList}
                    variant={
                        (smallToMid)
                            ? 'h5'
                            : (lessThanSm)
                                ? 'h6'
                                :'h3' // lg and up
                    }
                    color={"primary"}
                    fastDisplay={true}
                    speedFunction={(x: number) => {
                        if(x !== 0){
                            return((((2)/(1+(2.718281828459045)^(x-4))))*0.7)
                        } else {
                            return 1
                        }
                    }}
                />
            </Grid>
        </Grid>
    )
}