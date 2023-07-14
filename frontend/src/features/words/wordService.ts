import axios from "axios";
import {WordData} from "../../ts/interfaces";

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
const getWordsSimplified = async (token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(`${API_URL}/simple`, config)
    return(response.data)
}

const wordService = {
    createWord, getWords, getWordsSimplified
}

export default wordService