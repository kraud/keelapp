import {Autocomplete, CircularProgress, Grid, InputAdornment, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {SearchResult} from "../ts/interfaces";
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import globalTheme from "../theme/theme";
import {CountryFlag} from "./GeneralUseComponents";
import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {OverridableStringUnion} from "@mui/types";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import QuizIcon from '@mui/icons-material/Quiz';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import {getPartOfSpeechAbbreviated} from "./forms/commonFunctions";
import {getFriendRequestButtonLabel} from "./generalUseFunctions";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

interface AutocompleteSearchProps {
    options: SearchResult[]
    getOptions: (inputValue: string) => void
    onSelect: (selection: SearchResult) => void
    placeholder?: string

    isSearchLoading: boolean

    sxPropsAutocomplete?: SxProps<Theme>
    sxPropsInput?: SxProps<Theme>
    textColor?: string // both placeholder and input
    iconColor?: OverridableStringUnion<
        | 'inherit'
        | 'action'
        | 'disabled'
        | 'primary'
        | 'secondary'
        | 'error'
        | 'info'
        | 'success'
        | 'warning'
        >
}

export const AutocompleteSearch = (props: AutocompleteSearchProps) => {
    const { t } = useTranslation(['common'])
    const [value, setValue] = useState<SearchResult|null>(null)
    const [inputValue, setInputValue] = useState<string>('')
    const [options, setOptions] = useState<SearchResult[]>([])
    const [open, setOpen] = useState(false)
    const [loadingLocal, setLoadingLocal] = useState(false)
    const {friendships} = useSelector((state: any) => state.friendships)
    const {user} = useSelector((state: any) => state.auth)

    // if we simply depend on isLoading, the text on the first option reads "no matches" for a second, before "Loading.."
    useEffect(() => {
        if(!props.isSearchLoading && loadingLocal){ // only valid once isLoading catches up with loadingLocal, and then finishes
            setLoadingLocal(false)
        } else {
            if(props.isSearchLoading){
                setOptions([])
            }
        }
    }, [props.isSearchLoading])

    // this triggers when we type something on the search field
    useEffect(() => {
        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }
        const timeout = setTimeout(() => {
            // dispatch search for inputValue and when results are updated, set them in options
            props.getOptions(inputValue)
        }, 400)

        return () => clearTimeout(timeout)
    }, [inputValue])

    useEffect(() => {
        setOptions(props.options)
    },[props.options])

    // this triggers once we select something from the list
    useEffect(() => {
        if(value !== null){
            props.onSelect(value)
            setOpen(false)
            setValue(null)
        }
    }, [value])

    const getOptionIcon = (option: SearchResult) => {
        switch (option.type) {
            case ("word"): {
                return(
                    <Grid
                        item={true}
                    >
                        <CountryFlag
                            country={option.language} // we default to english
                            border={true}
                        />
                    </Grid>
                )
            }
            case ("user"): {
                return(
                    <Grid
                        item={true}
                    >
                        <Avatar
                            alt="User photo"
                            color={"primary"}
                            sx={{
                                width: '25px',
                                height: '25px',
                                margin: globalTheme.spacing(1),
                                bgcolor: "#0072CE"
                            }}
                        >
                            <PersonIcon/>
                        </Avatar>
                    </Grid>
                )
            }
            case ("tag"): {
                return(
                    <Grid
                        item={true}
                    >
                        {(option.completeTagInfo?.author!! === user._id)
                            ? <LocalOfferIcon color={"primary"}/> // if current user is the author, we display filled-icon
                            : <LocalOfferOutlinedIcon color={"primary"}/> // if not, we display outlined-icon
                        }
                    </Grid>
                )
            }
            default: {
                return null
            }
        }
    }

    const getSecondLayerInfo = (option: SearchResult) => {
        switch (option.type) {
            case ("word"): {
                return(
                    <Typography
                        variant={'body2'}
                        color={'primary'}
                        alignSelf={"left"}
                        sx={{
                            display: 'inline',
                            paddingLeft: globalTheme.spacing(1),
                            marginRight: globalTheme.spacing(2),
                        }}
                    >
                        {getPartOfSpeechAbbreviated(option.completeWordInfo.partOfSpeech, user?.uiLanguage)}
                    </Typography>
                )
            }
            case ("user"): {
                const statusIconSx = {
                    marginBottom: '-5px',
                    marginLeft: '12px',
                    color: 'green',
                }
                return(
                    <>
                        <Typography
                            variant={'body2'}
                            color={'primary'}
                            alignSelf={"left"}
                            sx={{
                                display: 'inline',
                                paddingLeft: globalTheme.spacing(1),
                                marginRight: globalTheme.spacing(2),
                            }}
                        >
                            {option.username}
                        </Typography>
                        {
                            [null,<EmojiPeopleIcon sx={statusIconSx}/>, <QuizIcon sx={statusIconSx}/>, <HowToRegIcon sx={statusIconSx}/>]
                            [(getFriendRequestButtonLabel(friendships, option.id))]
                        }
                    </>
                )
            }
            case ("tag"): {
                return(
                    <Typography
                        variant={'body2'}
                        color={'primary'}
                        alignSelf={"left"}
                        sx={{
                            display: 'inline',
                            paddingLeft: globalTheme.spacing(1),
                            marginRight: globalTheme.spacing(2),
                        }}
                    >
                        {option.completeTagInfo!!.public}
                    </Typography>
                )
            }
            default: {
                return null
            }
        }
    }

    return(
        <Autocomplete
            open={open}
            forcePopupIcon={false}
            clearIcon={<ClearIcon />}
            // this will allow the search-input to remain the same size,
            // and only the list of results will grow to match the option's width
            // also, min-width in pop-up must match the input-component
            componentsProps={{ popper: { style: {minWidth: '250px', width: 'fit-content'} } }}
            sx={{
                minWidth: '250px',
                ...props.sxPropsAutocomplete,
                color: (props.textColor !== undefined) ? props.textColor : undefined,
            }}
            getOptionLabel={(option: SearchResult) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(x: any) => x} // necessary to implement filter on server
            options={(loadingLocal || props.isSearchLoading) ?[] :options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            noOptionsText={(loadingLocal || props.isSearchLoading)
                ? t('header.search.loading', {ns: 'common'})
                : t('header.search.noMatches', {ns: 'common'})
            }
            onChange={(event: any, newValue: SearchResult | null) => {
                setValue(newValue)
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
                            sx: ({
                                ...props.sxPropsInput,
                                color: (props.textColor !== undefined) ? props.textColor : undefined,
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
                                    {((loadingLocal || props.isSearchLoading) && open)
                                        //@ts-ignore
                                        ? <CircularProgress color={(props.iconColor !== undefined) ?props.iconColor :"allWhite"}/>
                                        //@ts-ignore
                                        : <SearchIcon color={(props.iconColor !== undefined) ?props.iconColor :"allWhite"}/>
                                    }
                                </InputAdornment>
                            )
                        }}
                        placeholder={(props.placeholder !== undefined)
                            ? props.placeholder
                            : t('header.search.placeholder', {ns: 'common'})
                    }
                        fullWidth
                        sx={{
                            '& .MuiAutocomplete-inputRoot': {
                                borderBottom: '2px white solid',
                                paddingLeft: globalTheme.spacing(1),
                                "& ::placeholder": {
                                    color: (props.textColor !== undefined) ? props.textColor : undefined,
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
                        style={{
                            paddingTop: 0,
                            paddingBottom: 0,
                            paddingLeft: 0,
                            paddingRight: 0,
                        }}
                        {...props}
                        //@ts-ignore
                        key={(props['data-option-index'] as number).toString()+"-"+option.label}
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
                            {getOptionIcon(option)}
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
                                {getSecondLayerInfo(option)}
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
        />
    )
}