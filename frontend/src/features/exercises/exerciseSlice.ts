import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit"
import exerciseService from "./exerciseService"
import {EquivalentTranslationValues} from "../../ts/interfaces"

interface ExerciseSliceState {
    exercises: EquivalentTranslationValues[],
    wordsSelectedForExercises: any[], // simple word data

    isErrorExercises: boolean,
    isSuccessExercises: boolean,
    isLoadingExercises: boolean,
    message: string,
}

const initialState: ExerciseSliceState = {
    exercises: [],
    wordsSelectedForExercises: [],

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
        setWordsSelectedForExercises: (state: any, action: PayloadAction) => {
            return ({
                ...state,
                wordsSelectedForExercises: action.payload
            })
        },
        resetWordsSelectedForExercises: (state: any) => {
            return ({
                ...state,
                wordsSelectedForExercises: initialState.wordsSelectedForExercises
            })
        },
        resetExerciseList: (state: any) => {
            return ({
                ...state,
                exercises: initialState.exercises
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

export const {resetExercisesSliceState, setWordsSelectedForExercises, resetWordsSelectedForExercises, resetExerciseList} = exerciseSlice.actions
export default exerciseSlice.reducer