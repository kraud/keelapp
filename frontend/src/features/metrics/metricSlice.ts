import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import metricService from "./metricService";

interface MetricSliceState {
    isError: boolean,
    isSuccess: boolean,
    isLoading: boolean,
    message: string,
    data: any
}

const initialState: MetricSliceState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    data: {}
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
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserMetrics.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getUserMetrics.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.data = action.payload
            })
            .addCase(getUserMetrics.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
            })
    }
})

export const {resetMetricSliceState} = metricSlice.actions
export default metricSlice.reducer