import {Autocomplete, Chip, CircularProgress, Grid, InputAdornment, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {searchAllTags} from "../features/words/wordSlice";
import {useDispatch, useSelector} from "react-redux";
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import globalTheme from "../theme/theme";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {FilterItem} from "../ts/interfaces";

interface AutocompleteMultipleProps {
    values: string[], // type is simply "string" array, since we get this info from the stored word, and there we only keep its "name"
    saveResults: (results: FilterItem[]) => void
    type: any //'tag'|'gender'|'PoS'// TODO: type should be 'tag'|'gender'|'PoS'
    limitTags?: number
    allowNewOptions?: boolean
    disabled?: boolean
    // TODO: list of selected tags not working when matchAll is false
    matchAll?: boolean // this will change how the filters are returned on saveResults.
    sxProps?: SxProps<Theme>,
}

export const AutocompleteMultiple = (props: AutocompleteMultipleProps) => {
    const [inputValue, setInputValue] = useState<string>('')
    const [options, setOptions] = useState<string[]>([])
    const [open, setOpen] = useState(false)
    const [loadingLocal, setLoadingLocal] = useState(false)
    const dispatch = useDispatch()
    const {tags, isTagSearchLoading} = useSelector((state: any) => state.words)

    // if we simply depend on isLoading, the text on the first option reads "no matches" for a second, before "Loading.."
    useEffect(() => {
        if(!isTagSearchLoading && loadingLocal){ // only valid once isLoading catches up with loadingLocal, and then finishes
            setLoadingLocal(false)
        } else {
            if(isTagSearchLoading){
                setOptions([])
            }
        }
    }, [isTagSearchLoading])

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
        setOptions(tags)
    },[tags])

    const getDataToStoreByType = (newValue: any|any[]) => {
        switch(props.type){
            case('tag'):{
                return({
                    type: props.type,
                    id: props.matchAll ? props.type+"-"+(props.values.length) :props.type+"-"+newValue,
                    filterValue: props.matchAll ? (props.values.length).toString() :newValue,
                    tagIds: props.matchAll ? newValue :undefined,
                })
            }
            // case('gender'):{
            //     return(undefined as FilterItem) // TODO: once implemented, add corresponding data to return
            // }
            // case('PoS'):{
            //     return(undefined as FilterItem) // TODO: once implemented, add corresponding data to return
            // }
            default: return({
                type: props.type,
                id: props.matchAll ? props.type+"-"+(props.values.length) :props.type+"-"+newValue,
                filterValue: props.matchAll ? (props.values.length).toString() :newValue,
            })
        }
    }

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
            options={(loadingLocal || isTagSearchLoading) ?[] :options}
            includeInputInList
            // NB! issues when clearing on blur where triggering reset reason at onInputChange on every character- temp fix?
            clearOnBlur={false}
            onBlur={() => {
                setOpen(false)
            }}

            value={props.values}
            noOptionsText={(loadingLocal || isTagSearchLoading) ?"Loading..." :"No matches"}
            //@ts-ignore
            // onChange={(event: any, newValue: SearchResult) => {
            onChange={(event: any, newValue) => {
                // setValues(newValue) //NB: moved info to parent component? TODO: check
                if(newValue.length > 0) {
                    if(props.matchAll!!){ // all tags go in a single array - so all must match in every single result
                        props.saveResults([getDataToStoreByType(newValue)])
                    } else {
                        props.saveResults( // each tag goes in its own filter - so a result can match a single filter at a time
                            newValue.map((value: string) => {
                                return(getDataToStoreByType(value))
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
                                    {((loadingLocal || isTagSearchLoading) && open)
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
                                paddingLeft: globalTheme.spacing(1),
                                "& ::placeholder": {
                                    color: "black",
                                    opacity: 0.75,
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