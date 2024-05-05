import axios from "axios";
import {FriendshipData,} from "../../ts/interfaces";

const API_URL = '/api/friendships/'

const createFriendship = async (friendship: FriendshipData, token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL, friendship, config)
    return(response.data)
}

// NB! userId can be the currently-logged-in user OR any other user
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

const deleteFriendshipRequest = async (token: any, id: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.delete(`${API_URL}/deleteRequestAndNotifications/${id}`, config)
    return(response.data)
}

const acceptFriendshipRequest = async (token: any, id: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    // NB! update data is 'undefined' because we don't have info to update. We simply changed friendship to accepted.
    const response = await axios.put(`${API_URL}/acceptRequestAndDeleteNotifications/${id}`, {status: 'accepted'}, config)
    return(response.data)
}

const updateFriendshipById = async (token: any, updatedData: FriendshipData) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.put(`${API_URL}/${updatedData._id}`, updatedData, config)
    return(response.data)
}

const friendshipService = {
    createFriendship, getFriendships, deleteFriendshipById, updateFriendshipById, deleteFriendshipRequest, acceptFriendshipRequest
}

export default friendshipService