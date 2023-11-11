import axios from "axios";
import {NotificationData, WordDataBE} from "../../ts/interfaces";

const API_URL = '/api/friendships/'

const createFriendship = async (friendship: NotificationData, token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL, friendship, config)
    return(response.data)
}

// NB! userId can be the currently-logged-in user or any other user
// (this way we get to use the same endpoint for many use cases)
const getFriendships = async (token: any, userId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            userId: userId,
        }
    }
    const response = await axios.get(API_URL+'getFriendships', config)
    return(response.data)
}

const deleteFriendshipById = async (token: any, id: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.delete(`${API_URL}/${id}`, config)
    return(response.data)
}

// TODO: create data type for updatedData
const updateFriendshipById = async (token: any, updatedData: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.put(`${API_URL}/${updatedData.id}`, updatedData, config)
    return(response.data)
}

const friendshipService = {
    createFriendship, getFriendships, deleteFriendshipById, updateFriendshipById
}

export default friendshipService