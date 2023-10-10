import axios from "axios";
import {WordData, WordDataBE} from "../../ts/interfaces";

const API_URL = '/api/words/'

const createWord = async (word: WordData, token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL, word, config)
    return(response.data)
}

const getWords = async (token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL, config)
    return(response.data)
}

const getWordsSimplified = async (token: any, query: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            filters: query,
        }
    }
    const response = await axios.get(`${API_URL}/simple`, config)
    return(response.data)
}

const getWordById = async (token: any, id: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(`${API_URL}/${id}`, config)
    return(response.data)
}

const deleteWordById = async (token: any, id: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.delete(`${API_URL}/${id}`, config)
    return(response.data)
}

const updateWordById = async (token: any, updatedData: WordDataBE) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.put(`${API_URL}/${updatedData.id}`, updatedData, config)
    return(response.data)
}

const searchWord = async (token: any, query: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            query: query,
        }
    }
    const response = await axios.get(`${API_URL}/searchWord`, config)
    return(response.data)
}

const searchTag = async (token: any, query: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            query: query,
        }
    }
    const response = await axios.get(`${API_URL}/searchTag`, config)
    return(response.data)
}

const getAmountByTag = async (token: any, query: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            query: query,
        }
    }
    const response = await axios.get(`${API_URL}/getAmountByTag`, config)
    return(response.data)
}

const wordService = {
    createWord, getWords, getWordsSimplified, getWordById, updateWordById, deleteWordById, searchWord, searchTag, getAmountByTag
}

export default wordService
