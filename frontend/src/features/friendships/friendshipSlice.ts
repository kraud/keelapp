import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {NotificationData} from "../../ts/interfaces";
import notificationService from "../notifications/notificationService";

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

// Get user friendships // TODO: change friendship from any to FriendshipData (must define inside interface.js)
export const createFriendship = createAsyncThunk('friendship/createFriendship', async (friendship: any, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        // TODO: implement friendshipService
        // return await friendshipService.createFriendship(friendship, token)
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
    }
})

export const {reset} = friendshipSlice.actions
export default friendshipSlice.reducer