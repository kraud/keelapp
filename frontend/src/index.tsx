import React, {Suspense} from 'react'
import {createRoot} from "react-dom/client"
import { Provider } from 'react-redux'
import {store} from "./app/store"
import App from "./App"
import globalTheme from "./theme/theme"
import { ThemeProvider } from "@mui/material"
import { BrowserRouter as Router} from 'react-router-dom'
// import i18n (needs to be bundled)
import './i18n'
import LoadingScreen from "./pages/LoadingScreen";

const container: any = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider
                theme={globalTheme}
            >
                <Router>
                    <Suspense
                        fallback={
                            <LoadingScreen/>
                        }
                    >
                        <App/>
                    </Suspense>
                </Router>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
)
