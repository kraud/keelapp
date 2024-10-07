import axios from "axios"

const BE_URL = process.env.REACT_APP_VERCEL_BE_URL
const API_URL = (BE_URL!!) ? BE_URL+'/api/exercises' : '/api/exercises'

// Get exercises for users
const getUserExercises = async (exerciseParameters: any, token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            parameters: exerciseParameters
        },
    }
    const response = await axios.get(`${API_URL}/getUserExercises`, config)
    return(response.data)
}

const exerciseService = {
    getUserExercises
}

export default exerciseService