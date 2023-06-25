import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import wordService from "./wordService"
import {WordData} from "../../components/WordFormGeneric";

interface worldSliceState {
    words: WordData[],
    isError: boolean,
    isSuccess: boolean,
    isLoading: boolean,
    message: string,
}

const initialState: worldSliceState = {
    words: [], // TODO: adjust this to the structure defined in TranslationForm and WordFromGeneric
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
}

export const createWord = createAsyncThunk('word/create', async (word: WordData, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await wordService.createWord(word, token)
    } catch(error: any) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const wordSlice = createSlice({
    name: 'word',
    initialState,
    reducers: {
        reset: (state: any) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(createWord.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createWord.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.words.push(action.payload)
            })
            .addCase(createWord.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
            })
    }
})

export const {reset} = wordSlice.actions
export default wordSlice.reducer