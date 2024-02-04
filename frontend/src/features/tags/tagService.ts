import axios from "axios";
import {TagData} from "../../ts/interfaces";

const API_URL = '/api/tags/'

const getUserTags = async (token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL+'getTags', config)
    return(response.data)
}

const getOtherUserTags = async (token: any, otherUserId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            otherUserId: otherUserId
        }
    }
    const response = await axios.get(API_URL+'getOtherUserTags', config)
    return(response.data)
}

const searchTags = async (token: any, query: string, includeOtherUsersTags?: boolean) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            query: query,
            includeOtherUsersTags: includeOtherUsersTags,
        }
    }
    const response = await axios.get(`${API_URL}/searchTags`, config)
    return(response.data)
}

const getTagById = async (token: any, id: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(`${API_URL}/${id}`, config)
    return(response.data)
}

const createTag = async (tag: TagData, token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL, tag, config)
    // NOT WORKING
    //     .then((info) => {
    //     // call to create tagWord
    //     console.log('info.data from frontend response:', info.data)
    //     return(info.data)
    // })
    // const response = await axios.post(API_URL, tag, config)
    return(response.data)
}

const deleteTagById = async (token: any, id: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.delete(`${API_URL}/${id}`, config)
    return(response.data)
}

const updateTagById = async (token: any, updatedData: TagData) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.put(`${API_URL}/${updatedData._id}`, updatedData, config)
    return(response.data)
}

const getTagWordsAmount = async (token: any, id: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(`${API_URL}getAmountByTag/${id}`, config)
    return(response.data)
}

const tagService = {
    getUserTags, searchTags, getTagById, createTag, deleteTagById, updateTagById, getTagWordsAmount, getOtherUserTags
}

export default tagService