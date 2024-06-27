import axios from "axios";
import {WordData, WordDataBE} from "../../ts/interfaces";

const BE_URL = process.env.REACT_APP_VERCEL_BE_URL
const API_URL = (BE_URL!!) ?BE_URL :"" +'/api/words/'

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

const deleteManyWordsById = async (token: any, wordsId: string[]) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            wordsId: wordsId,
        }
    }
    const response = await axios.delete(`${API_URL}/deleteMany`, config)
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

const wordService = {
    createWord, getWords, getWordsSimplified, getWordById, updateWordById, deleteWordById,
    searchWord, deleteManyWordsById
}

export default wordService
