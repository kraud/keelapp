import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { useSelector } from "react-redux";
import { verifyUser } from "../features/auth/authSlice";

interface RouteVerificationUserProps{
    userId: string,
    tokenId: string
}

interface VerificationUserProps{

}

export const VerificationUser = (props: VerificationUserProps) => {

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>()
    // @ts-ignore
    const {userId, tokenId } = useParams<RouteVerificationUserProps>()

    const {user, isLoadingAuth, isError, isSuccess, message} = useSelector((state: any) => state.auth)


    useEffect(() => {
        if(isSuccess || user){
            navigate("/")
        }
        if(userId === undefined || tokenId === undefined){
            navigate("/")
        }
        else{
            dispatch(verifyUser({userId: userId, tokenId: tokenId}))
        }
    
    }, [user, isError, isSuccess, message, navigate, dispatch])

    return (<></>)

}

export default VerificationUser