import {Lang} from "../ts/enums";
import React, {ReactNode} from "react";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import {FriendshipData, SearchResult, TagData} from "../ts/interfaces";
import {Chip, Grid, Typography} from "@mui/material";
import globalTheme from "../theme/theme";
import Avatar from "@mui/material/Avatar";
import {getOtherUserDataFromFriendship, stringAvatar} from "./generalUseFunctions";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {useSelector} from "react-redux";
import ConstructionIcon from "@mui/icons-material/Construction";
import LanguageOutlined from "@mui/icons-material/LanguageOutlined";
import HelpIcon from "@mui/icons-material/Help";
import {Flip, toast} from "react-toastify";
import Button from "@mui/material/Button";
import {ToastOptions} from "react-toastify/dist/types";

type BorderProps = {
    border?: boolean
}
type CountryFlagProps = {
    country: Lang,
    sxProps?: SxProps<Theme>,
    size?: (1 | 2 | 3 | 4),
} & BorderProps

const defaultProps = {
    size: 1 as unknown as 1
}

// See https://www.npmjs.com/package/country-flag-icons for more details
export const CountryFlag = (propsOriginal: CountryFlagProps) => {
    const props: any = {...defaultProps, ...propsOriginal}
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
    const defaultWidth: number = (props.border!) ?27 :25
    const defaultHeight: number = (props.border!) ?18 :17
    const defaultBorderWidth: number = 1
    const calculatedWidth: number = defaultWidth*(props.size)
    const calculatedHeight: number = defaultHeight*(props.size)
    const calculatedBorderWidth: number = defaultBorderWidth*(props.size)

    return(
        <Box
            component="div"
            sx={{
                width: `${calculatedWidth}px`,
                height: `${calculatedHeight}px`,
                fontSize: 0,
                marginTop: 0,
                marginBottom: 0,

                border: (props.border!) ? `${calculatedBorderWidth}px solid black` : undefined,
                borderRadius: (props.border) ?'20%' :undefined,

                ...props.sxProps!,
            }}
        >
            <img
                src={`${process.env.PUBLIC_URL}/${getCountryFlagURL(props.country)}`}
                style={{
                    marginTop: (props.size === 1) ?0 :'-1px',
                    marginBottom: 0,
                    borderRadius: '17%',
                }}
            />
        </Box>
    )
}

type ChipListProps = {
    itemList: TagData[] | SearchResult[],
    onClickAction: (tagId: string) => void,
    sxProps?: SxProps<Theme>,
    deletableItems?: boolean
}

export const ChipList = (props: ChipListProps) => {

    const getLabel = (item: TagData|SearchResult) => {
        //@ts-ignore
        if(item.words !== undefined){ // then is TagData => TODO: find a better way to typeof custom types
            //@ts-ignore
            if((item.words.length > 0)){
                //@ts-ignore
                return(item.label + ' ('+(item.words.length)+')')
            } else {
                return(item.label)
            }
        } else { // then is SearchResult
            //@ts-ignore
            switch (item.type!!) {
                case ('user'): {
                    return(item.label)
                }
                case ('tag'): {
                    return(item.label)
                }
                // TODO: as more types are needed, add them.
                // case ('word'): { // this case was implemented manually in TagDataForm => incorporate here eventually
                //
                // }
                default: {
                    return(item.label)
                }
            }
        }

    }

    const handleOnClick = (item: TagData|SearchResult) => {
        // TODO: unify TagData and SearchResult to _id and id matches?
        //@ts-ignore
        if(item._id !== undefined){ // then is TagData => TODO: find a better way to typeof custom types
            //@ts-ignore
            props.onClickAction(item._id)
        } else { // then is SearchResult
            // no action specified yet for onClick SearchResult
            //@ts-ignore
            props.onClickAction(item.id)
        }
    }

    const handleOnDelete = (item: TagData|SearchResult) => {
        // TODO: idem handleOnClick
        //@ts-ignore
        if(item._id !== undefined){ // then is TagData => TODO: idem handleOnClick
            // no action specified yet for onDelete TagData
        } else { // then is SearchResult
            // @ts-ignore
            props.onClickAction(item.id)
        }
    }

    // TODO: separate chip, to include a small section at the end, with a different color, with number of words associated with it
    return(
        <Grid
            container={true}
            spacing={1}
            justifyContent={"center"}
        >
            {(props.itemList.map((item: TagData|SearchResult, index: number) => {
                return (
                    <Grid
                        item={true}
                        key={index.toString() + '-' + getLabel(item)}
                    >
                        <Chip
                            variant="filled"
                            label={getLabel(item)}
                            color={"secondary"}
                            sx={{
                                maxWidth: "max-content",
                                ...props.sxProps
                            }}
                            onDelete={(props.deletableItems!!)
                                ? () => {
                                    handleOnDelete(item)
                                }
                                : undefined
                            }
                            onClick={() => {
                                handleOnClick(item)
                            }}
                        />
                    </Grid>
                )
            }))}
        </Grid>
    )
}

type FriendListProps = {
    friendList: FriendshipData[],
    onClickAction: (friendshipItem: FriendshipData) => void,
    sxProps?: SxProps<Theme>,
    actionIcon?: ReactNode,
    disableNameOnClick?: boolean,
    hideIcon?: boolean,
}

export const FriendList = (props: FriendListProps) => {
    const {user} = useSelector((state: any) => state.auth)

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
                                        ...((stringAvatar((friendshipItem.usersData!!) ?getOtherUserDataFromFriendship(friendshipItem, user._id).name :"-", "color")).sx),
                                    }}
                                    {...stringAvatar((friendshipItem.usersData!!) ?getOtherUserDataFromFriendship(friendshipItem, user._id).name :"-", "children")}
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
                                        // textTransform: "capitalize",
                                        cursor: (props.disableNameOnClick!!) ? undefined : 'pointer',
                                    }}
                                    noWrap={true}
                                    onClick={() => {
                                        if(!props.disableNameOnClick!!){
                                            props.onClickAction(friendshipItem)
                                        }
                                    }}
                                >
                                    {getOtherUserDataFromFriendship(friendshipItem, user._id).username}
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
                            {!(props.hideIcon!!) &&
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
                            }
                        </Grid>
                    </Grid>
                )
            }))}
        </>
    )
}

export const getIconByEnvironment = (sxProps: any) => {
    switch(process.env.REACT_APP_ENVIRONMENT_NAME){
        case('dev'): {
            return(
                <ConstructionIcon
                    sx={{
                        ...sxProps
                    }}
                />
            )
        }
        case('prod'): {
            return(
                <LanguageOutlined
                    sx={{
                        ...sxProps
                    }}
                />
            )
        }
        case('default'): {
            return(
                <HelpIcon
                    sx={{
                        ...sxProps
                    }}
                />
            )
        }
    }
}



interface ToastDetailsContent {
    description: string,
    buttonLabel: string,
    onClickButton: () => void,
    toastOptions?: ToastOptions,
    buttonSxProps?: SxProps,
    descriptionSxProps?: SxProps
}
export const triggerToastMessageWithButton = (toastDetails: ToastDetailsContent) => {
    toast(
        <Grid
            container={true}
            justifyContent={"center"}
        >
            <Grid
                item={true}
            >
                <Typography
                    variant={"subtitle2"}
                    textAlign={'center'}
                    sx={{
                        ...toastDetails.descriptionSxProps
                    }}
                >
                    {toastDetails.description}
                </Typography>
                <Button
                    variant={'contained'}
                    //@ts-ignore
                    color={'allWhite'}
                    fullWidth={true}
                    onClick={() => {
                        toastDetails.onClickButton()
                    }}
                    sx={{
                        marginTop: globalTheme.spacing(2),
                        ...toastDetails.buttonSxProps
                    }}
                >
                    {toastDetails.buttonLabel}
                </Button>
            </Grid>
        </Grid>,
        {
            type: 'error',
            autoClose: 5000,
            transition: Flip,
            delay: 500,
            ...toastDetails.toastOptions
        }
    )
}