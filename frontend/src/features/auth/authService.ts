import axios from "axios"
import { toast } from "react-toastify"

const BE_URL = process.env.REACT_APP_VERCEL_BE_URL
const API_URL = (BE_URL!!) ?BE_URL+'/api/users' :'/api/users' // same as authSlice because they share controller

// Register user
const register = async (userData: any) => {
    const response = await axios.post(API_URL, userData)

    return response.data
}

// Login user
const login = async (userData: any) => {
    const response = await axios.post(API_URL+'/login', userData)

    if (response.data && response.data.verified) {
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
    const response = await axios.put(API_URL+'/updateUser', userData, config)

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

const validateUser = async(userId: string, tokenId: string) => {

    const response = await axios.get(`${API_URL}/${userId}/verify/${tokenId}`)
    
    toast.info(response.data.message)
    if(response.data.user){
        localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data.user
}

const updatePassword = async(data: any) => {
    const response = await axios.put(API_URL+"/updatePassword", data)
    return response.data
}

const requestPasswordResetToken =  async (userEmail: string) => {
    const response = await axios.post(API_URL+"/requestPasswordReset", {email: userEmail})
    return response.data
}

const authService = {
    register,
    logout,
    login,
    updateUser,
    validateUser,
    updatePassword,
    requestPasswordResetToken
}

export default authService