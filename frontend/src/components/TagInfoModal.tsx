import globalTheme from "../theme/theme";
import {Button, CircularProgress, Grid, Modal, Switch, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import React, {useEffect, useState} from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import {getAmountByTag} from "../features/words/wordSlice";
import {useDispatch, useSelector} from "react-redux";


interface FriendSearchModalProps {
    open: boolean
    setOpen: (value: boolean) => void
    tagId: string // this will eventually be a real ID, and we'll have to load the read tag data when opening this modal
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
    const {currentTagAmount, isTagSearchLoading} = useSelector((state: any) => state.words)
    const [isPublic, setIsPublic] = useState(true) // so Friends can see this tag on your profile and add it to their account

    const handleOnClose = () => {
        props.setOpen(false)
    }

    useEffect(() => {
        if(props.tagId!!){
            // @ts-ignore
            dispatch(getAmountByTag(props.tagId))
        }
    },[props.tagId])

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
                            <Typography
                                variant={"h3"}
                                display={{
                                    md: "inline"
                                }}
                            >
                                {props.tagId}
                            </Typography>
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
                                    {currentTagAmount} {(currentTagAmount > 1) ?"words" :"word"}
                                </Typography>
                            }
                        </Grid>
                        <Grid
                            item={true}
                            xs={12}
                        >
                            <FormControlLabel
                                value={isPublic}
                                control={<Switch checked={isPublic} color="primary" />}
                                label={"Public"}
                                labelPlacement={"end"}
                                onChange={() => setIsPublic(!isPublic)}
                                sx={{
                                    marginLeft: 0,
                                }}
                            />
                        </Grid>
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