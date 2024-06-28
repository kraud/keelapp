import axios from "axios"
import {SearchUserQuery} from "./userSlice";

const BE_URL = process.env.REACT_APP_VERCEL_BE_URL
const API_URL = (BE_URL!!) ?BE_URL+'/api/users/' :'/api/users/' // same as authSlice because they share controller

// Get users by name or username
const getUsersByNameUsername = async (token: any, query: SearchUserQuery) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            ...query
        }
    }
    const response = await axios.get(`${API_URL}searchUser`, config)
    return(response.data)
}

// Get users by user ID
const getUserByUserId = async (token: any, userId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }
    const response = await axios.get(`${API_URL}getUser/${userId}`, config)
    return(response.data)
}

const userService = {
    getUsersByNameUsername,
    getUserByUserId
}

export default userService