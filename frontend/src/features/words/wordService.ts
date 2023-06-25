import {WordData} from "../../components/WordFormGeneric";
import axios from "axios";

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

const wordService = {
    createWord
}

export default wordService