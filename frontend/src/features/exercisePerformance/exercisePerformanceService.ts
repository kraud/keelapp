import axios from "axios"
import {PerformanceParameters} from "../../ts/interfaces";


const BE_URL = process.env.REACT_APP_VERCEL_BE_URL
const API_URL = (BE_URL!!) ? BE_URL+'/api/exercises' : '/api/exercises'

// Get exercises for users
const saveTranslationPerformance = async (performanceParameters: PerformanceParameters, token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            parameters: performanceParameters
        },
    }
    const response = await axios.get(`${API_URL}/saveTranslationPerformance`, config)
    return(response.data)
}

// Saves exercise result by id
const saveExerciseResult = async (performanceParameters: PerformanceParameters, token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            parameters: performanceParameters
        },
    }
    const response = await axios.get(`${API_URL}/saveExerciseResult`, config)
    return(response.data)
}

const exercisePerformanceService = {
    saveTranslationPerformance,
    saveExerciseResult
}

export default exercisePerformanceService