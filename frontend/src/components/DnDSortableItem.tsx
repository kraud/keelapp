import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"
import {Button, Grid} from "@mui/material";
import React from "react";

interface DnDSortableItemProps{
    id: string,
    direction: "vertical" | "horizontal",
    index: number
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
        >
            <Button
                variant={"outlined"}
                color={"secondary"}
                onClick={() => null}
            >
                #{props.index + 1}: {props.id}
            </Button>
        </Grid>
    )
}