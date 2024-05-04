import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {FriendshipData} from "../../ts/interfaces";
import friendshipService from "./friendshipService";

interface friendshipSliceState {
    friendships: any[],
    isError: boolean,
    isSuccessFriendships: boolean,
    isLoadingFriendships: boolean,
    message: string,
}

const initialState: friendshipSliceState = {
    friendships: [],
    isError: false,
    isSuccessFriendships: false,
    isLoadingFriendships: false,
    message: "",
}

// Get user friendships
export const createFriendship = createAsyncThunk('friendship/createFriendship', async (friendship: FriendshipData, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await friendshipService.createFriendship(friendship, token)
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

// Get user's friendships
export const getFriendshipsByUserId = createAsyncThunk('friendships/getAllFriendships', async (userId: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await friendshipService.getFriendships(token, userId)
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

export const deleteFriendship = createAsyncThunk(`friendships/deleteFriendshipById`, async (friendshipId: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await friendshipService.deleteFriendshipById(token, friendshipId)
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

export const deleteFriendshipRequestAndNotification = createAsyncThunk(`friendships/deleteFriendshipRequest`, async (friendshipId: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await friendshipService.deleteFriendshipRequest(token, friendshipId)
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

// Update a friendship data by its id
export const updateFriendship = createAsyncThunk(`friendship/updateFriendshipById`, async (updatedData: FriendshipData, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await friendshipService.updateFriendshipById(token, updatedData)
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

export const friendshipSlice = createSlice({
    name: 'friendship',
    initialState,
    reducers: {
        reset: (state: any) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createFriendship.pending, (state) => {
                state.isLoadingFriendships = true
            })
            .addCase(createFriendship.fulfilled, (state, action) => {
                state.isLoadingFriendships = false
                state.isSuccessFriendships = true
                // TODO: should we retrieve/store the recently-created-friendship-data separately?
                //  use it to update the local list of friendships? or get the full list again from BE?
            })
            .addCase(createFriendship.rejected, (state, action) => {
                state.isLoadingFriendships = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(deleteFriendship.pending, (state) => {
                state.isLoadingFriendships = true
            })
            .addCase(deleteFriendship.fulfilled, (state, action) => {
                state.isLoadingFriendships = false
                state.isSuccessFriendships = true
                // TODO: should we retrieve/store the recently-deleted-friendship-data separately?
                //  use it to update the local list of friendships? or get the full list again from BE?
            })
            .addCase(deleteFriendship.rejected, (state, action) => {
                state.isLoadingFriendships = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(updateFriendship.pending, (state) => {
                state.isLoadingFriendships = true
            })
            .addCase(updateFriendship.fulfilled, (state, action) => {
                state.isLoadingFriendships = false
                state.isSuccessFriendships = true
                // TODO: should we retrieve/store the recently-updated-friendship-data separately?
                //  use it to update the local list of friendships? or get the full list again from BE?
            })
            .addCase(updateFriendship.rejected, (state, action) => {
                state.isLoadingFriendships = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(getFriendshipsByUserId.pending, (state) => {
                state.isLoadingFriendships = true
            })
            .addCase(getFriendshipsByUserId.fulfilled, (state, action) => {
                state.isLoadingFriendships = false
                state.isSuccessFriendships = true
                state.friendships = (action.payload)
            })
            .addCase(getFriendshipsByUserId.rejected, (state, action) => {
                state.isLoadingFriendships = false
                state.isError = true
                state.message = action.payload as string
            })
    }
})

export const {reset} = friendshipSlice.actions
export default friendshipSlice.reducer