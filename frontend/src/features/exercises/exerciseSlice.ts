import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import exerciseService from "./exerciseService";

interface ExerciseSliceState {
    isError: boolean,
    isSuccess: boolean,
    isLoading: boolean,
    message: string,
}

const initialState: ExerciseSliceState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
}

// Get exercises for this user
export const getExercisesForUSer = createAsyncThunk('exercises/getExercises', async (exerciseParameters, thunkAPI) => {
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
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {

    }
})

export const {resetExercisesSliceState} = exerciseSlice.actions
export default exerciseSlice.reducer