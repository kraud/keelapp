import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {SearchResult, TagData} from "../../ts/interfaces";
import tagService from "./tagService";

interface tagSliceState {
    tags: SearchResult[],
    fullTagData: TagData | undefined,
    currentTagAmountWords: number,

    isLoadingTags: boolean,
    isSuccessTags: boolean,
    isError: boolean,
    message: string,
}

const initialState: tagSliceState = {
    tags: [],
    fullTagData: undefined,
    currentTagAmountWords: 0,
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

// Get a tag data by its label (total or partial match)
export const searchTagsByLabel = createAsyncThunk(`tags/searchTag`, async (request: {query: string, includeOtherUsersTags?: boolean}, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await tagService.searchTags(token, request.query, request.includeOtherUsersTags)
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

// Get full tag data by its id
export const getTagById = createAsyncThunk(`tags/getTagById`, async (wordId: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await tagService.getTagById(token, wordId)
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

// Create a new tag
export const createTag = createAsyncThunk('tags/createTag', async (tag: TagData, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await tagService.createTag(tag, token)
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

// Delete a tag data by its id
export const deleteTag = createAsyncThunk(`tags/deleteTagById`, async (tagId: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await tagService.deleteTagById(token, tagId)
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

// Update a tag data by its id
export const updateTag = createAsyncThunk(`tags/updateTagById`, async (updatedData: TagData, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await tagService.updateTagById(token, updatedData)
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


// Get the amount of words that have a certain tag associated to it
export const getAmountByTag = createAsyncThunk(`words/getAmountByTag`, async (id: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await tagService.getTagWordsAmount(token, id)
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
            .addCase(getTagsByUserId.pending, (state) => {
                state.isLoadingTags = true
            })
            .addCase(getTagsByUserId.fulfilled, (state, action) => {
                state.isLoadingTags = false
                state.isSuccessTags = true
                state.tags = (action.payload)
            })
            .addCase(getTagsByUserId.rejected, (state, action) => {
                state.isLoadingTags = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(searchTagsByLabel.pending, (state) => {
                state.isLoadingTags = true
            })
            .addCase(searchTagsByLabel.fulfilled, (state, action) => {
                state.isLoadingTags = false
                state.isSuccessTags = true
                state.tags = (action.payload)
            })
            .addCase(searchTagsByLabel.rejected, (state, action) => {
                state.isLoadingTags = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(getTagById.pending, (state) => {
                state.isLoadingTags = true
            })
            .addCase(getTagById.fulfilled, (state, action) => {
                state.isLoadingTags = false
                state.isSuccessTags = true
                state.fullTagData = (action.payload)
            })
            .addCase(getTagById.rejected, (state, action) => {
                state.isLoadingTags = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(createTag.pending, (state) => {
                state.isLoadingTags = true
            })
            .addCase(createTag.fulfilled, (state, action) => {
                state.isLoadingTags = false
                state.isSuccessTags = true
                state.fullTagData = (action.payload)
            })
            .addCase(createTag.rejected, (state, action) => {
                state.isLoadingTags = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(deleteTag.pending, (state) => {
                state.isLoadingTags = true
            })
            .addCase(deleteTag.fulfilled, (state, action) => {
                state.isLoadingTags = false
                state.isSuccessTags = true
                state.fullTagData = (action.payload)
            })
            .addCase(deleteTag.rejected, (state, action) => {
                state.isLoadingTags = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(updateTag.pending, (state) => {
                state.isLoadingTags = true
            })
            .addCase(updateTag.fulfilled, (state, action) => {
                state.isLoadingTags = false
                state.isSuccessTags = true
                state.fullTagData = (action.payload)
            })
            .addCase(updateTag.rejected, (state, action) => {
                state.isLoadingTags = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(getAmountByTag.pending, (state) => {
                state.isLoadingTags = true
            })
            .addCase(getAmountByTag.fulfilled, (state, action) => {
                state.isLoadingTags = false
                state.isSuccessTags = true
                state.currentTagAmountWords = (action.payload)
            })
            .addCase(getAmountByTag.rejected, (state, action) => {
                state.isLoadingTags = false
                state.isError = true
                state.message = action.payload as string
            })
    }
})

export const {reset} = tagSlice.actions
export default tagSlice.reducer