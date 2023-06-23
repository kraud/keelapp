import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import wordService from "./wordService"


const initialState = {
    words: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
}

export const wordSlice = createSlice({
    name: 'word',
    initialState,
    reducers: {
        reset: (state: any) => initialState
    }
})

export const {reset} = wordSlice.actions
export default wordSlice.reducer