import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import notificationService from "./notificationService";
import {NotificationData} from "../../ts/interfaces";

interface notificationSliceState {
    notifications: any[],
    isError: boolean,
    isSuccess: boolean,
    isLoading: boolean,
    message: string,
}

const initialState: notificationSliceState = {
    notifications: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
}

// Get user words
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

// Get user words
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

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        reset: (state: any) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotifications.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.notifications = (action.payload)
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
            })
    }
})

export const {reset} = notificationSlice.actions
export default notificationSlice.reducer