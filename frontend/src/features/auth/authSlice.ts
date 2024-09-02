import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import authService from "./authService";
import {UserRegisterData} from "../../pages/Register";
import {UserPasswordData} from "../../pages/ResetPassword";
import { toast } from "react-toastify";

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user')! )

interface AuthSliceState {
    user: any, // TODO: define user interface/type and use it here.

    isError: boolean,
    isSuccess: boolean,
    isLoadingAuth: boolean,
    message: string,
}

const initialState: AuthSliceState = {
    user: user ? user : null,

    isError: false,
    isSuccess: false,
    isLoadingAuth: false,
    message: "",
}

// Register user
export const register = createAsyncThunk('auth/register', async (user: UserRegisterData, thunkAPI) => {
    try {
        let userNew = await authService.register(user)

        toast.info("We sent an email to " + userNew.email + ". Please open it, to verify your account.")

    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }

})

// Login user
export const login = createAsyncThunk('auth/login', async (user: any, thunkAPI) => {
    try {
        let userLogin = await authService.login(user)
        if(userLogin.verified) {
            return userLogin
        } else {
            // TODO: Agregar boton para reenviar (Ver addWord). 
            toast.info("You need to verify your account");
        }
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

export const verifyUser = createAsyncThunk('auth/verifyUser', async (data: {userId: string, tokenId: string}, thunkAPI) =>{
    try {
        return await authService.validateUser(data.userId, data.tokenId)
        
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

export const updatePassword = createAsyncThunk('auth/updatePassword', async (data: UserPasswordData, thunkAPI) =>{
    try {
        return await authService.updatePassword(data)
        
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

export const requestPasswordResetToken = createAsyncThunk('auth/requestPasswordResetToken', async (email: string, thunkAPI) =>{
    try {
        return await authService.requestPasswordResetToken(email)
        
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
            state.isLoadingAuth = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoadingAuth = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoadingAuth = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoadingAuth = false
                state.isError = true
                state.message = action.payload as string
                state.user = null
            })
            .addCase(login.pending, (state) => {
                state.isLoadingAuth = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoadingAuth = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoadingAuth = false
                state.isError = true
                state.message = action.payload as string
                state.user = null
            })
            .addCase(updateUser.pending, (state) => {
                state.isLoadingAuth = true
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoadingAuth = false
                state.isSuccess = true
                state.user = {
                    ...action.payload,
                    token: state.user.token
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoadingAuth = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })
            .addCase(verifyUser.pending, (state) => {
                state.isLoadingAuth = true
            })
            .addCase(verifyUser.fulfilled, (state, action) => {
                state.isLoadingAuth = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(verifyUser.rejected, (state, action) => {
                state.isLoadingAuth = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(updatePassword.pending, (state) => {
                state.isLoadingAuth = true
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.isLoadingAuth = false
                state.isSuccess = true
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.isLoadingAuth = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(requestPasswordResetToken.pending, (state) => {
                state.isLoadingAuth = true
            })
            .addCase(requestPasswordResetToken.fulfilled, (state, action) => {
                state.isLoadingAuth = false
                state.isSuccess = true
            })
            .addCase(requestPasswordResetToken.rejected, (state, action) => {
                state.isLoadingAuth = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload as string
            })
    }
})
export const {resetState} = authSlice.actions
export default authSlice.reducer