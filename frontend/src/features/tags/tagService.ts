import axios from "axios";

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

const tagService = {
    getUserTags
}

export default tagService