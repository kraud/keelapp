import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import exerciseService from "./exerciseService";
import {createWord} from "../words/wordSlice";
import {EquivalentTranslationValues} from "../../ts/interfaces";

interface ExerciseSliceState {
    exercises: EquivalentTranslationValues[],

    isError: boolean,
    isSuccess: boolean,
    isLoading: boolean,
    message: string,
}

const initialState: ExerciseSliceState = {
    exercises: [],

    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
}

// Get exercises for this user
export const getExercisesForUser = createAsyncThunk('exercises/getExercises', async (exerciseParameters: any, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await exerciseService.getUserExercises(exerciseParameters, token)
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

export const exerciseSlice = createSlice({
    name: 'exercise',
    initialState,
    reducers: {
        resetExercisesSliceState: (state) => {
            state.isLoading = initialState.isLoading
            state.isSuccess = initialState.isSuccess
            state.isError = initialState.isError
            state.message = initialState.message
            state.exercises = initialState.exercises
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getExercisesForUser.pending, (state) => {
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(getExercisesForUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.exercises = action.payload
            })
            .addCase(getExercisesForUser.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
            })
    }
})

export const {resetExercisesSliceState} = exerciseSlice.actions
export default exerciseSlice.reducer