import {Route, Routes, useLocation} from "react-router-dom";
import Dashboard from "../Dashboard";
import AddWord from "../AddWord";
import {Review} from "../Review";
import Login from "../Login";
import Register from "../Register";
import React from "react";
import {DisplayWord} from "../DisplayWord";
import {Account} from "../Account";
import {NotificationHub} from "../NotificationHub";
import {DisplayTag} from "../DisplayTag";
import {checkEnvironmentAndIterationToDisplay} from "../../components/forms/commonFunctions";

export const routeVariantsAnimation = {
    initial: {
        y: '100vh'
    },
    final: {
        y: '0vh',
        transition: {
            type: "spring",
            mass: 0.4,
        },
    },
}
export const childVariantsAnimation = {
    initial: {
        opacity: 0,
        y: "50px",
    },
    final: {
        opacity: 1,
        y: "0px",
        transition: {
            duration: 0.5,
            delay: 0.25,
        },
    },
}

export function RoutesWithAnimation() {
    const location = useLocation()

    return (
        <Routes location={location} key={location.key}>
            <Route
                path='/'
                element={
                    <Dashboard/>
                }
            />
            <Route
                path='/addWord'
                element={
                    <AddWord/>
                }
            />
            {(checkEnvironmentAndIterationToDisplay(3)) &&
                <Route
                    path='/review/:filtersURL?'
                    element={
                        <Review/>
                    }
                />
            }
            <Route
                path='/login'
                element={
                    <Login/>
                }
            />
            <Route
                path='/register'
                element={
                    <Register/>
                }
            />
            {(checkEnvironmentAndIterationToDisplay(3)) &&
                <Route
                     // TODO: should we reverse this to: '/user/notifications/:userId' ?
                    path='/user/:userId?/notifications'
                    element={
                        <NotificationHub/>
                    }
                />
            }
            <Route
                path='/user'
                element={
                    <Account/>
                }
            />
            <Route
                path='/word/:wordId?'
                element={
                    <DisplayWord defaultDisabled={true}/>
                }
            />
            {(checkEnvironmentAndIterationToDisplay(2)) &&
                <Route
                    path='/tag/:tagId?'
                    element={
                        <DisplayTag defaultDisabled={true}/>
                    }
                />
            }
            {/* TODO: add 404 page */}
        </Routes>
    );
}