import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import metricService from "./metricService";

interface MetricSliceState {
    isError: boolean,
    isSuccess: boolean,
    isLoadingUser: boolean,
    message: string,
}

const initialState: MetricSliceState = {
    isError: false,
    isSuccess: false,
    isLoadingUser: false,
    message: "",
}

export const getUserMetrics = createAsyncThunk('user/getUserMetrics', async (_, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await metricService.getUserMetrics(token)
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

export const metricSlice = createSlice({
    name: 'metric',
    initialState,
    reducers: {
        resetMetricSliceState: (state) => {
            state.isLoadingUser = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserMetrics.pending, (state) => {
                state.isLoadingUser = true
            })
            .addCase(getUserMetrics.fulfilled, (state, action) => {
                state.isLoadingUser = false
                state.isSuccess = true
                // state.userList = action.payload
            })
            .addCase(getUserMetrics.rejected, (state, action) => {
                state.isLoadingUser = false
                state.isError = true
                state.message = action.payload as string
                // state.userList = []
            })
    }
})

export const {resetMetricSliceState} = metricSlice.actions
export default metricSlice.reducer