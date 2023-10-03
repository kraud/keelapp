import globalTheme from "../theme/theme";
import {Grid, Modal} from "@mui/material";
import Box from "@mui/material/Box";
import {useState} from "react";
import React from "react";
import {AutocompleteSearch} from "./AutocompleteSearch";
import {searchUser} from "../features/auth/authSlice";
import {SearchResult} from "../ts/interfaces";
import {useDispatch, useSelector} from "react-redux";

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
                            sxProps={{
                                background: 'grey',
                                // color: 'black',
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )
}