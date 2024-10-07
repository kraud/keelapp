import {Chip, Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import globalTheme from "../theme/theme";
import {FilterItem} from "../ts/interfaces";

interface TableFilterProps {
    filterOptions: FilterItem[],
    applyFilters: (filters: FilterItem[]) => void
    singleSelection?: boolean
}

export function TableFilters(props: TableFilterProps) {
    const [selectedFilters, setSelectedFilters] = useState<FilterItem[]>([])

    const sanitizeFilters = () => {
        // TODO: should we check if any filters need cleanup/restructure before sending?
        // we used to clean up data here, but we cleaned up differences in types/interfaces
        return selectedFilters
    }

    const handleOnClick = (id: string) => {
        if(isChipSelected(id)){
            // if we click again on a selected filter, it is removed from the currently active ones for this category
            setSelectedFilters(selectedFilters.filter(filter => filter._id !== id))
        } else {
            // if we click on a filter, it is added to this category
            const newSelectedFilter = props.filterOptions.find(filter => filter._id === id)
            if(newSelectedFilter!!){
                setSelectedFilters([
                    ...selectedFilters,
                    newSelectedFilter
                ])
            }
        }
    }

    const isChipSelected = (id: string) => {
        let isSelected = false
        selectedFilters.forEach((filter) => {
            if(filter._id === id){
                isSelected = true
            }
        })
        return isSelected
    }

    useEffect(() => {
        props.applyFilters(sanitizeFilters())
    }, [selectedFilters])

    return(
        <Grid
            container={true}
            item={true}
            justifyContent={"center"}
            xs={12}
            sx={{
                // minWidth: '100%',
                // maxWidth: '100%',
                // width: '100%',
            }}
        >
            <Grid
                container={true}
                item={true}
                xs={12}
                sx={{
                    border: '2px solid black',
                    borderRadius: '10px',
                    background: '#e1e1e1',
                    paddingLeft: globalTheme.spacing(1),
                    paddingRight: globalTheme.spacing(1),
                    paddingTop: globalTheme.spacing(1),
                    paddingBottom: globalTheme.spacing(1),
                    // minWidth: '100%',
                    // maxWidth: '100%',
                    // width: '100%',
                }}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                {(props.filterOptions).map((filter, index) => {
                    return(
                        <Grid
                            item={true}
                            key={index}
                            sx={{
                                margin: '5px',
                            }}
                            xs={'auto'}
                        >
                            <Chip
                                variant={(isChipSelected(filter._id)) ?'filled' :"outlined"}
                                color={(isChipSelected(filter._id)) ?"success" :"error"}
                                onDelete={() => handleOnClick(filter._id)}
                                deleteIcon={(isChipSelected(filter._id)) ? <CloseIcon /> : <AddIcon />}
                                label={filter.filterValue}
                                sx={{
                                    background: (isChipSelected(filter._id)) ?undefined :'white',
                                }}
                                disabled={(props.singleSelection!!)
                                    ? !(isChipSelected(filter._id)) && (selectedFilters.length>0)
                                    : false
                                } // only 1 chip active at once
                            />
                        </Grid>
                    )
                })}
            </Grid>
        </Grid>
    )
}