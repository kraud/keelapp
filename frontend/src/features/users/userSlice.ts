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

export interface SearchUserQuery {
    nameOrUsernameMatch: string,
    searchOnlyFriends: boolean
    // TODO: as new filtering needs arise, add fields her
}

// TODO: add additional parameters to query, so we can specify query to filter by friends-only, not-yet-friends, etc.
export const searchUser = createAsyncThunk('auth/searchUser', async (query: SearchUserQuery, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await userService.getUsersByNameUsername(token, query)
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

export const getUserById = createAsyncThunk('auth/getUser', async (userId: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await userService.getUserByUserId(token, userId)
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
        resetUserSliceState: (state) => {
            state.isLoadingUser = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
        clearUserResultData: (state: any) => {
            return({
                ...state,
                userResult: initialState.userResult
            })
        },
    },
    extraReducers: (builder) => {
        builder
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
            .addCase(getUserById.pending, (state) => {
                state.isLoadingUser = true
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.isLoadingUser = false
                state.isSuccess = true
                state.userResult = action.payload
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.isLoadingUser = false
                state.isError = true
                state.message = action.payload as string
                state.userResult = []
            })
    }
})
export const {resetUserSliceState, clearUserResultData} = userSlice.actions
export default userSlice.reducer