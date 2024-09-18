import {closestCenter, DndContext, KeyboardSensor, MouseSensor, useSensor, useSensors} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    rectSortingStrategy
} from "@dnd-kit/sortable";
import React from "react";
import {DnDSortableItem} from "./DnDSortableItem";
import {Grid, Typography} from "@mui/material";
import {toast} from "react-toastify";
import globalTheme from "../theme/theme";


// TODO: refactor props interface so it only requires otherItems/setOtherItems if singleContainer is not true
interface DnDLanguageOrderSelectorProps{
    selectedItemsTitle: string,
    otherItemsTitle?: string,
    allSelectedItems: string[],
    otherItems: string[],
    setAllSelectedItems: (items: string[]) => void
    setOtherItems: (items: string[]) => void
    direction: "vertical" | "horizontal"
    displayItems?: 'text' | 'flag' | 'both'
    hideIndex?: boolean,
    justifyContent?: "center" | "flex-end" | "flex-start"
    singleContainer?: boolean // by default, we have 2 containers ('selected' and 'other'). With this prop we can display only 'selected'
    disabled?: boolean // to avoid allowing the elements to be moved
    noItemsSelectedMessage?: string // when no items are selected, display this text in 'selected' container
    displayLeftActionButton?: { selectedItemLabel: string, onLeftActionButtonClick: (clickedItemLabel: string) => void}
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

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            // this prevents the handleDragEnd event to run, until we move the item 5px
            distance: 5,
        },
    })
    const keyboardSensor = useSensor(KeyboardSensor)
    const sensors = useSensors(mouseSensor, keyboardSensor)

    const sortingLogicBetweenDifferentContainers = (destinationContainer: 'selected'|'other', currentIndex: number, destinationIndex: number, itemId: string) => {
        switch(destinationContainer){
            case('selected'): {
                let newOthers = props.otherItems
                newOthers.splice(currentIndex, 1) // remove 1 item at activeIndex
                props.setOtherItems(newOthers)

                // NB! This will only run once, when item first comes into container. Any other movement afterward
                // is recognized as a "within-same-container-movement"
                let updatedSelectedLanguages = [
                    ...props.allSelectedItems.slice(0, destinationIndex+1), // all items up to destinationIndex
                    itemId,
                    ...props.allSelectedItems.slice(destinationIndex + 1), // all the items after destinationIndex
                ]
                props.setAllSelectedItems(updatedSelectedLanguages)
                break
            }
            case('other'): {
                if(props.allSelectedItems.length > 2) {
                    props.setOtherItems([...props.otherItems, (props.allSelectedItems[currentIndex])]) // order not important (yet)
                    let newSelected = [...props.allSelectedItems] // NB! Spreading this prop is NECESSARY for it to re-render the table.
                    newSelected.splice(currentIndex, 1) // remove 1 item at activeIndex from newSelected
                    props.setAllSelectedItems(newSelected)
                } else {
                    toast.error("You can't have less than 2 languages displayed.", {
                        toastId: "always-2-lang",
                        autoClose: 2500,
                    })
                }
                break
            }
            default: {
                toast.error("There was an error. Try again", {
                    toastId: "always-2-lang",
                    autoClose: 2500,
                })
            }
        }
    }

    function handleDragEnd(event: any) {
        const {active, over } = event

        if(!props.disabled!!){
            if(active.id !== over.id){
                if(active.data.current.sortable.containerId !== over.data.current.sortable.containerId){  // BETWEEN DIFFERENT CONTAINERS
                    const destinationContainer = (over.data.current.sortable.containerId == "other") ?'other' :'selected'
                    sortingLogicBetweenDifferentContainers(
                        destinationContainer,
                        (destinationContainer === 'selected')
                            ? (props.otherItems.indexOf(active.id)) // if destination is 'selected' => current location comes from 'other'
                            : (props.allSelectedItems.indexOf(active.id)), // if destination is 'other' => current location comes from 'selected'
                        (destinationContainer === 'selected')
                            ? (props.allSelectedItems.indexOf(over.id))
                            : 0, // this number won't be used when moving into 'other'. This is a placeholder.
                        active.id // language Id
                    )
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
    }

    const moveLanguageToOtherContainer = (languageId: string, destinationContainer: 'selected' | 'other') => {
        sortingLogicBetweenDifferentContainers(
            destinationContainer,
            (destinationContainer === 'selected')
                ? (props.otherItems.indexOf(languageId))
                : (props.allSelectedItems.indexOf(languageId)),
            (destinationContainer === 'selected')
                // new language will be added to the end of the list by default
                ? (props.allSelectedItems.length)
                : (props.otherItems.length),
            languageId
        )
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
                sensors={sensors} // NB! Sensors are required to delay onDragOver trigger, so we can run 'onClick' inside DnDSortableItem
            >
                <Grid
                    container={true}
                    item={true}
                    direction={"column"}
                    // xs // NB! This makes both columns be displayed side by side
                    sx={{
                        // width: 'max-content'
                    }}
                >
                    {(props.selectedItemsTitle !== "") &&
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
                                {props.selectedItemsTitle}
                            </Typography>
                        </Grid>
                    }
                    <SortableContext
                        id={"selected"}
                        items={props.allSelectedItems}
                        strategy={rectSortingStrategy}
                        disabled={props.disabled}
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
                            {(props.allSelectedItems.length === 0)
                                ?
                                <>
                                    {((props.disabled) && (props.noItemsSelectedMessage!!)) &&
                                        <Typography
                                            variant={'h6'}
                                            sx={{
                                                userSelect: 'none',
                                                color: '#414141',
                                                fontStyle: 'italic',
                                            }}
                                        >
                                            {props.noItemsSelectedMessage}
                                        </Typography>
                                    }
                                    <DnDSortableItem
                                        invisible={true} // not be displayed - only to make SortableContext work properly
                                        id={'do-not-display'}
                                        direction={props.direction}
                                        containerLabel={'selected'}
                                        onActionButtonClick={() => null} //NB! This item should have no action
                                    />
                                </>
                                :
                                (
                                    props.allSelectedItems.map((item: string, index: number) => {
                                        return (
                                            <DnDSortableItem
                                                key={index}
                                                id={item}
                                                containerLabel={'selected'}
                                                direction={props.direction}
                                                displayItems={props.displayItems}
                                                disabled={props.disabled}
                                                index={index}
                                                hideIndex={props.hideIndex}
                                                sxProps={(index === (props.allSelectedItems.length -1))
                                                    ?
                                                        {
                                                            paddingRight: '0px',
                                                        }
                                                    : undefined
                                                }
                                                onActionButtonClick={(languageId: string) => {
                                                    moveLanguageToOtherContainer(languageId, 'other')
                                                }}
                                                displayLeftActionButton={item === props.displayLeftActionButton?.selectedItemLabel}
                                                onActionButtonLeftClick={
                                                    (props.displayLeftActionButton !== undefined)
                                                        ? (clickedItemLabel: string) => props.displayLeftActionButton?.onLeftActionButtonClick(clickedItemLabel)
                                                        : undefined
                                                }
                                            />
                                        )
                                    })
                                )
                            }
                        </Grid>
                    </SortableContext>
                </Grid>
                {!(props.singleContainer!!) &&
                    <Grid
                        container={true}
                        item={true}
                        // xs={'auto'}
                        xs
                        direction={"column"}
                    >
                        {(props.otherItemsTitle!!) &&
                            <Grid
                                item={true}
                            >
                                <Typography
                                    variant={"subtitle2"}
                                    color={'secondary'}
                                    sx={componentStyles.containerLabel}
                                >
                                    {props.otherItemsTitle}
                                </Typography>
                            </Grid>
                        }
                        <SortableContext
                            id={"other"}
                            items={props.otherItems}
                            strategy={rectSortingStrategy}
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
                                            containerLabel={'other'}
                                            direction={props.direction}
                                            disabled={props.disabled}
                                            onActionButtonClick={() => null} //NB! This item should have no action
                                        />
                                    :
                                        props.otherItems.map((item: string, index: number) => {
                                            return (
                                                <DnDSortableItem
                                                    disabled={props.disabled}
                                                    key={index}
                                                    containerLabel={'other'}
                                                    id={item}
                                                    direction={props.direction}
                                                    displayItems={props.displayItems}
                                                    onActionButtonClick={(languageId: string) => {
                                                        moveLanguageToOtherContainer(languageId, 'selected')
                                                    }}
                                                    displayLeftActionButton={item === props.displayLeftActionButton?.selectedItemLabel}
                                                    onActionButtonLeftClick={
                                                        (props.displayLeftActionButton !== undefined)
                                                            ? (clickedItemLabel: string) => props.displayLeftActionButton?.onLeftActionButtonClick(clickedItemLabel)
                                                            : undefined
                                                    }
                                                />
                                            )
                                        })
                                }
                            </Grid>
                        </SortableContext>
                    </Grid>
                }
            </DndContext>
        </Grid>
    )
}