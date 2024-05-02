import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import notificationService from "./notificationService";
import {NotificationData} from "../../ts/interfaces";

interface notificationSliceState {
    notifications: any[],
    notificationResponse: any[], // when sending a notification, if successfully created, they will be stored here
    isError: boolean,
    isSuccessNotifications: boolean,
    isLoadingNotifications: boolean,
    message: string,
}

const initialState: notificationSliceState = {
    notifications: [],
    notificationResponse: [],
    isError: false,
    isSuccessNotifications: false,
    isLoadingNotifications: false,
    message: "",
}

// Get notifications by its userID
export const getNotifications = createAsyncThunk('notifications/getAllNotifications', async (_, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await notificationService.getNotifications(token)
    } catch(error: any) {
        const message = (
                error.response &&
                error.response.data &&
                error.response.data.message
            )
            || error.message
            || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Create a new notification
export const createNotification = createAsyncThunk('notifications/createNotification', async (notification: NotificationData, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await notificationService.createNotification(notification, token)
    } catch(error: any) {
        const message = (
                error.response &&
                error.response.data &&
                error.response.data.message
            )
            || error.message
            || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Update a notification data by its id
export const updateNotification = createAsyncThunk(`notifications/updateNotificationById`, async (updatedData: NotificationData, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await notificationService.updateNotificationById(token, updatedData)
    } catch(error: any) {
        const message = (
                error.response &&
                error.response.data &&
                error.response.data.message
            )
            || error.message
            || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Delete a notification data by its id
export const deleteNotification = createAsyncThunk(`notifications/deleteNotificationById`, async (notificationId: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await notificationService.deleteNotificationById(token, notificationId)
    } catch(error: any) {
        const message = (
                error.response &&
                error.response.data &&
                error.response.data.message
            )
            || error.message
            || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        reset: (state: any) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotifications.pending, (state) => {
                state.isLoadingNotifications = true
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.isLoadingNotifications = false
                state.isSuccessNotifications = true
                state.notifications = (action.payload)
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.isLoadingNotifications = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(createNotification.pending, (state) => {
                state.isLoadingNotifications = true
            })
            .addCase(createNotification.fulfilled, (state, action) => {
                state.isLoadingNotifications = false
                state.isSuccessNotifications = true
                state.notificationResponse = [action.payload]
            })
            .addCase(createNotification.rejected, (state, action) => {
                state.isLoadingNotifications = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(updateNotification.pending, (state) => {
                state.isLoadingNotifications = true
            })
            .addCase(updateNotification.fulfilled, (state) => {
                state.isLoadingNotifications = false
                state.isSuccessNotifications = true
            })
            .addCase(updateNotification.rejected, (state, action) => {
                state.isLoadingNotifications = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(deleteNotification.pending, (state) => {
                state.isLoadingNotifications = true
            })
            .addCase(deleteNotification.fulfilled, (state) => {
                state.isLoadingNotifications = false
                state.isSuccessNotifications = true
            })
            .addCase(deleteNotification.rejected, (state, action) => {
                state.isLoadingNotifications = false
                state.isError = true
                state.message = action.payload as string
            })
    }
})

export const {reset} = notificationSlice.actions
export default notificationSlice.reducer