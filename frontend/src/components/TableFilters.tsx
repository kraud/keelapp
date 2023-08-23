import {Chip, Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import {Lang, NounCases} from "../ts/enums";
import globalTheme from "../theme/theme";
import {FilterItem} from "../features/words/wordSlice";

interface TableFilterProps {
    filterOptions: FilterItem[],
    applyFilters: (filters: FilterItem[]) => void
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
            setSelectedFilters(selectedFilters.filter(filter => filter.id !== id))
        } else {
            const newSelectedFilter = props.filterOptions.find(filter => filter.id === id)
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
            if(filter.id === id){
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
        >
            <Grid
                container={true}
                item={true}
                // xs={"auto"}
                sx={{
                    border: '2px solid black',
                    borderRadius: '25px',
                    background: '#e1e1e1',
                    paddingLeft: globalTheme.spacing(2),
                    paddingRight: globalTheme.spacing(2),
                    paddingTop: globalTheme.spacing(1),
                    paddingBottom: globalTheme.spacing(1),
                    width: 'max-content',
                }}
                alignItems={"center"}
            >
                {(props.filterOptions).map((filter, index) => {
                    return(
                        <Grid
                            item={true}
                            key={index}
                            sx={{
                                margin: '5px',
                            }}
                        >
                            <Chip
                                variant={(isChipSelected(filter.id)) ?'filled' :"outlined"}
                                color={(isChipSelected(filter.id)) ?"success" :"error"}
                                onDelete={() => handleOnClick(filter.id)}
                                deleteIcon={(isChipSelected(filter.id)) ? <DoneIcon /> : <CloseIcon />}
                                label={filter.filterValue}
                                sx={{
                                    background: (isChipSelected(filter.id)) ?undefined :'white',
                                }}
                                // This limitation has been added to hide for now
                                // a bug with MongoDB and variable arrays using the $in operator
                                // see more at: https://stackoverflow.com/questions/22907451/nodejs-mongodb-in-array-not-working-if-array-is-a-variable
                                disabled={!(isChipSelected(filter.id)) && (selectedFilters.length>0)} // only 1 chip active at once
                            />
                        </Grid>
                    )
                })}
            </Grid>
        </Grid>
    )
}