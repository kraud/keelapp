import axios from "axios";
import {NotificationData} from "../../ts/interfaces";

const BE_URL = process.env.REACT_APP_VERCEL_BE_URL
const API_URL = (BE_URL!!) ?BE_URL+'/api/notifications' :'/api/notifications'

const createNotification = async (notification: NotificationData, token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL, notification, config)
    return(response.data)
}

const getNotifications = async (token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL+'/getNotifications', config)
    return(response.data)
}

const getRequesterNotifications = async (token: any) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL+'/getRequesterNotifications', config)
    return(response.data)
}

const deleteNotificationById = async (token: any, id: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.delete(`${API_URL}/${id}`, config)
    return(response.data)
}

const updateNotificationById = async (token: any, updatedData: NotificationData) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.put(`${API_URL}/${updatedData._id}`, updatedData, config)
    return(response.data)
}

const notificationService = {
    getNotifications, createNotification, deleteNotificationById, updateNotificationById, getRequesterNotifications
}

export default notificationService