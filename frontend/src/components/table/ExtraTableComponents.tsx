import {Grid, Typography} from "@mui/material";
import React from "react";
import globalTheme from "../../theme/theme";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";

interface TableHeaderCellProps {
    content: any
    sxProps?: SxProps<Theme>
}

export function TableHeaderCell(props: TableHeaderCellProps){
    return(
        <Grid
            sx={{
                padding: '10px 25px',
                margin: '10px',
                marginBottom: 0,
                border: "1px solid black",
                borderRadius: "25px",
                cursor: 'pointer',
                ...props.sxProps
            }}
        >
            <Typography
                variant={'h6'}
                fontWeight={"bold"}
            >
                {props.content}
            </Typography>
        </Grid>
    )
}
interface TableDataCellProps {
    content: any
    type: "number" | "text" | "other"
    textAlign?: 'center' | 'inherit' | 'justify' | 'left' | 'right'
}

export function TableDataCell(props: TableDataCellProps){
    if(props.content !== undefined){
        return(
            <Grid
                sx={{
                    paddingX: globalTheme.spacing(4),
                    paddingY: globalTheme.spacing(1),
                }}
            >
                {(props.type === "other")
                    ?
                    props.content // i.e: button icon
                    :
                    <Typography
                        variant={'subtitle1'}
                        textAlign={
                            (props.textAlign !== undefined)
                                ? props.textAlign
                                : (props.type === "number")
                                    ? "right"
                                    : "left"
                        }
                        fontWeight={500}
                    >
                        {props.content}
                    </Typography>
                }
            </Grid>
        )

    } else {
        return(<></>)
    }
}