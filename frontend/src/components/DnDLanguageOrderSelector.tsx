import {Lang} from "../ts/enums";
import {useState} from "react";
import {closestCenter, DndContext} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import React from "react";
import {DnDSortableItem} from "./DnDSortableItem";
import {Grid} from "@mui/material";

interface DnDLanguageOrderSelectorProps{

}

export function DnDLanguageOrderSelector(props: DnDLanguageOrderSelectorProps) {
    const [allLanguages, setAllLanguages] = useState<string[]>((Object.values(Lang).filter((v) => isNaN(Number(v))) as unknown as Array<keyof typeof Lang>))

    function handleDragEnd(event: any) {
        const {active, over } = event

        if(active.id !== over.id){
            setAllLanguages( (items: string[]) => {
                const activeIndex = items.indexOf(active.id)
                const overIndex = items.indexOf(over.id)

                return(
                    arrayMove(items, activeIndex, overIndex)
                )
            })
        }
    }

    return(
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={allLanguages}
                strategy={verticalListSortingStrategy}
            >
                <Grid
                    item={true}
                    container={true}
                    spacing={2}
                >
                    {(allLanguages.map((language: string, index: number) => <DnDSortableItem key={index} id={language}/>))}
                </Grid>
            </SortableContext>

        </DndContext>
    )
}