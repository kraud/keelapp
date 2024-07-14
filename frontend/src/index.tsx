import React from 'react'
import {createRoot} from "react-dom/client"
import { Provider } from 'react-redux'
import {store} from "./app/store"
import App from "./App"
import globalTheme from "./theme/theme"
import { ThemeProvider } from "@mui/material"
import { BrowserRouter as Router} from 'react-router-dom'

const container: any = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider
                theme={globalTheme}
            >
                <Router>
                    <App/>
                </Router>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
)
