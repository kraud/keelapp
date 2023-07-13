import {Grid, Typography} from "@mui/material";
import React from "react";

interface TableHeaderCellProps {
    content: any
}

export function TableHeaderCell(props: TableHeaderCellProps){

    return(
        <Grid
            sx={{
                padding: '5px',
            }}
        >
            <Typography
                variant={'subtitle1'}
                fontWeight={"bold"}
            >
                {props.content}
            </Typography>
        </Grid>
    )
}