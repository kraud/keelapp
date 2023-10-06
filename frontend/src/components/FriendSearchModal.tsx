import globalTheme from "../theme/theme";
import {Button, Grid, Modal} from "@mui/material";
import Box from "@mui/material/Box";
import {useState} from "react";
import React from "react";
import {AutocompleteSearch} from "./AutocompleteSearch";
import {searchUser} from "../features/auth/authSlice";
import {SearchResult} from "../ts/interfaces";
import {useDispatch, useSelector} from "react-redux";
import {UserBadge} from "./UserBadge";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ClearIcon from '@mui/icons-material/Clear';
import {toast} from "react-toastify";

interface FriendSearchModalProps {
    open: boolean
    setOpen: (value: boolean) => void
}

export const FriendSearchModal = (props: FriendSearchModalProps) => {
    const componentStyles = {
        mainContainer: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(80vw, max-content)',
            background: 'white',
            border: '4px solid #0072CE',
            borderRadius: '25px',
            padding: globalTheme.spacing(3),
            boxShadow: 24,
        },

    }
    const dispatch = useDispatch()
    const {userList, isLoading} = useSelector((state: any) => state.auth)
    const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null)


    const handleOnClose = () => {
        props.setOpen(false)
        setSelectedUser(null)
    }

    return (
        <Modal
            open={props.open}
            onClose={() => handleOnClose()}
            disableAutoFocus={true}
        >
            <Box
                sx={componentStyles.mainContainer}
            >
                <Grid
                    container={true}
                    item={true}
                    justifyContent={"center"}
                >
                    {(selectedUser === null)
                        ?
                        <Grid
                            item={true}
                        >
                            <AutocompleteSearch
                                options={userList}
                                getOptions={(inputValue: string) => {
                                    // @ts-ignore
                                    dispatch(searchUser(inputValue))
                                }}
                                onSelect={(selection: SearchResult) => {
                                    // trigger more detailed search for user data?
                                    // navigate(`/word/${selection.id}`) // should we somehow check if value.id is something valid?
                                    setSelectedUser(selection)
                                }}
                                isSearchLoading={isLoading}
                                sxPropsAutocomplete={{
                                    background: '#c7c7c7',
                                }}
                                sxPropsInput={{
                                    color: 'black',
                                }}
                                placeholder={"Search for friends..."}
                                iconColor={"primary"}
                            />
                        </Grid>
                        :
                        <Grid
                            item={true}
                            container={true}
                            rowSpacing={2}
                            sx={{
                                marginTop: globalTheme.spacing(1)
                            }}
                        >
                            <UserBadge
                                userData={{
                                    id: selectedUser?.id,
                                    name: selectedUser?.label,
                                    email: (selectedUser.type === "user") ?selectedUser?.email : "",
                                }}
                            />
                            <Grid
                                container={true}
                                justifyContent={"space-around"}
                                item={true}
                                xs={12}
                            >
                                <Grid
                                    item={true}
                                    xs={5}
                                >
                                    <Button
                                        variant={"contained"}
                                        color={"primary"}
                                        onClick={() => toast.info("WIP: friend request sent")}
                                        fullWidth={true}
                                        startIcon={<PersonAddIcon />}
                                    >
                                        Add friend
                                    </Button>
                                </Grid>
                                <Grid
                                    item={true}
                                    xs={5}
                                >
                                    <Button
                                        variant={"contained"}
                                        color={"secondary"}
                                        onClick={() => null}
                                        fullWidth={true}
                                        endIcon={<ClearIcon />}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </Box>
        </Modal>
    )
}