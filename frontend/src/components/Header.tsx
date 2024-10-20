import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {logout, resetState, updateUser} from "../features/auth/authSlice";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {AutocompleteSearch} from "./AutocompleteSearch";
import globalTheme from "../theme/theme";
import {searchWordByAnyTranslation} from "../features/words/wordSlice";
import {NotificationData, SearchResult} from "../ts/interfaces";
import {Badge, Grid} from "@mui/material";
import {getLangKeyByLabel, stringAvatar} from "./generalUseFunctions";
import FormControlLabel from "@mui/material/FormControlLabel";
import {useState} from "react";
import {clearSearchResultTags, searchTagsByLabel} from "../features/tags/tagSlice";
import {MaterialUISwitch} from "./StyledSwitch";
import {checkEnvironmentAndIterationToDisplay} from "./forms/commonFunctions";
import {CountryFlag, triggerToastMessageWithButton} from "./GeneralUseComponents";
import {useTranslation} from "react-i18next";
import {AppDispatch} from "../app/store";
import {resetWordsSelectedForExercises} from "../features/exercises/exerciseSlice";
import {Lang} from "../ts/enums";
import LinearIndeterminate from "./Spinner";
import {LaduLogo} from "./LaduLogo";


function ResponsiveAppBar() {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const location = useLocation()

    const { t } = useTranslation(['common'])
    const pages = [
        t('header.addWord', {ns: 'common'}),
        t('header.practice', {ns: 'common'}),
        t('header.review', {ns: 'common'}),
    ]
    const settings = [
        t('header.settings.notifications', {ns: 'common'}),
        t('header.settings.account', {ns: 'common'}),
        t('header.settings.dashboard', {ns: 'common'}),
        t('header.settings.logout', {ns: 'common'}),
    ]
    const languages = [
        Lang.EN,
        Lang.ES,
        Lang.DE,
        Lang.EE,
    ]

    const {user, isLoadingAuth} = useSelector((state: any) => state.auth)
    const {searchResults, isSearchLoading} = useSelector((state: any) => state.words)
    const {notifications, isLoadingNotifications, isSuccessNotifications} = useSelector((state: any) => state.notifications)
    const {searchResultTags, isLoadingTagSearch} = useSelector((state: any) => state.tags)
    const [isWordSearch, setIsWordSearch] = useState(true)

    const componentStyles = {
        appBar: {
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
        },
        toolBar: {
            overflow: 'auto',
        },
        adbIcon: {
            display: {
                xs: 'none',
                md: 'flex'
            },
            mr: 1
        }
    }

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [anchorElLanguage, setAnchorElLanguage] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    }
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    }
    const handleOpenUILanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElLanguage(event.currentTarget);
    }

    const isCurrentOptionSelected = (index: number) => {
        // NB! Locations refer to the 'pages' array.
        switch (index){
            case 0:{
                return (location.pathname === '/addWord')
            }
            case 1:{
                return (location.pathname === '/practice')
            }
            case 2:{
                return (location.pathname === '/review')
            }
            default: return false
        }
    }

    const handleCloseNavMenu = (option: any) => {
        if(option !== null){
            switch (option){
                case(t('header.addWord', {ns: 'common'})): {
                    if((user.languages).length > 1){
                        navigate('/addWord')
                    } else {
                        triggerToastMessageWithButton({
                            description: "You need to select at least 2 languages, before adding a word.",
                            buttonLabel: "Click here to go to Account and select them.",
                            onClickButton: () => navigate(`/user`),
                        })
                    }
                    break
                }
                case(t('header.review', {ns: 'common'})): {
                    if(checkEnvironmentAndIterationToDisplay(3)){
                        if((user.languages).length > 1){
                            navigate('/review')
                        } else {
                            triggerToastMessageWithButton({
                                description: "You need to select at least 2 languages to review their translations.",
                                buttonLabel: "Click here to go to Account and select them.",
                                onClickButton: () => navigate(`/user`)
                            })
                        }
                    } else {
                        toast.error(t('header.notImplemented', {ns: 'common'}))
                    }
                    break
                }
                case(t('header.practice', {ns: 'common'})): {
                    dispatch(resetWordsSelectedForExercises())
                    navigate('/practice')
                    break
                }
                default: {
                    toast.error(t('header.notImplemented', {ns: 'common'}))
                }
            }
        }
        setAnchorElNav(null)
    }

    // type string when clicking on a language option and object when clicking off the menu
    const handleCloseLanguageMenu = (option: string | object) => {
        if(option!!){
            dispatch(updateUser({
                ...user,
                uiLanguage: option
            }))
        }
        setAnchorElLanguage(null)
    }

    // type string when clicking on option and object when clicking off the menu
    const handleCloseUserMenu = (option: string | object) => {
        switch (option){
            case(t('header.settings.logout', {ns: 'common'})): {
                dispatch(logout())
                dispatch(resetState())
                navigate('/login')
                break
            }
            case(t('header.settings.dashboard', {ns: 'common'})): {
                navigate('/')
                break
            }
            case(t('header.settings.account', {ns: 'common'})): {
                navigate('/user')
                break
            }
            case(t('header.settings.notifications', {ns: 'common'})): {
                if(checkEnvironmentAndIterationToDisplay(3)){
                    navigate('/user/'+user._id+'/notifications')
                } else {
                    toast.error(toast.error(t('header.notImplemented', {ns: 'common'})))
                }
                break
            }
            default: {
                if(typeof option === 'string'){ // for options no yet implemented
                    toast.error(t('errors.somethingWrong', {ns: 'common'}))
                }
            }
        }
        setAnchorElUser(null)
    }

    const getUnreadNotifications = () => {
        return(
            notifications.filter((notification: NotificationData) => {
                return(!(notification.dismissed!!))
            })
        )
    }

    const onSearch = (searchValue: string) => {
        if(isWordSearch){
            dispatch(searchWordByAnyTranslation(searchValue))
        } else { // then is tag search
            dispatch(searchTagsByLabel({
                query: searchValue,
                includeOtherUsersTags: true
            }))
        }
    }

    const onSelect = (option: SearchResult) => {
        if(isWordSearch){
            navigate(`/word/${option.id}`) // should we somehow check if value.id is something valid?
        } else { // then is tag search
            // @ts-ignore
            navigate(`/tag/${option.id}`)
            dispatch(clearSearchResultTags())
        }
    }

    return (
        <AppBar
            position="static"
            sx={componentStyles.appBar}
        >
            <Container
                maxWidth={false}
            >
                <Toolbar
                    disableGutters
                    sx={componentStyles.toolBar}
                >
                    {/* LOGO BIG */}
                    <LaduLogo
                        width={95}
                        variant={"filled"}
                        color={"white"}
                        direction={"horizontal"}
                        type={'logo'}
                        sxProps={{
                            display: { xs: 'none', md: 'flex' },
                            marginRight: globalTheme.spacing(2)
                        }}
                        onClick={ () => navigate(`/`) }
                    />

                    {/* MENU ICON (SMALL) */}
                    <Box
                        sx={{
                            flexGrow: {xs: 1, md: 0},
                            display: {
                                xs: 'flex',
                                md: 'none'
                            }
                    }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={() => handleCloseNavMenu(null)}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    {/* LOGO SMALL */}
                    <Grid
                        container={true}
                        justifyContent={'center'}
                        item={true}
                        xs={true}
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                        }}
                    >
                        <LaduLogo
                            width={95}
                            variant={"filled"}
                            color={"white"}
                            direction={"horizontal"}
                            type={'logo'}
                            sxProps={{
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                // button on each side of header are not symmetric when on small-screen,*/}
                                // so we correct this to be centered (we offset the width of the UI-Language selector)*/}
                                marginRight: '-64px',
                            }}
                            onClick={ () => navigate(`/`) }
                        />
                    </Grid>

                    {/* OPTIONS LIST */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page, index) => (
                            <Button
                                key={page}
                                onClick={() => handleCloseNavMenu(page)}
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    display: 'block',
                                    textShadow: isCurrentOptionSelected(index) ?'1px 1px 3px black' :undefined,
                                }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                    {(checkEnvironmentAndIterationToDisplay(2)) &&
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: 'none', md: 'flex' },
                                justifyContent: 'end',
                                marginRight: {
                                    xs: globalTheme.spacing(0),
                                    xl: globalTheme.spacing(1),
                                }
                            }}
                        >
                            <Grid
                                item={true}
                                container={true}
                                alignContent={"center"}
                                xs={"auto"}
                            >
                                <Grid
                                    item={true}
                                >
                                    <FormControlLabel
                                        value={isWordSearch}
                                        control={<MaterialUISwitch checked={isWordSearch} />}
                                        label={""}
                                        labelPlacement={"start"}
                                        onChange={() => setIsWordSearch(!isWordSearch)}
                                        sx={{
                                            marginRight: 0,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <AutocompleteSearch
                                options={isWordSearch ?searchResults :searchResultTags}
                                getOptions={(inputValue: string) => onSearch(inputValue)}
                                onSelect={(selection: SearchResult) => onSelect(selection)}
                                isSearchLoading={isSearchLoading || isLoadingTagSearch}
                                textColor={'white'}
                                placeholder={
                                    isWordSearch
                                        ? t('header.search.words', {ns: 'common'})
                                        : t('header.search.tags', {ns: 'common'})
                                }
                                sxPropsAutocomplete={{
                                    maxWidth: {md: '175px', lg: "250px"},
                                    minWidth: {md: '175px', lg: "250px"}
                                }}
                            />
                        </Box>
                    }
                    {/* USER ICON */}
                    <Box
                        sx={{
                            flexGrow: {
                                xs: 1,
                                md: 0
                            },
                            textAlign: "end"
                    }}>
                        <Tooltip
                            title={t('header.settings.uiLanguage', {ns: 'common'})}
                        >
                            <Button
                                variant={'text'}
                                color={'inherit'}
                                onClick={handleOpenUILanguageMenu}
                            >
                                <>
                                    {(!isLoadingAuth) && getLangKeyByLabel(user?.uiLanguage)}
                                    {(isLoadingAuth) && <LinearIndeterminate sxProps={{paddingX: '10px'}}/>}
                                </>
                            </Button>
                        </Tooltip>
                        <Tooltip
                            title={t('header.settings.openSettings', {ns: 'common'})}
                        >
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                <Badge
                                    overlap="circular"
                                    color="error"
                                    invisible={(getUnreadNotifications().length === 0)}
                                    badgeContent={getUnreadNotifications().length}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    sx={{
                                        // position: 'absolute',
                                    }}
                                >
                                    <Avatar
                                        alt="User photo"
                                        src={(user) ? "" : "/"}
                                        {...stringAvatar((user!!) ?user.name :"-")}
                                    />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem
                                    key={setting}
                                    onClick={() => {
                                        handleCloseUserMenu(setting)
                                    }}
                                >
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-langbar"
                            anchorEl={anchorElLanguage}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElLanguage)}
                            onClose={() => {
                                handleCloseLanguageMenu("")
                            }}
                        >
                            {languages.map((language) => (
                                <MenuItem
                                    key={language}
                                    onClick={() => {
                                        handleCloseLanguageMenu(language)
                                    }}
                                >
                                    <CountryFlag
                                        country={language}
                                        border={true}
                                        sxProps={{
                                            marginRight: '5px',
                                        }}
                                    />
                                    <Typography textAlign="center">
                                        {t(`languages.${language?.toLowerCase()}`, {ns: 'common'})}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
export default ResponsiveAppBar