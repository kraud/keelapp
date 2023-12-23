import globalTheme from "../theme/theme";
import {Button, CircularProgress, Grid, Modal, Switch, TextField, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import React, {useEffect, useState} from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import {getAmountByTag} from "../features/words/wordSlice";
import {useDispatch, useSelector} from "react-redux";
import {getTagById} from "../features/tags/tagSlice";
import {TagData} from "../ts/interfaces";
import * as Yup from "yup";
import {GenderDE} from "../ts/enums";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {RadioGroupWithHook} from "./RadioGroupFormHook";
import {TextInputFormWithHook} from "./TextInputFormHook";
import {TagDataForm} from "./forms/tags/TagForm";


interface FriendSearchModalProps {
    open: boolean
    setOpen: (value: boolean) => void
    tagId: string | undefined // this will eventually be a real ID, and we'll have to load the read tag data when opening this modal

    // should this should be replaced by 'fullTagData'? => to avoid changing 'currentTagData' in props
    // updateTagFormData: (tagFormData: TagData) => void,
}

export const TagInfoModal = (props: FriendSearchModalProps) => {
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
    // ------------------ ^^^^^ ALL BELOW IS LEGACY ^^^^^ ------------------

    useEffect(() => {
        if(props.tagId!!){
            // @ts-ignore
            dispatch(getAmountByTag(props.tagId))
        }
    },[props.tagId])
    const {currentTagAmount, isTagSearchLoading} = useSelector((state: any) => state.words)
    const [isPublic, setIsPublic] = useState(true) // so Friends can see this tag on your profile and add it to their account

    // ------------------ ^^^^^ ALL ABOVE IS LEGACY ^^^^^ ------------------
    const dispatch = useDispatch()

    const handleOnClose = () => {
        props.setOpen(false)
        // TODO: should clear props.tagId when closing
    }

    const emptyTagData = {
        _id: "",
        author: "",
        label: "",
        description: "",
        public: 'Private' as 'Private', // to make TS happy.
        wordsId: [],
    }
    const [fullTagData, setFullTagData] = useState<TagData>(emptyTagData) // so Friends can see this tag on your profile and add it to their account
    const [isEditing, setIsEditing] = useState(false)
    // TODO: move this to parent component => Tag data is provided by "currentTagData" prop
    useEffect(() => {
        // If props.tagId is a real tag => get the data
        if(props.tagId!!){
            // @ts-ignore
            dispatch(getTagById(props.tagId))
        } // if not, display empty form to create a new tag
    },[])


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
                        container={true}
                        rowSpacing={2}
                    >
                        {/*<TagDataForm*/}
                        {/*    currentTagData={}*/}
                        {/*    displayOnly={}*/}
                        {/*/>*/}
                        <Grid
                            container={true}
                            justifyContent={"flex-start"}
                            item={true}
                            // xs={12}
                            // md={10}
                            rowSpacing={{
                                xs: 1,
                                md: 0,
                            }}
                            spacing={{
                                xs: 0,
                                md: 2,
                            }}
                        >
                            <Grid
                                item={true}
                                xs={12}
                                md={5}
                            >
                                <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    onClick={() => null}
                                    fullWidth={true}
                                    startIcon={<SendIcon />}
                                >
                                    Send to friends
                                </Button>
                            </Grid>
                            <Grid
                                item={true}
                                xs={12}
                                md={5}
                            >
                                <Button
                                    variant={"contained"}
                                    color={"warning"}
                                    onClick={() => null}
                                    fullWidth={true}
                                    endIcon={<ClearIcon />}
                                >
                                    Delete all words
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

        </Modal>
    )
}