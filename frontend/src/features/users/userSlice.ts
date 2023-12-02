import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import {SearchResult} from "../../ts/interfaces";
import userService from "./userService";


interface UserSliceState {
    userList: SearchResult[],
    userResult: any,

        isError: boolean,
    isSuccess: boolean,
    isLoadingUser: boolean,
    message: string,
}

const initialState: UserSliceState = {
    userList: [],
    userResult: undefined,

    isError: false,
    isSuccess: false,
    isLoadingUser: false,
    message: "",
}

export const getUsernamesByIds = createAsyncThunk('auth/getUsernames', async (ids: string[], thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await userService.getUsernamesByUserIds(token, ids)
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

export const searchUser = createAsyncThunk('auth/searchUser', async (query: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await userService.getUsersBy(token, query)
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

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetState: (state) => {
            state.isLoadingUser = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsernamesByIds.pending, (state) => {
                state.isLoadingUser = true
            })
            .addCase(getUsernamesByIds.fulfilled, (state, action) => {
                state.isLoadingUser = false
                state.isSuccess = true
                state.userList = action.payload
            })
            .addCase(getUsernamesByIds.rejected, (state, action) => {
                state.isLoadingUser = false
                state.isError = true
                state.message = action.payload as string
                state.userList = []
            })
            .addCase(searchUser.pending, (state) => {
                state.isLoadingUser = true
            })
            .addCase(searchUser.fulfilled, (state, action) => {
                state.isLoadingUser = false
                state.isSuccess = true
                state.userList = action.payload
            })
            .addCase(searchUser.rejected, (state, action) => {
                state.isLoadingUser = false
                state.isError = true
                state.message = action.payload as string
                state.userList = []
            })
    }
})
export const {resetState} = userSlice.actions
export default userSlice.reducer