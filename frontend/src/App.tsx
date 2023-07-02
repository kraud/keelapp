import React from 'react'
import {Container, CssBaseline} from '@mui/material'
import { BrowserRouter as Router} from 'react-router-dom'
import {ToastContainer} from "react-toastify";
import {MainView} from "./pages/management/MainView";

function App() {
    return (
        <>
            <CssBaseline />
            <Router>
                <Container>
                    <MainView/>
                </Container>
            </Router>
            <ToastContainer/>
        </>
    );
}

export default App;