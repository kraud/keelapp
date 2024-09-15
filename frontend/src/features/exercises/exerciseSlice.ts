import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit"
import exerciseService from "./exerciseService"
import {EquivalentTranslationValues} from "../../ts/interfaces"

interface ExerciseSliceState {
    exercises: EquivalentTranslationValues[],
    wordIdsSelectedForExercises: string[],

    isErrorExercises: boolean,
    isSuccessExercises: boolean,
    isLoadingExercises: boolean,
    message: string,
}

const initialState: ExerciseSliceState = {
    exercises: [],
    wordIdsSelectedForExercises: [],

    isErrorExercises: false,
    isSuccessExercises: false,
    isLoadingExercises: false,
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
            return(initialState)
        },
        setWordIdsSelectedForExercises: (state: any, action: PayloadAction) => {
            return ({
                ...state,
                wordIdsSelectedForExercises: action.payload
            })
        },
        resetWordIdsSelectedForExercises: (state: any) => {
            return ({
                ...state,
                wordIdsSelectedForExercises: initialState.wordIdsSelectedForExercises
            })
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getExercisesForUser.pending, (state) => {
                state.isLoadingExercises = true
                state.isSuccessExercises = false
            })
            .addCase(getExercisesForUser.fulfilled, (state, action) => {
                state.isLoadingExercises = false
                state.isSuccessExercises = true
                state.exercises = action.payload
            })
            .addCase(getExercisesForUser.rejected, (state, action) => {
                state.isLoadingExercises = false
                state.isErrorExercises = true
                state.message = action.payload as string
            })
    }
})

export const {resetExercisesSliceState} = exerciseSlice.actions
export default exerciseSlice.reducer