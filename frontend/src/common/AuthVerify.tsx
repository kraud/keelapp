import React, { useEffect } from "react"
import { useLocation } from "react-router-dom"

const parseJwt = (token) => {
    try {
        return JSON.parse(window.atob(token.split(".")[1]))
    } catch (e) {
        return null
    }
}

interface AuthVerifyProps {
    onLogOut: () => void
}

const AuthVerify = (props: AuthVerifyProps) => {
    let location = useLocation()

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user")!)

        if (user) {
            const decodedJwt = parseJwt(user.token)

            if (decodedJwt.exp * 1000 < Date.now()) {
                props.onLogOut()
            }
        }
    }, [location, props])

    return(<></>)
}

export default AuthVerify