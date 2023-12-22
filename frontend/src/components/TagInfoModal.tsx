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


interface FriendSearchModalProps {
    open: boolean
    setOpen: (value: boolean) => void
    tagId: string | undefined // this will eventually be a real ID, and we'll have to load the read tag data when opening this modal

    currentTagData: TagData,
    // should this should be replaced by 'fullTagData'? => to avoid changing 'currentTagData' in props
    // updateTagFormData: (tagFormData: TagData) => void,
    displayOnly?: boolean,
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
    const { currentTagData } = props
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

    const validationSchema = Yup.object().shape({
        public: Yup.string().required("Required")
            .oneOf(['Public', 'Private', 'Friends-Only'], "Required"),
        label: Yup.string()
            .required("A tag label is required"),
        description: Yup.string().nullable()
            .min(5, 'Description must be longer than 2 characters')
            .max(250, 'Description is too long'),
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm<
        {
            public: 'Public' | 'Private' | 'Friends-Only',
            label: string,
            description: string,
        }
        >({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [tagPublic, setTagPublic] = useState<'Public' | 'Private' | 'Friends-Only'|"">("")

    const [tagLabel, setTagLabel] = useState("")
    const [tagDescription, setTagDescription] = useState("")

    useEffect(() => {
        // TODO: re-evaluate if props.updateTagFormData is needed? Could just use local state and if needed to reset => use props.currenTagData
        // props.updateTagFormData({
        //     author: 'asd',
        //     public: tagPublic as 'Public' | 'Private' | 'Friends-Only',
        //     label: tagLabel,
        //     description: tagDescription,
        //     completionState: isValid,
        //     isDirty: isDirty
        // })
    }, [tagPublic, tagLabel, tagDescription])

    // This will only be run on first render
    // we use it to populate the form fields with the previously added information
    useEffect(() => {
        if(currentTagData._id!!){
            setValue(
                'public',
                currentTagData.public,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setTagPublic(currentTagData.public as 'Public' | 'Private' | 'Friends-Only'|"")
            setValue(
                'label',
                currentTagData.label,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setTagLabel(currentTagData.label)
            setValue(
                'description',
                currentTagData.description,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setTagDescription(currentTagData.description)
        }
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
                        <Grid
                            item={true}
                            xs={12}
                        >
                            {(!isEditing)
                            ?
                                <Typography
                                    variant={"h3"}
                                    display={{
                                        md: "inline"
                                    }}
                                >
                                    {tagLabel}
                                </Typography>
                            :
                            <TextInputFormWithHook
                                control={control}
                                label={"Label"}
                                name={"label"}
                                defaultValue={""}
                                errors={errors.label}
                                onChange={(value: any) => {
                                    setTagLabel(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                            // <TextField
                            //     label={"Label"}
                            //     type={"text"}
                            //     fullWidth={true}
                            //     value={fullTagData.label}
                            //     onChange={(value) => {
                            //         setFullTagData({
                            //                 ...fullTagData,
                            //                 label: value.target.value,
                            //             })
                            //     }}
                            // />
                            }
                            {/* AMOUNT OF WORDS RELATED TO THIS TAG*/}
                            {(isTagSearchLoading)
                                ?
                                <CircularProgress
                                    sx={{
                                        marginLeft: {
                                            md: globalTheme.spacing(3)
                                        }
                                    }}
                                />
                                :
                                (!isEditing) &&
                                    <Typography
                                        variant={"h6"}
                                        display={{
                                            md: "inline"
                                        }}
                                        sx={{
                                            paddingLeft: {
                                                md: globalTheme.spacing(3)
                                            }
                                        }}
                                    >
                                        {((fullTagData.wordsId !== undefined))
                                            ? (fullTagData.wordsId.length > 1)
                                                ? `${fullTagData.wordsId.length} words`
                                                : `${fullTagData.wordsId.length} word`
                                            :""
                                        }
                                    </Typography>
                            }
                        </Grid>
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <RadioGroupWithHook
                                control={control}
                                label={"Public"}
                                name={"public"}
                                options={['Public', 'Private', 'Friends-Only']}
                                defaultValue={""}
                                errors={errors.public}
                                onChange={(value: any) => {
                                    setTagPublic(value)
                                }}
                                fullWidth={false}
                                disabled={props.displayOnly}
                            />
                        </Grid>
                        {(!isEditing)
                            ?
                            <Typography
                                variant={"h6"} // TODO: this should change depending on screen size (styling as well)
                                display={{
                                    md: "inline"
                                }}
                            >
                                {tagDescription}
                            </Typography>
                            :
                            <TextInputFormWithHook
                                control={control}
                                label={"Description"}
                                name={"description"}
                                defaultValue={""}
                                errors={errors.description}
                                onChange={(value: any) => {
                                    setTagDescription(value)
                                }}
                                fullWidth={true}
                                disabled={props.displayOnly}
                            />
                            // <TextField
                            //     label={"Description"}
                            //     type={"text"}
                            //     multiline
                            //     rows={3}
                            //     fullWidth={true}
                            //     value={fullTagData.description}
                            //     onChange={(value) => {
                            //         setFullTagData({
                            //             ...fullTagData,
                            //             description: value.target.value,
                            //         })
                            //     }}
                            // />
                        }
                        {/* TODO: add search words? */}
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