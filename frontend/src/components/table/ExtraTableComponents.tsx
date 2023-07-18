import {Grid, Typography} from "@mui/material";
import React, {useState} from "react";
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
    sxProps?: SxProps<Theme>

    wordGender?: string
    displayWordGender?: boolean

    amount?: number
    displayAmount?: boolean
    onlyDisplayAmountOnHover?: boolean
}

export function TableDataCell(props: TableDataCellProps){
    const [isHovering, setIsHovering] = useState(false)

    if(props.content !== undefined){
        return(
            <Grid
                sx={{
                    paddingX: globalTheme.spacing(4),
                    paddingY: globalTheme.spacing(1),
                    ...props.sxProps
                }}
                onMouseOver={() => setIsHovering(true)}
                onTouchStart={() => setIsHovering(true)}
                onMouseOut={() => setIsHovering(false)}
                onTouchEnd={() => setIsHovering(false)}
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
                        {
                            (
                                (props.displayWordGender!) && (props.wordGender)
                            ) &&
                            props.wordGender
                        }
                        {" "}
                        {props.content}
                        {" "}
                        {
                            (
                                (
                                    props.displayAmount!
                                    ||
                                    (props.onlyDisplayAmountOnHover! && isHovering)
                                ) &&
                                (props.amount!)
                            ) &&
                            `(${props.amount})`
                        }
                    </Typography>
                }
            </Grid>
        )

    } else {
        return(<></>)
    }
}