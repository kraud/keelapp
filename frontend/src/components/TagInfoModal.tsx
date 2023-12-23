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
import {TagDataForm} from "./forms/tags/TagDataForm";


interface FriendSearchModalProps {
    open: boolean
    setOpen: (value: boolean) => void
    tagId: string | undefined // this will eventually be a real ID, and we'll have to load the read tag data when opening this modal

    // should this should be replaced by 'fullTagData'? => to avoid changing 'currentTagData' in props
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
    const dispatch = useDispatch()
    // 'fullTagData' will remain the same as it in BE. In case we need to cancel changes, we have this to copy the info from.
    const {fullTagData, isSuccessTags, isLoadingTags} = useSelector((state: any) => state.tags)

    const handleOnClose = () => {
        props.setOpen(false)
        // TODO: should clear props.tagId when closing
    }

    const emptyTagData = {
        author: "",
        label: "",
        description: "",
        public: 'Private' as 'Private', // to make TS happy.
        wordsId: [],
    }
    // This state will hold the current state inside the TagForm, and will be updated when that changes.
    // This also includes the internalStatus properties, to know if form is valid and/or dirty, to help with button logic
    const [TagCurrentData, setTagCurrentData] = useState<TagData>(emptyTagData) // so Friends can see this tag on your profile and add it to their account
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        // If props.tagId is empty => we're creating a new tag
        if(props.tagId!!){
           setIsEditing(true)
        }
    },[])

    useEffect(() => {
        // if not editing => get and display exiting tag data
        if(!isEditing){
            // @ts-ignore
            dispatch(getTagById(props.tagId)) // result will be stored at fullTagData
        } // if not, display empty form to create a new tag
    },[isEditing])

    // once the request is made and the results come in, we save them into a local copy of the state,
    // this way the original remains in Redux, and we can access it to reverse changes if needed.
    useEffect(() => {
        if(!isLoadingTags && isSuccessTags && (fullTagData !== undefined)){
            setTagCurrentData(fullTagData)
        }
    },[fullTagData, isSuccessTags, isLoadingTags])

    useEffect(() => {
        console.log('TagCurrentData',TagCurrentData)
    },[TagCurrentData])


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
                        <TagDataForm
                            currentTagData={TagCurrentData}
                            displayOnly={props.tagId !== ""}
                            updateTagFormData={(formData: TagData) => {
                                setTagCurrentData(formData)
                            }}
                        />
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
                            {/*TODO: button should change when creating/editing a tag */}
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