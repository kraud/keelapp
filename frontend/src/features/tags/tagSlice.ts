import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {SearchResult, TagData} from "../../ts/interfaces";
import tagService from "./tagService";

interface tagSliceState {
    tags: SearchResult[],
    otherUserTags: SearchResult[],
    fullTagData: TagData | undefined,
    currentTagAmountWords: number,

    isLoadingTags: boolean,
    isSuccessTags: boolean,
    isError: boolean,
    message: string,
}

const initialState: tagSliceState = {
    tags: [],
    otherUserTags: [],
    fullTagData: undefined,
    currentTagAmountWords: 0,
    isLoadingTags: false,
    isSuccessTags: false,
    isError: false,
    message: "",
}

// Get currently logged-in user tags
export const getTagsForCurrentUser = createAsyncThunk('tags/getUserTags', async (_, thunkAPI) => {
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

// Get tags by userID
export const getTagsByAnotherUserID = createAsyncThunk('tags/getOtherUserTags', async (otherUserId: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await tagService.getOtherUserTags(token, otherUserId)
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

// Get a tag data by its label (total or partial match)
export const filterTagsByAnyField = createAsyncThunk(`tags/filterTag`, async (request: TagData, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await tagService.filterTags(token, request)
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
export const getTagById = createAsyncThunk(`tags/getTagById`, async (tagId: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await tagService.getTagById(token, tagId)
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

// TODO: never used. Not properly implemented? Check if needed. If not, delete.
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
        clearFullTagData: (state: any) => {
            return({
                ...state,
                fullTagData: initialState.fullTagData
            })
        },
        clearFullTagDataWords: (state: any) => {
            return({
                ...state,
                fullTagData: {...state.fullTagData, words: []}
            })
        },
        clearOtherUserTags: (state: any) => {
            return({
                ...state,
                otherUserTags: initialState.otherUserTags
            })
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTagsForCurrentUser.pending, (state) => {
                state.isLoadingTags = true
            })
            .addCase(getTagsForCurrentUser.fulfilled, (state, action) => {
                state.isLoadingTags = false
                state.isSuccessTags = true
                state.tags = (action.payload)
            })
            .addCase(getTagsForCurrentUser.rejected, (state, action) => {
                state.isLoadingTags = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(getTagsByAnotherUserID.pending, (state) => {
                state.isLoadingTags = true
            })
            .addCase(getTagsByAnotherUserID.fulfilled, (state, action) => {
                state.isLoadingTags = false
                state.isSuccessTags = true
                state.otherUserTags = (action.payload)
            })
            .addCase(getTagsByAnotherUserID.rejected, (state, action) => {
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
            .addCase(filterTagsByAnyField.pending, (state) => {
                state.isLoadingTags = true
            })
            .addCase(filterTagsByAnyField.fulfilled, (state, action) => {
                state.isLoadingTags = false
                state.isSuccessTags = true
                state.tags = (action.payload)
            })
            .addCase(filterTagsByAnyField.rejected, (state, action) => {
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
                state.fullTagData = (action.payload) // TODO: could we change it so it updates the redux-tag list?
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

export const {reset, clearFullTagData, clearOtherUserTags, clearFullTagDataWords} = tagSlice.actions
export default tagSlice.reducer