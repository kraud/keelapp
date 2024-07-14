import React from 'react'
import {Container, CssBaseline} from '@mui/material'
import {ToastContainer} from "react-toastify";
import {MainView} from "./pages/management/MainView";

function App() {
    return (
        <>
            <CssBaseline />
                <Container>
                    <MainView/>
                </Container>
            <ToastContainer/>
        </>
    )
}

export default App