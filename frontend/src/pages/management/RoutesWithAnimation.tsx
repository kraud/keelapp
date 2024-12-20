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
import NotFound from "../NotFound";
import {VerificationUser} from "../VerificationUser";
import {ResetPassword} from "../ResetPassword";
import {Practice} from "../Practice";

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


interface RoutesWithAnimationProps {
    onRenderNotFound: (userExist: boolean) => void
}

export function RoutesWithAnimation(props: RoutesWithAnimationProps) {
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
                path='/addWord/:partOfSpeech?'
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
            <Route
                path='/practice'
                element={
                    <Practice/>
                }
            />
            <Route
                path='/resetPassword/:userId?/:tokenId?'
                element={
                    <ResetPassword/>
                }
            />
            <Route
                 // TODO: should we reverse this to: '/user/notifications/:userId' ?
                path='/user/:userId?/notifications'
                element={
                    <NotificationHub/>
                }
            />
            <Route
                path='/user'
                element={
                    <Account/>
                }
            />
            <Route 
                path="/user/:userId?/verify/:tokenId?"
                element={
                    <VerificationUser/>
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
            <Route
                path='*'
                element={
                    <NotFound
                        onHideHeader={(userExist: boolean) => props.onRenderNotFound(userExist)}
                    />
                }
            />
        </Routes>
    );
}