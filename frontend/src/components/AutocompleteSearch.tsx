import {Autocomplete, Grid, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {SearchResults} from "../ts/interfaces";
import {searchWordByAnyTranslation} from "../features/words/wordSlice";
import {useDispatch, useSelector} from "react-redux";

interface AutocompleteSearchProps {

}

export const AutocompleteSearch = (props: AutocompleteSearchProps) => {
    const [value, setValue] = useState<SearchResults|null>(null)
    const [inputValue, setInputValue] = useState<string>('')
    const [options, setOptions] = useState<SearchResults[]>([])
    const dispatch = useDispatch()
    const {searchResults} = useSelector((state: any) => state.words)


    // this triggers when we type something on the search field
    useEffect(() => {
        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }
        const timeout = setTimeout(() => {
            // dispatch search for inputValue and when results are updated, set them in options
            // @ts-ignore
            dispatch(searchWordByAnyTranslation(inputValue))
        }, 600)

        return () => clearTimeout(timeout)
    }, [inputValue])

    useEffect(() => {
        setOptions(searchResults)
    },[searchResults])

    // this triggers once we select something from the list
    useEffect(() => {
        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }
        // dispatch getById with data from selected value and when results are updated, we load them and change screen
        return () => {
        }
    }, [value])

    return(
        <Autocomplete
            sx={{ width: 300 }}
            getOptionLabel={(option: SearchResults) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(x: any) => x} // necessary to implement filter on server
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            noOptionsText="No matches"
            onChange={(event: any, newValue: SearchResults | null) => {
                setValue(newValue)
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue)
            }}
            renderInput={(params) => {
                return (
                    <TextField
                        {...params}
                        label="Search..."
                        fullWidth
                        sx={{
                            '& .MuiAutocomplete-inputRoot': {
                                // background: 'white',
                                borderBottom: '1px white solid'
                            }
                        }}
                        size={"small"}
                        variant="standard"
                    />
                )
            }}
            renderOption={(props, option) => {
                return (
                    <li {...props}>
                        <Grid container alignItems="center">
                            <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                <Typography
                                    variant={'subtitle2'}
                                    color={'primary'}
                                >
                                    {option.language} - {option.label}
                                </Typography>
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
        />
    )
}