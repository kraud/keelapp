import {Chip, Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import {Lang, NounCases} from "../ts/enums";
import globalTheme from "../theme/theme";

export interface FilterData {
    id: number,
    label: string,
    caseName: NounCases,
    language: Lang,
}

interface TableFilterProps {
    applyFilters: (filters: any[]) => void
}

export function TableFilters(props: TableFilterProps) {
    const [selectedFilters, setSelectedFilters] = useState<FilterData[]>([])
    const allFilters: FilterData[] = [
        {
            id: 1,
            label: 'der',
            caseName: NounCases.genderDE,
            language: Lang.DE,
        },
        {
            id: 2,
            label: 'die',
            caseName: NounCases.genderDE,
            language: Lang.DE,
        },
        {
            id: 3,
            label: 'das',
            caseName: NounCases.genderDE,
            language: Lang.DE,
        },
        {
            id: 4,
            label: 'el',
            caseName: NounCases.genderES,
            language: Lang.ES,
        },
        {
            id: 5,
            label: 'la',
            caseName: NounCases.genderES,
            language: Lang.ES,
        }
    ]

    const sanitizeFilters = () => {
        return selectedFilters.map((filter) => {
            return({
                type: 'case',
                filterValue: filter.label,
                caseName: filter.caseName,
                language: filter.language,
            })
        })
    }

    const handleOnClick = (id: number) => {
        if(isChipSelected(id)){
            setSelectedFilters(selectedFilters.filter(filter => filter.id !== id))
        } else {
            const newSelectedFilter = allFilters.find(filter => filter.id === id)
            if(newSelectedFilter!!){
                setSelectedFilters([
                    ...selectedFilters,
                    newSelectedFilter
                ])
            }
        }
    }

    const isChipSelected = (id: number) => {
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
                {(allFilters).map((filter, index) => {
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
                                label={filter.label}
                                sx={{
                                    background: (isChipSelected(filter.id)) ?undefined :'white',
                                }}
                            />
                        </Grid>
                    )
                })}
            </Grid>
        </Grid>
    )
}