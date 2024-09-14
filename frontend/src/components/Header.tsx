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
import {logout, resetState} from "../features/auth/authSlice";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {AutocompleteSearch} from "./AutocompleteSearch";
import globalTheme from "../theme/theme";
import {searchWordByAnyTranslation} from "../features/words/wordSlice";
import {NotificationData, SearchResult} from "../ts/interfaces";
import {Badge, Grid} from "@mui/material";
import {stringAvatar} from "./generalUseFunctions";
import FormControlLabel from "@mui/material/FormControlLabel";
import {useState} from "react";
import {clearSearchResultTags, searchTagsByLabel} from "../features/tags/tagSlice";
import {MaterialUISwitch} from "./StyledSwitch";
import {checkEnvironmentAndIterationToDisplay} from "./forms/commonFunctions";
import {getIconByEnvironment, triggerToastMessageWithButton} from "./GeneralUseComponents";
import {useTranslation} from "react-i18next";
import {AppDispatch} from "../app/store";
import {getExercisesForUser} from "../features/exercises/exerciseSlice";


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

    const {user} = useSelector((state: any) => state.auth)
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

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    }
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
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
                    toast.info("let me check...")
                    dispatch(getExercisesForUser({stuff: 'data'}))
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
                    {getIconByEnvironment(componentStyles.adbIcon)}
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        onClick={() => navigate('/')}
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        KEELAPP |
                    </Typography>

                    {/* MENU ICON (SMALL) */}
                    <Box
                        sx={{
                            flexGrow: 1,
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
                    {getIconByEnvironment({ display: { xs: 'flex', md: 'none' }, mr: 1 })}
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        onClick={() => navigate('/')}
                        sx={{
                            mr: 2,
                            // NB! 'inline-block' needed for nowrap ellipsis and 'none' is to avoid double text while on bigger screen
                            display: { xs: 'inline-block', md: 'none' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            cursor: 'pointer',

                            flexGrow: 1,
                        }}
                    >
                        KEELAPP
                    </Typography>

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
                                marginRight: globalTheme.spacing(6)
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
                            />
                        </Box>
                    }
                    {/* USER ICON */}
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip
                            title={t('header.settings.openSettings', {ns: 'common'})}
                        >
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                <Badge
                                    // variant="dot"
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
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
export default ResponsiveAppBar