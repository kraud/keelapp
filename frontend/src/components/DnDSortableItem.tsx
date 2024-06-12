import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"
import {Button, Grid} from "@mui/material";
import React from "react";
import globalTheme from "../theme/theme";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {CountryFlag} from "./GeneralUseComponents";
import {Lang} from "../ts/enums";

interface DnDSortableItemProps{
    id: string,
    direction: "vertical" | "horizontal",
    index?: number
    invisible?: boolean
    disableAll?: boolean
    sxProps?: SxProps<Theme>
    displayItems?: 'text' | 'flag' | 'both'
}

export function DnDSortableItem(props: DnDSortableItemProps){

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
                        {displayContentWithIndex("")}
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
                cursor: 'pointer',
                ...props.sxProps
            }}
        >
            {!(props.invisible === true) &&
                <Button
                    variant={"contained"}
                    color={"secondary"}
                    onClick={() => null}
                    disabled={props.disableAll!}
                >
                    {getDisplayElements()}
                </Button>
            }
        </Grid>
    )
}