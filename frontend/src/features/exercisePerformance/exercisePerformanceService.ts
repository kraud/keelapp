import axios from "axios"
import {PerformanceActionParameters, PerformanceParameters} from "../../ts/interfaces";


const BE_URL = process.env.REACT_APP_VERCEL_BE_URL
const API_URL = (BE_URL!!) ? BE_URL+'/api/exercises' : '/api/exercises'

// Get exercises for users
const saveTranslationPerformance = async (performanceParameters: PerformanceParameters, token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(`${API_URL}/saveTranslationPerformance`, performanceParameters, config)
    return(response.data)
}


const savePerformanceAction = async (performanceParameters: PerformanceActionParameters, token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }
    const response = await axios.post(`${API_URL}/savePerformanceAction`, performanceParameters, config)
    return(response.data)
}

const exercisePerformanceService = {
    saveTranslationPerformance,
    savePerformanceAction
}

export default exercisePerformanceService