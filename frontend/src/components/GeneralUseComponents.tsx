import {Lang} from "../ts/enums";
import React, {ReactNode} from "react";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import {FriendshipData, TagData} from "../ts/interfaces";
import {Chip, Grid, Typography} from "@mui/material";
import globalTheme from "../theme/theme";
import Avatar from "@mui/material/Avatar";
import {stringAvatar} from "./generalUseFunctions";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

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

    // TODO: separate chip, to include a small section at the end, with a different color, with number of words associated with it
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
                            label={((tag.words !== undefined) && (tag.words.length > 0)) ?tag.label + ' ('+(tag.words.length)+')' :tag.label}
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

type FriendListProps = {
    friendList: FriendshipData[],
    onClickAction: (friendshipItem: FriendshipData) => void,
    sxProps?: SxProps<Theme>,
    actionIcon?: ReactNode,
}

export const FriendList = (props: FriendListProps) => {

    return(
        <>
            {(props.friendList.map((friendshipItem: FriendshipData, index: number) => {
                return(
                    <Grid
                        container={true}
                        item={true}
                        xs={12}
                        key={index}
                        sx={{
                            background: (index % 2 === 0) ?"#c7c7c7" :undefined,
                            paddingY: globalTheme.spacing(1),
                            borderRight: '1px solid black',
                            borderLeft: '1px solid black',
                            borderTop: (index === 0) ?'1px solid black' :"none",
                            borderBottom: "1px solid black",
                            borderRadius: (index === 0)
                                ? "25px 25px 0 0"
                                : (index === (props.friendList.length -1))
                                    ? " 0 0 25px 25px"
                                    : undefined
                        }}
                    >
                        {/* AVATAR */}
                        <Grid
                            container={true}
                            item={true}
                            justifyContent={"center"}
                            xs={"auto"} // width: max-content
                            sx={{
                                paddingX: globalTheme.spacing(1),
                            }}
                        >
                            <Grid
                                item={true}
                            >
                                <Avatar
                                    alt="User photo"
                                    src={(index % 2 === 0) ? "" : "/"}
                                    color={"primary"}
                                    sx={{
                                        width: '45px',
                                        height: '45px',
                                        margin: globalTheme.spacing(1),
                                        bgcolor: "#0072CE",
                                        ...((stringAvatar((friendshipItem.usersData!!) ?friendshipItem.usersData![0].username :"-", "color")).sx),
                                    }}
                                    {...stringAvatar((friendshipItem.usersData!!) ?friendshipItem.usersData![0].username :"-", "children")}
                                />
                            </Grid>
                        </Grid>
                        {/* FRIEND'S NAME */}
                        <Grid
                            container={true}
                            alignItems={"center"}
                            item={true}
                            xs // width: all-available
                        >
                            <Grid
                                item={true}
                                sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}
                            >
                                <Typography
                                    sx={{
                                        typography: {
                                            xs: 'h5',
                                            sm: 'h4',
                                            md: 'h3',
                                        },
                                        textTransform: "capitalize",
                                        cursor: 'pointer',
                                    }}
                                    noWrap={true}
                                    onClick={() => {
                                        props.onClickAction(friendshipItem)
                                    }}
                                >
                                    {friendshipItem.usersData![0].username}
                                </Typography>
                            </Grid>
                        </Grid>
                        {/* ACTION BUTTON */}
                        <Grid
                            container={true}
                            alignItems={"center"}
                            item={true}
                            xs={"auto"} // width: max-content
                            sx={{
                                marginRight: globalTheme.spacing(2)
                            }}
                        >
                            <Grid
                                item={true}
                            >
                                <IconButton
                                    color={"primary"}
                                    onClick={() => {
                                        props.onClickAction(friendshipItem)
                                    }}
                                >
                                    {(props.actionIcon !== undefined)
                                        ? props.actionIcon
                                        : <ArrowForwardIosIcon/>
                                    }
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                )
            }))}
        </>
    )
}