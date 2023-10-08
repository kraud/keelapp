import globalTheme from "../theme/theme";
import {Grid, Modal, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";


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
                        container={true}
                        rowSpacing={2}
                        sx={{
                            // marginTop: globalTheme.spacing(1)
                        }}
                    >
                        <Grid
                            item={true}
                        >
                            <Typography
                                variant={"h4"}
                            >
                                {props.tagId}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

        </Modal>
    )
}