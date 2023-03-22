import React from 'react'
import {Button, Container, CssBaseline, Typography} from '@mui/material'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import {ToastContainer} from "react-toastify";

function App() {
    return (
        <>
            <CssBaseline />
            <Router>
                <Container>
                    <Routes>
                        <Route
                            path='/'
                            element={<Dashboard/>}
                        />
                        <Route
                            path='/login'
                            element={<Login/>}
                        />
                        <Route
                            path='/register'
                            element={<Register/>}
                        />
                    </Routes>
                </Container>
            </Router>
            <ToastContainer/>
        </>
    );
}

export default App;