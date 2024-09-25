import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import exercisePerformanceService from "./exercisePerformanceService"
import {PerformanceParameters} from "../../ts/interfaces";

interface ExercisePerformanceSliceState {
    isErrorSendingPerformance: boolean,
    isSuccessSendingPerformance: boolean,
    isLoadingSendingPerformance: boolean,
    message: string,
}

const initialState: ExercisePerformanceSliceState = {
    isErrorSendingPerformance: false,
    isSuccessSendingPerformance: false,
    isLoadingSendingPerformance: false,
    message: "",
}

// Get exercises for this user
export const saveTranslationPerformance = createAsyncThunk('exercises/saveTranslationPerformance', async (performanceParameters: PerformanceParameters, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await exercisePerformanceService.saveTranslationPerformance(performanceParameters, token)
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

export const exercisePerformanceSlice = createSlice({
    name: 'exercisePerformance',
    initialState,
    reducers: {
        resetExercisesSliceState: (state) => {
            return(initialState)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveTranslationPerformance.pending, (state) => {
                state.isLoadingSendingPerformance = true
                state.isSuccessSendingPerformance = false
            })
            .addCase(saveTranslationPerformance.fulfilled, (state, action) => {
                state.isLoadingSendingPerformance = false
                state.isSuccessSendingPerformance = true
            })
            .addCase(saveTranslationPerformance.rejected, (state, action) => {
                state.isLoadingSendingPerformance = false
                state.isErrorSendingPerformance = true
                state.message = action.payload as string
            })
    }
})

export const { resetExercisesSliceState} = exercisePerformanceSlice.actions
export default exercisePerformanceSlice.reducer