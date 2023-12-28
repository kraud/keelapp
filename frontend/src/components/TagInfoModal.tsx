import globalTheme from "../theme/theme";
import {Button, Grid, Modal} from "@mui/material";
import Box from "@mui/material/Box";
import React, {useEffect, useState} from "react";
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import EditIcon from '@mui/icons-material/Edit';
import {useDispatch, useSelector} from "react-redux";
import {clearFullTagData, createTag, deleteTag, getTagById, updateTag} from "../features/tags/tagSlice";
import {TagData} from "../ts/interfaces";
import {TagDataForm} from "./forms/tags/TagDataForm";
import LinearIndeterminate from "./Spinner";
import {toast} from "react-toastify";


interface FriendSearchModalProps {
    open: boolean
    setOpen: (value: boolean) => void
    tagId: string | undefined
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
        setTagCurrentData(emptyTagData)
        dispatch(clearFullTagData())
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
    const [tagCurrentData, setTagCurrentData] = useState<TagData>(emptyTagData)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        // If props.tagId is empty => we're creating a new tag
        if((props.open) && (!(props.tagId!!))){
           setIsEditing(true)
        }
    },[props.open, props.tagId])

    useEffect(() => {
        // if not editing => get and display exiting tag data
        if(props.open && !isEditing && (props.tagId !== "")){
            // @ts-ignore
            dispatch(getTagById(props.tagId)) // result will be stored at fullTagData
        } // if not, display empty form to create a new tag
    },[isEditing, props.open, props.tagId])


    // once the request is made and the results come in, we save them into a local copy of the state,
    // this way the original remains in Redux, and we can access it to reverse changes if needed.
    useEffect(() => {
        if(!isLoadingTags && isSuccessTags && (fullTagData !== undefined)){
            setTagCurrentData(fullTagData)
            setIsEditing(false)
        }
    },[fullTagData, isSuccessTags, isLoadingTags])

    const getActionButtons = () => {
        if(isEditing){
            // we check id twice, in case the tag has just been created, so props.tagId is still ""
            if((props.tagId!!) || (tagCurrentData._id!!)){ // editing existing tag: save changes - cancel (revert changes set to reviewing)
                return(<>
                    <Grid
                        item={true}
                        xs={12}
                        md={3}
                    >
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            onClick={() => updateExistingTagData()}
                            fullWidth={true}
                            startIcon={<SaveAsIcon/>}
                            disabled={!(tagCurrentData.completionState!!)}
                        >
                            Save changes
                        </Button>
                    </Grid>
                    <Grid
                        item={true}
                        xs={12}
                        md={3}
                    >
                        <Button
                            variant={"contained"}
                            color={"info"}
                            onClick={() => {
                                setIsEditing(false)
                                setTagCurrentData(fullTagData)
                            }}
                            fullWidth={true}
                            endIcon={<ClearIcon />}
                        >
                            Cancel
                        </Button>
                        {/* TODO: add a Delete-Tag button here?   */}
                    </Grid>
                    <Grid
                        item={true}
                        xs={12}
                        md={3}
                    >
                        <Button
                            variant={"contained"}
                            color={"error"}
                            onClick={() => {
                                setIsEditing(false)
                                setTagCurrentData(fullTagData)
                            }}
                            fullWidth={true}
                            endIcon={<DeleteForeverIcon />}
                        >
                            Delete tag
                        </Button>
                        {/* TODO: add a Delete-Tag button here?   */}
                    </Grid>
                </>)
            } else {// creating new tag: save - cancel (close modal)
                return(<>
                    <Grid
                        item={true}
                        xs={12}
                        md={4}
                    >
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            onClick={() => createNewTag()}
                            fullWidth={true}
                            startIcon={<SaveIcon/>}
                            disabled={!(tagCurrentData.completionState!!)}
                        >
                            Create tag
                        </Button>
                    </Grid>
                    <Grid
                        item={true}
                        xs={12}
                        md={4}
                    >
                        <Button
                            variant={"contained"}
                            color={"info"}
                            onClick={() => handleOnClose()}
                            fullWidth={true}
                            endIcon={<ClearIcon />}
                        >
                            Cancel
                        </Button>
                    </Grid>
                </>)
            }
        } else {
            // reviewing: send to friends - delete words - cancel (close modal)
            return(<>
                <Grid
                    item={true}
                    xs={12}
                    md={3}
                >
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        onClick={() => toast.info('Coming soon!')}
                        fullWidth={true}
                        startIcon={<SendIcon />}
                    >
                        Send to friends
                    </Button>
                </Grid>
                <Grid
                    item={true}
                    xs={12}
                    md={3}
                >
                    <Button
                        variant={"contained"}
                        color={"warning"}
                        onClick={() => null} // TODO: add a confirmation before deleting words
                        fullWidth={true}
                        endIcon={<DeleteForeverIcon />}
                    >
                        Delete all words
                    </Button>
                </Grid>
                <Grid
                    item={true}
                    xs={12}
                    md={3}
                >
                    <Button
                        variant={"contained"}
                        color={"secondary"}
                        onClick={() => setIsEditing(true)}
                        fullWidth={true}
                        endIcon={<EditIcon />}
                    >
                        Edit
                    </Button>
                </Grid>
                <Grid
                    item={true}
                    xs={12}
                    md={3}
                >
                    <Button
                        variant={"contained"}
                        color={"info"}
                        onClick={() => handleOnClose()}
                        fullWidth={true}
                        endIcon={<ClearIcon />}
                    >
                        Close
                    </Button>
                </Grid>
            </>)
        }
    }

    const createNewTag = () => {
        // @ts-ignore
        dispatch(createTag(tagCurrentData)) // result will be stored at fullTagData
    }

    const updateExistingTagData = () => {
        // @ts-ignore
        dispatch(updateTag(tagCurrentData)) // result will be stored at fullTagData
    }

    const deleteTagData = () => {
        // @ts-ignore
        dispatch(deleteTag(tagCurrentData._id)) // result will be stored at fullTagData
        // TODO: should we give the option to also delete all words related to this tag?
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
                        container={true}
                        rowSpacing={2}
                    >
                        <TagDataForm
                            currentTagData={tagCurrentData}
                            displayOnly={
                                (
                                    (props.tagId !== "")
                                    ||
                                    ((fullTagData !== undefined) && (fullTagData._id!!))
                                ) &&
                                !isEditing
                            }
                            updateTagFormData={(formData: TagData) => {
                                setTagCurrentData(formData)
                            }}
                        />
                        {(isLoadingTags) && <LinearIndeterminate/>}
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
                            {getActionButtons()}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

        </Modal>
    )
}