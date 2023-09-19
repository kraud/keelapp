import {closestCenter, DndContext} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    horizontalListSortingStrategy, verticalListSortingStrategy
} from "@dnd-kit/sortable";
import React from "react";
import {DnDSortableItem} from "./DnDSortableItem";
import {Grid, Typography} from "@mui/material";
import {toast} from "react-toastify";
import globalTheme from "../theme/theme";

interface DnDLanguageOrderSelectorProps{
    allSelectedItems: string[],
    otherItems: string[],
    setAllSelectedItems: (items: string[]) => void
    setOtherItems: (items: string[]) => void
    direction: "vertical" | "horizontal"
    justifyContent?: "center" | "flex-end" | "flex-start"
}

export function DnDLanguageOrderSelector(props: DnDLanguageOrderSelectorProps) {
    const componentStyles = {
        sortableContextInnerContainer: {
            background: '#e1e1e1',
            padding: globalTheme.spacing(1),
            border: '2px solid black',
            borderRadius: '10px',
            marginX: globalTheme.spacing(2),
            marginTop: '0',
            marginLeft: '0',
            minWidth: '150px',
            minHeight: '56.5px',
        },
        containerLabel: {
            paddingLeft: globalTheme.spacing(1),
        }
    }

    function handleDragEnd(event: any) {
        const {active, over } = event

        if(active.id !== over.id){
            if(active.data.current.sortable.containerId !== over.data.current.sortable.containerId){  // BETWEEN DIFFERENT CONTAINERS
                if(over.data.current.sortable.containerId == "other"){ // destination is "other" container
                    if(props.allSelectedItems.length > 2) {
                        const activeIndex = props.allSelectedItems.indexOf(active.id) // original index of the item - we use it to remove it from the selected list
                        props.setOtherItems([...props.otherItems, (props.allSelectedItems[activeIndex])]) // order not important (yet)
                        let newSelected = [...props.allSelectedItems] // NB! Spreading this prop is NECESSARY for it to re-render the table.
                        newSelected.splice(activeIndex, 1) // remove 1 item at activeIndex from newSelected
                        props.setAllSelectedItems(newSelected)
                    } else {
                        toast.error("You can't have less than 2 languages displayed.", {
                            toastId: "always-2-lang",
                            autoClose: 2500,
                        })
                    }
                } else { // destination is "selected" container
                    const overIndex = props.allSelectedItems.indexOf(over.id) // index at which it's hovering at the selected container

                    const activeIndex = props.otherItems.indexOf(active.id) // index which the item used to be at inside "others"
                    let newOthers = props.otherItems
                    newOthers.splice(activeIndex, 1) // remove 1 item at activeIndex
                    props.setOtherItems(newOthers)

                    // NB! This will only run once, when item first comes into container. Any other movement afterwards
                    // is recognized as a "within-same-container-movement"
                    let updatedSelectedLanguages = [
                        ...props.allSelectedItems.slice(0, overIndex+1), // all items up to overIndex
                        active.id,
                        ...props.allSelectedItems.slice(overIndex + 1), // all the items after overIndex
                    ]
                    props.setAllSelectedItems(updatedSelectedLanguages)
                }
            } else { // WITHIN SAME CONTAINER MOVEMENT
                if(active.data.current.sortable.containerId == "selected"){ // inside movement at the "selected" container
                    const activeIndex = props.allSelectedItems.indexOf(active.id)
                    const overIndex = props.allSelectedItems.indexOf(over.id)
                    props.setAllSelectedItems(
                        arrayMove(props.allSelectedItems, activeIndex, overIndex)
                    )
                } else { // inside movement at the "other" container
                    const activeIndex = props.otherItems.indexOf(active.id)
                    const overIndex = props.otherItems.indexOf(over.id)
                    props.setOtherItems(
                        arrayMove(props.otherItems, activeIndex, overIndex)
                    )
                }
            }
        }
    }

    return(
        <Grid
            container={true}
            item={true}
            justifyContent={"center"}
        >
            <DndContext
                collisionDetection={closestCenter}
                // onDragEnd={handleDragEnd} // Works better to avoid too much re-rendering while dragging - but animations are not working
                onDragOver={handleDragEnd}
            >
                <Grid
                    container={true}
                    item={true}
                    direction={"column"}
                    sx={{
                        width: 'max-content'
                    }}
                >
                    <Grid
                        item={true}
                        sx={{
                            width: 'max-content'
                        }}
                    >
                        <Typography
                            variant={"subtitle2"}
                            color={'secondary'}
                            sx={componentStyles.containerLabel}
                        >
                            Active
                        </Typography>
                    </Grid>
                    <SortableContext
                        id={"selected"}
                        items={props.allSelectedItems}
                        strategy={props.direction === "horizontal" ? horizontalListSortingStrategy :verticalListSortingStrategy}
                    >
                        <Grid
                            item={true}
                            container={true}
                            xs={'auto'}
                            justifyContent={props.justifyContent}
                            sx={
                                componentStyles.sortableContextInnerContainer
                            }
                        >
                            {props.allSelectedItems.map((item: string, index: number) => {
                                return (
                                    <DnDSortableItem
                                        key={index}
                                        id={item}
                                        direction={props.direction}
                                        index={index}
                                    />
                                )
                            })}
                        </Grid>
                    </SortableContext>
                </Grid>
                <Grid
                    container={true}
                    item={true}
                    xs={'auto'}
                    direction={"column"}
                >
                    <Grid
                        item={true}
                    >
                        <Typography
                            variant={"subtitle2"}
                            color={'secondary'}
                            sx={componentStyles.containerLabel}
                        >
                            Hidden
                        </Typography>
                    </Grid>
                    <SortableContext
                        id={"other"}
                        items={props.otherItems}
                        strategy={props.direction === "horizontal" ? horizontalListSortingStrategy :verticalListSortingStrategy}
                    >
                        <Grid
                            item={true}
                            container={true}
                            xs={'auto'}
                            justifyContent={props.justifyContent}
                            sx={
                                componentStyles.sortableContextInnerContainer
                            }
                        >
                            {(props.otherItems.length === 0)
                                ?
                                    <DnDSortableItem
                                        invisible={true} // not be displayed - only to make SortableContext work properly
                                        id={'do-not-display'}
                                        direction={props.direction}
                                    />
                                :
                                    props.otherItems.map((item: string, index: number) => {
                                        return (
                                            <DnDSortableItem
                                                disableAll={true}
                                                key={index}
                                                id={item}
                                                direction={props.direction}
                                            />
                                        )
                                    })
                            }
                        </Grid>
                    </SortableContext>
                </Grid>
            </DndContext>
        </Grid>
    )
}