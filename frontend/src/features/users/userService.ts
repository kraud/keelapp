import axios from "axios"

const API_URL = '/api/users/' // same as authSlice because they share controller


const getUsernamesByUserIds = async (token: any, ids: string[]) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            query: ids,
        }
    }
    const response = await axios.get(`${API_URL}/getUsernames`, config)
    return(response.data)
}

// Get users by name or username
const getUsersByNameUsername = async (token: any, query: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            query: query,
        }
    }
    const response = await axios.get(`${API_URL}/searchUser`, config)
    return(response.data)
}

// Get users by user ID
const getUserByUserId = async (token: any, userId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }
    const response = await axios.get(`${API_URL}/getUser/${userId}`, config)
    return(response.data)
}

const userService = {
    getUsernamesByUserIds,
    getUsersByNameUsername,
    getUserByUserId
}

export default userService