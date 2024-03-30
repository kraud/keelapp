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
import {ConfirmationButton} from "./ConfirmationButton";


interface FriendSearchModalProps {
    open: boolean
    setOpen: (value: boolean) => void
    tagId: string | undefined
    setMadeChangesToTagList: (status: boolean) => void
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
        setIsEditing(false)
        setTagCurrentData(emptyTagData)
        dispatch(clearFullTagData())
        if(currentTagHasBeenDeleted){
            setIsCurrentTagHasBeenDeleted(false)
        }
    }

    const emptyTagData = {
        author: "",
        label: "",
        description: "",
        public: 'Private' as 'Private', // to make TS happy.
        words: [],
    }
    // This state will hold the current state inside the TagForm, and will be updated when that changes.
    // This also includes the internalStatus properties, to know if form is valid and/or dirty, to help with button logic
    const [tagCurrentData, setTagCurrentData] = useState<TagData>(emptyTagData)
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [currentTagHasBeenDeleted, setIsCurrentTagHasBeenDeleted] = useState(false)

    useEffect(() => {
        // If props.tagId is empty => we're creating a new tag
        if((props.open) && (!(props.tagId!!))){
           setIsEditing(true)
        }
    },[props.open, props.tagId])

    useEffect(() => {
        // if not editing => get and display exiting tag data
        if(props.open && !isEditing && (props.tagId !== "") && !(isUpdating)){
            // @ts-ignore
            dispatch(getTagById(props.tagId)) // result will be stored at fullTagData
        } // if not, display empty form to create a new tag
    },[isEditing, isUpdating, props.open, props.tagId])


    // once the request is made and the results come in, we save them into a local copy of the state,
    // this way the original remains in Redux, and we can access it to reverse changes if needed.
    useEffect(() => {
        if(!isLoadingTags && isSuccessTags && (fullTagData !== undefined)){
            if(!isEditing && isDeleting){ // if not editing and fullTagData updated => just deleted that tag now stored in fullTagData
                toast.info(`${fullTagData.label} tag was deleted!`)
                // TODO: close modal? Add timer to close?
                setIsDeleting(false)
                setIsCurrentTagHasBeenDeleted(true)
            }
            // but, before we check if we're updating an existing one
            if(!isEditing && isUpdating){
                toast.success('Tag was updated successfully!')
                setIsUpdating(false)
            }
            setTagCurrentData(fullTagData)
            setIsEditing(false)
        }
    },[fullTagData, isSuccessTags, isLoadingTags, isDeleting, isUpdating])

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
                            disabled={
                                (
                                    !(tagCurrentData.completionState!!)
                                    ||
                                    (isLoadingTags) // we disable all buttons while waiting for BE confirmation
                                )
                            }
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
                                deleteTagData()
                            }}
                            fullWidth={true}
                            endIcon={<DeleteForeverIcon />}
                            disabled={
                                (isLoadingTags) // we disable all buttons while waiting for BE confirmation
                            }
                        >
                            Delete tag
                        </Button>
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
                            disabled={
                                (
                                    !(tagCurrentData.completionState!!)
                                    ||
                                    (isLoadingTags) // we disable all buttons while waiting for BE confirmation
                                )
                            }
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
            return(
                <>
                    {(!currentTagHasBeenDeleted) &&
                        <>
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
                                    startIcon={<SendIcon/>}
                                >
                                    Send to friends
                                </Button>
                            </Grid>
                            <Grid
                                item={true}
                                xs={12}
                                md={3}
                            >
                                <ConfirmationButton
                                    onConfirm={() => {
                                        toast.info("Confirm deletion")
                                    }}
                                    buttonLabel={'Delete All Words'}
                                    buttonProps={{
                                        variant: "contained",
                                        color: "warning",
                                        fullWidth: true,
                                        endIcon: <DeleteForeverIcon/>
                                    }}
                                />
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
                                    endIcon={<EditIcon/>}
                                >
                                    Edit
                                </Button>
                            </Grid>
                        </>
                    }
                    <>
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
                    </>
                </>
                    )
        }
    }

    const createNewTag = () => {
        // TODO: add logic for toast to inform about successful tag-creation
        // @ts-ignore
        dispatch(createTag(tagCurrentData)) // result will be stored at fullTagData
        props.setMadeChangesToTagList(true)
    }

    const updateExistingTagData = () => {
        setIsUpdating(true)
        // @ts-ignore
        dispatch(updateTag(tagCurrentData)) // result will be stored at fullTagData
        props.setMadeChangesToTagList(true)
        setIsEditing(false)
    }

    const deleteTagData = () => {
        setIsDeleting(true)
        // @ts-ignore
        dispatch(deleteTag(tagCurrentData._id)) // result will be stored at fullTagData
        props.setMadeChangesToTagList(true)
        // Should we give the option to also delete all words related to this tag?
        // Rta: No. There is a dedicated button for that.
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
                        // TODO: add a reverse-order-thing depending on prop for DisplayTag, so buttons can be
                        //     at the top when displaying full screen, and the bottom when inside modal
                    >
                        {/* TODO: form and buttons should all be replaced by a DisplayTagData component */}
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