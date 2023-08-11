import {Autocomplete, CircularProgress, Grid, InputAdornment, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {SearchResults} from "../ts/interfaces";
import {searchWordByAnyTranslation} from "../features/words/wordSlice";
import {useDispatch, useSelector} from "react-redux";
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import globalTheme from "../theme/theme";
import {CountryFlag} from "./GeneralUseComponents";
import {useNavigate} from "react-router-dom";

interface AutocompleteSearchProps {

}

export const AutocompleteSearch = (props: AutocompleteSearchProps) => {
    const navigate = useNavigate()
    const [value, setValue] = useState<SearchResults|null>(null)
    const [inputValue, setInputValue] = useState<string>('')
    const [options, setOptions] = useState<SearchResults[]>([])
    const [open, setOpen] = useState(false)
    const [loadingLocal, setLoadingLocal] = useState(false)
    const dispatch = useDispatch()
    const {searchResults, isSearchLoading} = useSelector((state: any) => state.words)

    // if we simply depend on isLoading, the text on the first option reads "no matches" for a second, before "Loading.."
    useEffect(() => {
        if(!isSearchLoading && loadingLocal){ // only valid once isLoading catches up with loadingLocal, and then finishes
            setLoadingLocal(false)
        } else {
            if(isSearchLoading){
                setOptions([])
            }
        }
    }, [isSearchLoading])

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
        if(value !== null){
            navigate(`/word/${value.id}`) // should we somehow check if value.id is something valid?
            setOpen(false)
            setValue(null)
        }
    }, [value])

    return(
        <Autocomplete
            open={open}
            forcePopupIcon={false}
            clearIcon={<ClearIcon />}
            sx={{ width: 250 }}
            getOptionLabel={(option: SearchResults) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(x: any) => x} // necessary to implement filter on server
            options={(loadingLocal || isSearchLoading) ?[] :options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            noOptionsText={(loadingLocal || isSearchLoading) ?"Loading..." :"No matches"}
            onChange={(event: any, newValue: SearchResults | null) => {
                setValue(newValue)
                // if(newValue !== null){
                //     navigate(`/word/${newValue.id}`)
                //     setOpen(false)
                // }
            }}
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
                                        {(loadingLocal || isSearchLoading)
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