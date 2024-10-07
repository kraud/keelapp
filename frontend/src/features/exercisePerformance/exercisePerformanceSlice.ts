import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import exercisePerformanceService from "./exercisePerformanceService"
import {PerformanceActionParameters, PerformanceParameters} from "../../ts/interfaces";

interface ExercisePerformanceSliceState {
    isErrorSendingPerformance: boolean,
    isSuccessSendingPerformance: boolean,
    isLoadingSendingPerformance: boolean,
    message: string,
    exercisePerformance: any,
    isLoadingSavingAction: boolean,
    isErrorSavingAction: boolean,
    isSuccessSavingAction: boolean,
}

const initialState: ExercisePerformanceSliceState = {
    isErrorSendingPerformance: false,
    isSuccessSendingPerformance: false,
    isLoadingSendingPerformance: false,
    message: "",
    exercisePerformance: undefined,
    isErrorSavingAction: false,
    isLoadingSavingAction: false,
    isSuccessSavingAction: false,
}

//
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

//
export const savePerformanceAction = createAsyncThunk('exercises/savePerformanceAction', async (performanceActionParameters: PerformanceActionParameters, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await exercisePerformanceService.savePerformanceAction(performanceActionParameters, token)
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
        resetExercisesPerformanceSliceState: (state) => {
            return(initialState)
        },
        resetExercisePerformance: (state) => {
            return ({
                ...state,
                exercisePerformance: initialState.exercisePerformance
            })
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
                state.exercisePerformance = action.payload
            })
            .addCase(saveTranslationPerformance.rejected, (state, action) => {
                state.isLoadingSendingPerformance = false
                state.isErrorSendingPerformance = true
                state.message = action.payload as string
            })
            .addCase(savePerformanceAction.pending, (state) => {
                state.isLoadingSavingAction = true
                state.isSuccessSavingAction = false
            })
            .addCase(savePerformanceAction.fulfilled, (state, action) => {
                state.isLoadingSavingAction = false
                state.isSuccessSavingAction = true
            })
            .addCase(savePerformanceAction.rejected, (state, action) => {
                state.isLoadingSavingAction = false
                state.isErrorSavingAction = true
                state.message = action.payload as string
            })
    }
})

export const { resetExercisesPerformanceSliceState, resetExercisePerformance } = exercisePerformanceSlice.actions
export default exercisePerformanceSlice.reducer