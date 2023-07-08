import {closestCenter, DndContext} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    horizontalListSortingStrategy, verticalListSortingStrategy
} from "@dnd-kit/sortable";
import React from "react";
import {DnDSortableItem} from "./DnDSortableItem";
import {Grid} from "@mui/material";

interface DnDLanguageOrderSelectorProps{
    allItems: string[],
    setAllItems: (items: string[]) => void
    direction: "vertical" | "horizontal"
    justifyContent?: "center" | "flex-end" | "flex-start"
}

export function DnDLanguageOrderSelector(props: DnDLanguageOrderSelectorProps) {

    function handleDragEnd(event: any) {
        const {active, over } = event

        if(active.id !== over.id){
            const activeIndex = props.allItems.indexOf(active.id)
            const overIndex = props.allItems.indexOf(over.id)

            props.setAllItems(
                arrayMove(props.allItems, activeIndex, overIndex)
            )
            }
    }

    return(
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={props.allItems}
                strategy={props.direction === "horizontal" ? horizontalListSortingStrategy :verticalListSortingStrategy}
            >
                <Grid
                    item={true}
                    container={true}
                    spacing={2}
                    justifyContent={props.justifyContent}
                >
                    {props.allItems.map((item: string, index: number) => {
                        return (
                            <DnDSortableItem
                                key={item}
                                id={item}
                                direction={props.direction}
                                index={index}
                            />
                        )
                    })}
                </Grid>
            </SortableContext>

        </DndContext>
    )
}