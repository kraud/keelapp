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
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import {logout, resetState} from "../features/auth/authSlice";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {AutocompleteSearch} from "./AutocompleteSearch";
import globalTheme from "../theme/theme";
import {searchWordByAnyTranslation} from "../features/words/wordSlice";
import {NotificationData, SearchResult} from "../ts/interfaces";
import {Badge} from "@mui/material";
import {stringAvatar} from "./generalUseFunctions";

const pages = ['Add word', 'Practice', 'Review'];
const settings = ['Notifications', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const {user} = useSelector((state: any) => state.auth)
    const {searchResults, isSearchLoading} = useSelector((state: any) => state.words)
    const {notifications, isLoadingNotifications, isSuccessNotifications} = useSelector((state: any) => state.notifications)

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
        switch (option){
            case "Add word": {
                navigate('/addWord')
                break
            }
            case "Review": {
                navigate('/review')
                break
            }
            default: {
                toast.error("This function is not ready yet, we're sorry!")
            }
        }
        setAnchorElNav(null)
    }

    // type string when clicking on option and object when clicking off the menu
    const handleCloseUserMenu = (option: string | object) => {
        switch (option){
            case "Logout": {
                //@ts-ignore
                dispatch(logout())
                dispatch(resetState())
                navigate('/login')
                break
            }
            case "Dashboard": {
                navigate('/')
                break
            }
            case "Account": {
                navigate('/user')
                break
            }
            case "Notifications": {
                navigate('/user/'+user._id+'/notifications')
                break
            }
            default: {
                if(typeof option === 'string'){ // for options no yet implemented
                    toast.error("Something went wrong, try again.")
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
                    <LanguageOutlined
                        sx={componentStyles.adbIcon}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
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
                            onClose={handleCloseNavMenu}
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
                    <LanguageOutlined sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
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
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                            justifyContent: 'end',
                            marginRight: globalTheme.spacing(6)
                        }}
                    >
                        <AutocompleteSearch
                            options={searchResults}
                            getOptions={(inputValue: string) => {
                                // @ts-ignore
                                dispatch(searchWordByAnyTranslation(inputValue))
                            }}
                            onSelect={(selection: SearchResult) => {
                                navigate(`/word/${selection.id}`) // should we somehow check if value.id is something valid?
                            }}
                            isSearchLoading={isSearchLoading}
                            textColor={'white'}
                        />
                    </Box>
                    {/* USER ICON */}
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
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