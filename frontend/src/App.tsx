import React from 'react';
import {Button, Container, CssBaseline, Typography} from '@mui/material';

function App() {
    return (
        <>
            <CssBaseline />
            <Container maxWidth={false}>
                <Typography
                    variant={"newVariant"}
                >
                    Variant text
                </Typography>
                <Button
                    variant={"contained"}
                    color={"customColor"}
                >
                    Testing
                </Button>
            </Container>
        </>
    );
}

export default App;