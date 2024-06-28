import axios from "axios";
import {TagData} from "../../ts/interfaces";
import {AddTagsToWordsData} from "./tagSlice";

const BE_URL = process.env.REACT_APP_VERCEL_BE_URL
const API_URL = (BE_URL!!) ?BE_URL+'/api/tags' :'/api/tags'

const getUserTags = async (token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL+'/getTags', config)
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
    const response = await axios.get(API_URL+'/getOtherUserTags', config)
    return(response.data)
}

const getFollowedTagsByUserId = async (token: any, userId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            userId: userId
        }
    }
    const response = await axios.get(API_URL+'/getFollowedTagsIdByUserId', config)
    return(response.data)
}

const searchTags = async (token: any, query: string, includeOtherUsersTags?: boolean) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            query: query,
            // NB! this will be sent as string, NOT boolean
            includeOtherUsersTags: includeOtherUsersTags!!,
        }
    }
    const response = await axios.get(API_URL+'/searchTags', config)
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
    return(response.data)
}

const checkIfTagLabelAvailable = async (labelUserData: {tagLabel: string, userId: string}, token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL+'/checkIfTagLabelAvailable', labelUserData, config)
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

const addTagsInBulkToWords = async (token: any, newTagAndWordData: AddTagsToWordsData) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL+'/addTagInBulkToWords', newTagAndWordData, config)
    return(response.data)
}

const getTagWordsAmount = async (token: any, id: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(`${API_URL}/getAmountByTag/${id}`, config)
    return(response.data)
}

const filterTags = async (token: any, request: TagData) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            _id: request._id,
            author: request.author,
            label: request.label,
            description: request.description,
            public: request.public,
        }
    }
    const response = await axios.get(API_URL+'/filterTags', config)
    return(response.data)
}

const addExternalTag = async (token: any, tagId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const data = {
        tagId: tagId
    }
    const response = await axios.post(API_URL+'/addExternalTag', data, config)
    return(response.data)
}

const followTagByAnotherUser = async (token: any, data: {tagId: string, userId: string}) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL+'/followTag', data, config)
    return(response.data)
}

const unfollowTagByAnotherUser = async (token: any, data: {tagId: string, userId: string}) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            userId: data.userId,
        }
    }
    const response = await axios.delete(`${API_URL}/unfollowTag/${data.tagId}`, config)
    return(response.data)
}

const tagService = {
    getUserTags, searchTags, getTagById, createTag, deleteTagById, updateTagById, getTagWordsAmount, getOtherUserTags,
    filterTags, addExternalTag, checkIfTagLabelAvailable, addTagsInBulkToWords, followTagByAnotherUser,
    getFollowedTagsByUserId, unfollowTagByAnotherUser
}

export default tagService