import {Autocomplete, CircularProgress, Grid, InputAdornment, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {searchAllTags} from "../features/words/wordSlice";
import {useDispatch, useSelector} from "react-redux";
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import globalTheme from "../theme/theme";
import {useNavigate} from "react-router-dom";

interface AutocompleteMultipleProps {
    values: string[],
    saveResults: (results: string[]) => void
    limitTags?: number
    allowNewOptions?: boolean
    // saveResults: (results: SearchResult[]) => void
    // searchQuery: (inputValue: string) => void
}

export const AutocompleteMultiple = (props: AutocompleteMultipleProps) => {
    const navigate = useNavigate()
    const [values, setValues] = useState<string[]>([])
    // const [values, setValues] = useState<SearchResult[]>([])
    const [inputValue, setInputValue] = useState<string>('')
    // const [options, setOptions] = useState<SearchResult[]>([])
    const [options, setOptions] = useState<string[]>([])
    const [open, setOpen] = useState(false)
    const [loadingLocal, setLoadingLocal] = useState(false)
    const dispatch = useDispatch()
    const {searchResults, isSearchLoading} = useSelector((state: any) => state.words)

    // in case we have initial values
    useEffect(() => {
        if(props.values!! && props.values.length > 0){
            setValues(props.values)
        }
    }, [])

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
            setOptions(values)
            return undefined;
        }
        const timeout = setTimeout(() => {
            // dispatch search for inputValue and when results are updated, set them in options
            // @ts-ignore
            dispatch(searchAllTags(inputValue))
        }, 400)

        return () => clearTimeout(timeout)
    }, [inputValue])

    useEffect(() => {
        setOptions(searchResults)
    },[searchResults])

    // this triggers once we select something from the list
    useEffect(() => {
        props.saveResults(values)
        setOpen(false)
    }, [values])

    // @ts-ignore
    return(
        <Autocomplete
            multiple={true}
            freeSolo={props.allowNewOptions!!}
            limitTags={props.limitTags}
            filterSelectedOptions

            open={open}
            forcePopupIcon={false}
            clearIcon={<ClearIcon />}
            sx={{ width: 250 }}
            getOptionLabel={(option: string) => option}
            // getOptionLabel={(option: SearchResult) => option.label}
            isOptionEqualToValue={(option, value) => option === value}
            // isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(x: any) => x} // necessary to implement filter on server
            options={(loadingLocal || isSearchLoading) ?[] :options}
            autoComplete
            includeInputInList
            value={values}
            noOptionsText={(loadingLocal || isSearchLoading) ?"Loading..." :"No matches"}
            //@ts-ignore
            // onChange={(event: any, newValue: SearchResult) => {
            onChange={(event: any, newValue) => {
                // TODO: this should actually check if already on value list and remove if necessary
                setValues(newValue)
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
                            sx: ({color: 'black'}),
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
                                    {((loadingLocal || isSearchLoading) && open)
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
                                // borderBottom: '2px white solid',
                                border: '2px black solid',
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
                                    {option}
                                </Typography>
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
        />
    )
}