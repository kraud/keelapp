import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {SearchResult} from "../../ts/interfaces";
import tagService from "./tagService";

interface tagSliceState {
    tags: SearchResult[],

    isLoadingTags: boolean,
    isSuccessTags: boolean,
    isError: boolean,
    message: string,
}

const initialState: tagSliceState = {
    tags: [],

    isLoadingTags: false,
    isSuccessTags: false,
    isError: false,
    message: "",
}

// Get user tags
export const getTagsByUserId = createAsyncThunk('tags/getUserTags', async (_, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await tagService.getUserTags(token)
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


export const tagSlice = createSlice({
    name: 'tag',
    initialState,
    reducers: {
        reset: (state: any) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase( getTagsByUserId.pending, (state) => {
                state.isLoadingTags = true
            })
            .addCase( getTagsByUserId.fulfilled, (state, action) => {
                state.isLoadingTags = false
                state.isSuccessTags = true
                state.tags = (action.payload)
            })
            .addCase( getTagsByUserId.rejected, (state, action) => {
                state.isLoadingTags = false
                state.isError = true
                state.message = action.payload as string
            })
    }
})

export const {reset} = tagSlice.actions
export default tagSlice.reducer