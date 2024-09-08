import axios from "axios"

const BE_URL = process.env.REACT_APP_VERCEL_BE_URL
const API_URL = (BE_URL!!) ? BE_URL+'/api/users' : '/api/users'

// Get users by user ID
const getUserMetrics = async (token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }
    const response = await axios.get(`${API_URL}/getUserMetrics`, config)
    return(response.data)
}

const metricService = {
    getUserMetrics
}

export default metricService