import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"
import {Button, Grid} from "@mui/material";
import React from "react";

interface DnDSortableItemProps{
    id: string
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
        transition
    }

    return(
        <Grid
            item={true}
            container={true}
            ref={setNodeRef}
            style={{...style, width: '100%'}}
            {...attributes}
            {...listeners}
        >
            <Button
                variant={"outlined"}
                color={"secondary"}
                onClick={() => null}
            >
                {props.id}
            </Button>
        </Grid>
    )
}