import React, {useEffect} from "react";
import {Typography} from "@mui/material";
import ResponsiveAppBar from "../components/Header";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

export function Dashboard() {
    const navigate = useNavigate()
    const {user} = useSelector((state: any) => state.auth)

    useEffect(() => {
        if(!user){
            navigate('/login')
        }
    }, [user, navigate])

    return(
        <>
            <ResponsiveAppBar/>
            <Typography
                variant={"h2"}
            >
                Dashboard
            </Typography>
        </>
    )
}

export default Dashboard