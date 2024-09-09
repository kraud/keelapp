import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"
import {Button, Grid} from "@mui/material";
import React from "react";
import globalTheme from "../theme/theme";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {CountryFlag} from "./GeneralUseComponents";
import {Lang} from "../ts/enums";
import TranslateIcon from '@mui/icons-material/Translate';

interface DnDSortableItemProps{
    id: string,
    direction: "vertical" | "horizontal",
    containerLabel: 'selected' | 'other'
    index?: number
    invisible?: boolean
    disabled?: boolean
    sxProps?: SxProps<Theme>
    displayItems?: 'text' | 'flag' | 'both',
    onActionButtonClick: (itemId: string) => void
    // for selecting UI language
    displayLeftActionButton?: boolean
    onActionButtonLeftClick?: (itemId: string) => void
}

export function DnDSortableItem(props: DnDSortableItemProps){
    const componentStyles = {
        descriptionButton: {
            borderRadius: ((props.disabled!!) && !(props.displayLeftActionButton))
                ? '5px' // disabled and NOT marked => no action buttons displayed => corner radius all corners
                : (props.displayLeftActionButton)
                    ? (props.disabled!!)
                        ? '0px 5px 5px 0px' // disabled AND marked => only display squared corners on left
                        : ((props.onActionButtonLeftClick!!))
                            ? '0px' // not disabled AND NOT marked, BUT with an onClick function available => icons on both sides (all right corners)
                            : '5px 0px 0px 5px' // NOT disabled and NOT marked, and with no onClick functions for marking => only button on right side (only right corners on right side)
                    : (((props.onActionButtonLeftClick!!)))
                        ? '0px' // not disabled AND NOT marked AND possible to mark => icons on both sides (all right corners)
                        : '5px 0px 0px 5px', // not disabled AND NOT marked AND NOT possible to mark => icon on right sides (right corners on right side only)
            marginRight: '1px',
            "&.Mui-disabled": {
                background: "#0072CE",
                color: "#fff"
            },
            cursor: (props.disabled!!) ?'default' :'move',
            minHeight: '36.5px'
        },
        actionButtonRight: {
            borderRadius: '0px 5px 5px 0px',
            minWidth: '21px',
            paddingRight: '1px',
            paddingLeft: '1px',
            background: (props.containerLabel === 'selected') ?globalTheme.palette.error.main :globalTheme.palette.success.main,
            color: "#fff"
        },
        actionButtonLeft: {
            borderRadius: '5px 0px 0px 5px',
            minWidth: '21px',
            paddingRight: '4px',
            paddingLeft: '4px',
            marginRight: '2px',
            background: (props.displayLeftActionButton!!) ?globalTheme.palette.secondary.main :globalTheme.palette.warning.main,
            // background: (props.containerLabel === 'selected') ?globalTheme.palette.error.main :globalTheme.palette.success.main,
            color: "#fff"
        },
    }

    const {
        attributes,
        listeners,
        setNodeRef,
        transition,
        transform
    } = useSortable({id: props.id})

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition
    }

    const getDisplayElements = () => {
        const displayContentWithIndex = (displayItem: any) => {
            return(
                (props.index !== undefined)
                    ? `#${props.index + 1}: ${displayItem}`
                    : displayItem
            )
        }

        switch(props.displayItems){
            case('text'): {
                return(displayContentWithIndex(props.id))
            }
            case('flag'): {
                return(
                    <>
                        {/* NB! We still want to display the '#' symbol and index number, but with no language label */}
                        {displayContentWithIndex("")}
                        <CountryFlag
                            country={props.id as Lang}
                            border={true}
                            sxProps={{
                                 // NB! When NOT displaying '#' and index number, we don't need empty space on the left
                                marginLeft: (props.index !== undefined) ?'10px' :'0px',
                            }}
                        />
                    </>
                )
            }
            case('both'): {
                return(
                    <>
                        {displayContentWithIndex(props.id)}
                        <CountryFlag
                            country={props.id as Lang}
                            border={true}
                            sxProps={{
                                marginLeft: '10px',
                            }}
                        />
                    </>
                )
            }
            default: {
                return(
                    (props.index !== undefined)
                        ? `#${props.index + 1}: ${props.id}`
                        : props.id
                )
            }
        }
    }

    return(
        <Grid
            item={true}
            container={props.direction === "vertical"}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            sx={{
                touchAction: 'none', // to avoid lag on touch devices and Chrome DevTools
                paddingRight: globalTheme.spacing(1),
                paddingTop: globalTheme.spacing(1),
                paddingBottom: globalTheme.spacing(1),
                ...props.sxProps
            }}
        >
            {/*
                NB! This prop is only used when displaying an empty list in the container.
                We need at least one element (even if invisible), to "hold" some room,
                so when we drag a new item, the container has a "space" to drop the item into.
            */}
            {!(props.invisible!!) &&
                <>
                    {((props.displayLeftActionButton!) || ((props.onActionButtonLeftClick !== undefined) && (!(props.disabled!)))) &&
                        <Button
                            variant={"contained"}
                            color={"success"}
                            onClick={() => {
                                if(props.onActionButtonLeftClick !== undefined){
                                    props.onActionButtonLeftClick(props.id)
                                }
                            }}
                            disabled={props.disabled!}
                            sx={componentStyles.actionButtonLeft}
                        >
                            <TranslateIcon
                                sx={{
                                    width: '20px'
                                }}
                            />
                        </Button>
                    }
                    <Button
                        variant={"contained"}
                        color={"info"}
                        onClick={(e: any) => null}
                        disabled={props.disabled!}
                        sx={componentStyles.descriptionButton}
                    >
                        {getDisplayElements()}
                    </Button>
                    {!(props.disabled!) &&
                        <Button
                            variant={"contained"}
                            color={"info"}
                            onClick={() => {
                                props.onActionButtonClick(props.id)
                            }}
                            disabled={props.disabled!}
                            sx={componentStyles.actionButtonRight}
                        >
                            {(props.containerLabel === 'selected') ?'-' :'+'}
                        </Button>
                    }
                </>
            }
        </Grid>
    )
}