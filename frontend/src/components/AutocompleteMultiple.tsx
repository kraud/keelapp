import {Autocomplete, Chip, CircularProgress, Grid, InputAdornment, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {FilterItem, searchAllTags} from "../features/words/wordSlice";
import {useDispatch, useSelector} from "react-redux";
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import globalTheme from "../theme/theme";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {toast} from "react-toastify";

interface AutocompleteMultipleProps {
    values: string[], // type is simply "string" array, since we get this info from the stored word, and there we only keep its "name"
    saveResults: (results: FilterItem[]) => void
    limitTags?: number
    allowNewOptions?: boolean
    disabled?: boolean
    matchAll?: boolean // this will change how the filters are returned on saveResults.
    sxProps?: SxProps<Theme>,
}

export const AutocompleteMultiple = (props: AutocompleteMultipleProps) => {
    const [inputValue, setInputValue] = useState<string>('')
    const [options, setOptions] = useState<string[]>([])
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
        // TODO: searchResults should have the FilterItem format, and we unwind that into array of strings
        setOptions(searchResults)
    },[searchResults])

    return(
        <Autocomplete
            disabled={props.disabled}
            multiple={true}
            freeSolo={props.allowNewOptions!!}
            limitTags={props.limitTags}
            filterSelectedOptions
            disableClearable

            open={open}
            forcePopupIcon={false}
            clearIcon={<ClearIcon />}
            sx={{
                minWidth: "300px",
                background: 'white',
                ...props.sxProps
            }}
            getOptionLabel={(option: string) => option}
            // getOptionLabel={(option: SearchResult) => option.label}
            // isOptionEqualToValue={(option, value) => option === value}
            // isOptionEqualToValue={(option, value) => {
            //     return true
            // }}
            filterOptions={(x: any) => x} // necessary to implement filter on server
            options={(loadingLocal || isSearchLoading) ?[] :options}
            includeInputInList
            // NB! issues when clearing on blur where triggering reset reason at onInputChange on every character- temp fix?
            clearOnBlur={false}
            onBlur={() => {
                setOpen(false)
            }}

            value={props.values}
            noOptionsText={(loadingLocal || isSearchLoading) ?"Loading..." :"No matches"}
            //@ts-ignore
            // onChange={(event: any, newValue: SearchResult) => {
            onChange={(event: any, newValue) => {
                // setValues(newValue) //NB: moved info to parent component? TODO: check
                if(newValue.length > 0) {
                    if(props.matchAll!!){ // all tags go in a single array
                        props.saveResults([{
                            type: 'tag',
                            id: "tag-"+(props.values.length),
                            tagIds: newValue,
                            filterValue: (props.values.length).toString(),
                        }])
                    } else {
                        props.saveResults( // each tag goes in its own filter
                            newValue.map((value: string) => {
                                return({
                                    type: 'tag',
                                    id: "tag-"+value,
                                    filterValue: value,
                                })
                            })
                        )
                    }
                } else {
                    props.saveResults([])
                }
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
            renderTags={(value: string[], getTagProps) =>
                value.map((option: string, index: number) => (
                    <Chip
                        variant="outlined"
                        label={option}
                        color={"secondary"}
                        {...getTagProps({ index })}
                    />
                ))
            }
            renderInput={(params) => {
                return(
                    <TextField
                        {...params}
                        InputProps={{
                            ...params.InputProps,
                            sx: ({
                                color: 'black',
                                height: '45px',
                            }),
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
                                        ? <CircularProgress color={"secondary"}/>
                                        //@ts-ignore
                                        :
                                        <SearchIcon
                                            color={'secondary'}
                                            // onClick={() => {
                                            //     return null
                                            // TODO: add logic to allow changing the "allowNewOptions" prop?
                                            //  Icon should change accordingly
                                            // }}
                                        />
                                    }
                                </InputAdornment>
                            )
                        }}
                        placeholder={"Search tags..."}
                        fullWidth
                        sx={{
                            '& .MuiAutocomplete-inputRoot': {
                                border: '1px black solid',
                                borderRadius: '3px',
                                "& ::placeholder": {
                                    color: "black",
                                    opacity: 0.75,
                                    paddingLeft: '1em',
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