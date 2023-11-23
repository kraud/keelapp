import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import {SearchResult} from "../../ts/interfaces";


interface UserSliceState {
    userList: SearchResult[]

    isError: boolean,
    isSuccess: boolean,
    isLoading: boolean,
    message: string,
}

const initialState: UserSliceState = {
    userList: [],

    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
}

// TODO: implement get usernames by userIds array

export const userSlice = createSlice({
    name: 'user',
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

    }
})
export const {resetState} = userSlice.actions
export default userSlice.reducer