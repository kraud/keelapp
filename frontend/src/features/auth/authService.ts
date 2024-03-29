import axios from "axios"

const API_URL = '/api/users/'

// Register user
const register = async (userData: any) => {
    const response = await axios.post(API_URL, userData)

    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

// Login user
const login = async (userData: any) => {
    const response = await axios.post(API_URL+'login', userData)

    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

// Update user
const updateUser = async (token: any, userData: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.put(API_URL+'updateUser', userData, config)

    if(response.data) {
        localStorage.removeItem('user')
        localStorage.setItem('user', JSON.stringify({...response.data, token: token}))
    }

    return response.data
}

// Logout user
const logout = () => {
    localStorage.removeItem('user')
}

const authService = {
    register,
    logout,
    login,
    updateUser,
}

export default authService