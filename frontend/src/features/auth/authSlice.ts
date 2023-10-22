import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import authService from "./authService";
import {IFormInput} from "../../pages/Register";
import {SearchResult} from "../../ts/interfaces";

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user')! )

interface UserSliceState {
    user: any,
    userList: SearchResult[]

    isError: boolean,
    isSuccess: boolean,
    isLoading: boolean,
    message: string,
}

const initialState: UserSliceState = {
    user: user ? user : null,
    userList: [],

    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
}

// Register user
export const register = createAsyncThunk('auth/register', async (user: IFormInput, thunkAPI) => {
    try {
        return await authService.register(user)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }

})

// Login user
export const login = createAsyncThunk('auth/login', async (user: any, thunkAPI) => {
    try {
        return await authService.login(user)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }

})

// Update user
export const updateUser = createAsyncThunk('auth/updateUser', async (user: any, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        console.log("thunkAPI.getState()")
        console.log(thunkAPI.getState())
        console.log("token")
        console.log(token)
        return await authService.updateUser(token, user)
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

export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout()
})

export const searchUser = createAsyncThunk('auth/searchUser', async (query: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await authService.getUsersBy(token, query)
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

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetState: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
                state.user = null
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
                state.user = null
            })
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = {
                    ...action.payload,
                    token: state.user.token
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
                state.user = null
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })
            .addCase(searchUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(searchUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.userList = action.payload
            })
            .addCase(searchUser.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
                state.userList = []
            })
    }
})
export const {resetState} = authSlice.actions
export default authSlice.reducer