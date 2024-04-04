import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";

interface LinearIndeterminateProps {
    sxProps?: SxProps<Theme>,
}

export default function LinearIndeterminate(props: LinearIndeterminateProps) {
    return (
        <Box sx={{
            width: '100%',
            ...props.sxProps
        }}>
            <LinearProgress />
        </Box>
    );
}