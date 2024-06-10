import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"
import {Button, Grid} from "@mui/material";
import React from "react";
import globalTheme from "../theme/theme";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";

interface DnDSortableItemProps{
    id: string,
    direction: "vertical" | "horizontal",
    index?: number
    invisible?: boolean
    disableAll?: boolean
    sxProps?: SxProps<Theme>
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
                    {
                        (props.index !== undefined)
                            ? `#${props.index + 1}: ${props.id}` // TODO: add option to display text, flag or combo flag+text
                            : props.id
                    }
                </Button>
            }
        </Grid>
    )
}