import {Lang} from "../ts/enums";
import React from "react";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import {TagData} from "../ts/interfaces";
import {Chip, Grid} from "@mui/material";

type BorderProps = {
    border?: boolean
}
type CountryFlagProps = {
    country: Lang,
    sxProps?: SxProps<Theme>,
} & BorderProps

// See https://www.npmjs.com/package/country-flag-icons for more details
export const CountryFlag = (props: CountryFlagProps) => {
    function getCountryFlagURL(country: Lang){
        switch (country){
            case Lang.EN: {
                return("../../GB.svg")
            }
            case Lang.ES: {
                return("../../ES.svg")
            }
            case Lang.DE: {
                return("../../DE.svg")
            }
            case Lang.EE: {
                return("../../EE.svg")
            }
            default:
                return("../../AQ.svg")
        }
    }
    return(
        <Box
            component="div"
            sx={{
                width: (props.border!) ?'27px' :'25px',
                height: (props.border!) ?'18.6px' :'17px',
                fontSize: 0,
                marginTop: 0,
                marginBottom: 0,

                border: (props.border!) ? '1px solid black' : undefined,
                borderRadius: (props.border) ?'20%' :undefined,

                ...props.sxProps!,
            }}
        >
            <img
                src={`${process.env.PUBLIC_URL}/${getCountryFlagURL(props.country)}`}
                style={{
                    marginTop: 0,
                    marginBottom: 0,
                    borderRadius: '17%',
                }}
            />
        </Box>
    )
}

type TagChipListProps = {
    tagList: TagData[],
    onClickAction: (tagId: string) => void,
    sxProps?: SxProps<Theme>,
}

export const TagChipList = (props: TagChipListProps) => {

    return(
        <>
            {(props.tagList.map((tag: TagData, index: number) => {
                return (
                    <Grid
                        item={true}
                        key={index.toString() + '-' + tag}
                    >
                        <Chip
                            variant="filled"
                            label={tag.label}
                            color={"secondary"}
                            sx={{
                                maxWidth: "max-content",
                                ...props.sxProps
                            }}
                            onClick={() => {
                                props.onClickAction((tag._id !== undefined) ? tag._id : "")
                            }}
                        />
                    </Grid>
                )
            }))}
        </>
    )
}