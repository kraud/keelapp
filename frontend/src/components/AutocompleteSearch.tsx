import {Autocomplete, CircularProgress, Grid, InputAdornment, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {SearchResults} from "../ts/interfaces";
import {searchWordByAnyTranslation} from "../features/words/wordSlice";
import {useDispatch, useSelector} from "react-redux";
import {ImportContacts} from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import globalTheme from "../theme/theme";
import {CountryFlag} from "./GeneralUseComponents";

interface AutocompleteSearchProps {

}

export const AutocompleteSearch = (props: AutocompleteSearchProps) => {
    const [value, setValue] = useState<SearchResults|null>(null)
    const [inputValue, setInputValue] = useState<string>('')
    const [options, setOptions] = useState<SearchResults[]>([])
    const [open, setOpen] = useState(false)
    const [loadingLocal, setLoadingLocal] = useState(false)
    const dispatch = useDispatch()
    const {searchResults, isLoading} = useSelector((state: any) => state.words)

    // if we simply depend on isLoading, the text on the first option reads "no matches" for a second, before "Loading.."
    useEffect(() => {
        if(!isLoading && loadingLocal){ // only valid once isLoading catches up with loadingLocal, and then finishes
            setLoadingLocal(false)
        } else {
            if(isLoading){
                setOptions([])
            }
        }
    }, [isLoading])

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
        }, 400)

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
            open={open}
            forcePopupIcon={false}
            clearIcon={<ClearIcon />}
            sx={{ width: 300 }}
            getOptionLabel={(option: SearchResults) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(x: any) => x} // necessary to implement filter on server
            options={(loadingLocal || isLoading) ?[] :options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            noOptionsText={(loadingLocal || isLoading) ?"Loading..." :"No matches"}
            onChange={(event: any, newValue: SearchResults | null) => {
                setValue(newValue)
            }}
            // TODO: define desired behaviour - should it display "Loading..." after every change?
            //  Better to display last results (as it is now)?
            onInputChange={(event, newInputValue) => {
                if (newInputValue.length === 0) {
                    if (open) {
                        setOpen(false)
                    }
                } else {
                    if (!open) {
                        setLoadingLocal(true)
                        setOpen(true)
                    }
                }
                setInputValue(newInputValue)
            }}
            renderInput={(params) => {
                return (
                    <TextField
                        {...params}
                        InputProps={{
                            ...params.InputProps,
                            sx: ({color: 'white'}),
                            endAdornment: (
                                    <InputAdornment
                                        position="end"
                                        sx={{
                                            width: '20px',
                                            height: '20px',
                                            marginRight: '15px',
                                            "& .MuiCircularProgress-root": {
                                                animation: 'none',
                                                height: '20px !important',
                                            },
                                        }}
                                    >
                                        {(loadingLocal || isLoading)
                                            //@ts-ignore
                                            ? <CircularProgress color={"allWhite"}/>
                                            //@ts-ignore
                                            : <SearchIcon color={'allWhite'}/>
                                        }
                                    </InputAdornment>
                            )
                        }}
                        placeholder={"Search..."}
                        fullWidth
                        sx={{
                            '& .MuiAutocomplete-inputRoot': {
                                // background: 'white',
                                borderBottom: '2px white solid',
                                "& ::placeholder": {
                                    color: "white",
                                    opacity: 1,
                                },
                            }
                        }}
                        variant="standard"
                    />
                )
            }}
            renderOption={(props, option) => {
                return (
                    <li
                        //@ts-ignore
                        key={props['data-option-index'] as number}
                        style={{
                            // marginTop: 0,
                            // marginBottom: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                            paddingLeft: 0,
                            paddingRight: 0,
                        }}
                        {...props}
                    >
                        <Grid
                            container={true}
                            alignItems={"center"}
                            sx={{
                                //@ts-ignore
                                background: (props['data-option-index'] %2 == 0) ?'rgba(199,199,199,.55)' :'white',
                                paddingTop: '5px',
                                paddingBottom: '5px',
                                paddingLeft: '10px',
                            }}
                        >
                            <Grid
                                item={true}
                            >
                                <CountryFlag
                                    country={option.language}
                                    border={true}
                                />
                            </Grid>
                            <Grid
                                item={true}
                                sx={{
                                    wordWrap: 'break-word',
                                    marginLeft: globalTheme.spacing(2),
                            }}
                            >
                                <Typography
                                    variant={'h6'}
                                    color={'primary'}
                                    alignSelf={"center"}
                                    sx={{
                                        display: 'inline',
                                    }}
                                >
                                    {option.label}
                                </Typography>
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
        />
    )
}