import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {SearchResult, TagData, TagLabelAvailabilityStatus, WordDataBE} from "../../ts/interfaces";
import tagService from "./tagService";

interface tagSliceState {
    tags: SearchResult[],
    otherUserTags: SearchResult[], // used when displaying data about a user
    followedTagsByUser: TagData[], // used in account-screen
    searchResultTags: SearchResult[],
    fullTagData: TagData | undefined,
    currentTagAmountWords: number,
    clonedTagResponse: { clonedTag: TagData, clonedWords: WordDataBE[] } | undefined,
    followedTagResponse: any | undefined // TODO: Define type for 'followedTagResponse' according to BE response
    tagLabelIsAlreadyInUse: TagLabelAvailabilityStatus

    isLoadingTagSearch: boolean, // NB! we use a different loading for search, to avoid triggering tag-loading-bar elsewhere

    isLoadingTags: boolean,
    isSuccessTags: boolean,
    isError: boolean,
    message: string,
}

const initialState: tagSliceState = {
    tags: [],
    otherUserTags: [],
    searchResultTags: [],
    followedTagsByUser: [],
    fullTagData: undefined,
    clonedTagResponse: undefined,
    followedTagResponse: undefined,
    currentTagAmountWords: 0,
    tagLabelIsAlreadyInUse: {isAvailable: true},

    isLoadingTagSearch: false,
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

// Get tags followed by userID
export const getFollowedTagsByUser = createAsyncThunk('tags/getFollowedTags', async (userId: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await tagService.getFollowedTagsByUserId(token, userId)
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
export const searchTagsByLabel = createAsyncThunk(`tags/searchTag`, async (request: {query: string, includeOtherUsersTags?: boolean, includeFollowedTags?: boolean}, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await tagService.searchTags(token, request.query, request.includeOtherUsersTags, request.includeFollowedTags)
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


export const checkIfTagLabelIsAvailable = createAsyncThunk('tags/isTagLabelAlreadyInUse', async (labelUserData: {tagLabel: string, userId: string}, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await tagService.checkIfTagLabelAvailable(labelUserData, token)
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

export interface AddTagsToWordsData {
    selectedWords: string[],
    newTagsToApply: string[]
}

// Add selected tags to the corresponding words
export const applyNewTagToSelectedWordsById = createAsyncThunk(`tags/addTagsToWords`, async (newTagAndWordData: AddTagsToWordsData, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await tagService.addTagsInBulkToWords(token, newTagAndWordData)
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

// Get full tag data by its id
export const acceptExternalTag = createAsyncThunk(`tags/addExternalTag`, async (tagId: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await tagService.addExternalTag(token, tagId)
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
export const followTag = createAsyncThunk(`tags/followExternalTag`, async (data:{tagId: string, userId: string}, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await tagService.followTagByAnotherUser(token, data)
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

// Delete follow relationship between user and tag
export const unfollowTag = createAsyncThunk(`tags/unfollowExternalTag`, async (data:{tagId: string, userId: string}, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await tagService.unfollowTagByAnotherUser(token, data)
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
        clearClonedTagData: (state: any) => {
            return({
                ...state,
                clonedTagResponse: initialState.clonedTagResponse
            })
        },
        clearFollowedTagData: (state: any) => {
            return({
                ...state,
                followedTagResponse: initialState.followedTagResponse
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
        clearSearchResultTags: (state: any) => {
            return({
                ...state,
                searchResultTags: initialState.searchResultTags
            })
        },
        clearTagLabelIsAlreadyInUse: (state: any) => {
            return({
                ...state,
                tagLabelIsAlreadyInUse: initialState.tagLabelIsAlreadyInUse
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
            .addCase(getFollowedTagsByUser.pending, (state) => {
                state.isLoadingTags = true
            })
            .addCase(getFollowedTagsByUser.fulfilled, (state, action) => {
                state.isLoadingTags = false
                state.isSuccessTags = true
                state.followedTagsByUser = (action.payload)
            })
            .addCase(getFollowedTagsByUser.rejected, (state, action) => {
                state.isLoadingTags = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(searchTagsByLabel.pending, (state) => {
                state.isLoadingTagSearch = true
            })
            .addCase(searchTagsByLabel.fulfilled, (state, action) => {
                state.isLoadingTagSearch = false
                state.isSuccessTags = true
                state.searchResultTags = (action.payload)
            })
            .addCase(searchTagsByLabel.rejected, (state, action) => {
                state.isLoadingTagSearch = false
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
            .addCase(checkIfTagLabelIsAvailable.pending, (state) => {
                state.isLoadingTags = true
            })
            .addCase(checkIfTagLabelIsAvailable.fulfilled, (state, action) => {
                state.isLoadingTags = false
                state.isSuccessTags = true
                state.tagLabelIsAlreadyInUse = (action.payload)
            })
            .addCase(checkIfTagLabelIsAvailable.rejected, (state, action) => {
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
            .addCase(applyNewTagToSelectedWordsById.pending, (state) => {
                state.isLoadingTags = true
            })
            .addCase(applyNewTagToSelectedWordsById.fulfilled, (state, action) => {
                state.isLoadingTags = false
                state.isSuccessTags = true
                // state.fullTagData = (action.payload) // TODO: where to store the new tag+word response data?
            })
            .addCase(applyNewTagToSelectedWordsById.rejected, (state, action) => {
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
            .addCase(acceptExternalTag.pending, (state) => {
                state.isLoadingTags = true
            })
            .addCase(acceptExternalTag.fulfilled, (state, action) => {
                state.isLoadingTags = false
                state.isSuccessTags = true
                state.clonedTagResponse = {clonedTag: (action.payload).clonedTag, clonedWords: (action.payload).clonedWords}
            })
            .addCase(acceptExternalTag.rejected, (state, action) => {
                state.isLoadingTags = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(followTag.pending, (state) => {
                state.isLoadingTags = true
            })
            .addCase(followTag.fulfilled, (state, action) => {
                state.isLoadingTags = false
                state.isSuccessTags = true
                state.followedTagResponse = (action.payload)
            })
            .addCase(followTag.rejected, (state, action) => {
                state.isLoadingTags = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(unfollowTag.pending, (state) => {
                state.isLoadingTags = true
            })
            .addCase(unfollowTag.fulfilled, (state, action) => {
                state.isLoadingTags = false
                state.isSuccessTags = true
                state.followedTagResponse = (action.payload)
            })
            .addCase(unfollowTag.rejected, (state, action) => {
                state.isLoadingTags = false
                state.isError = true
                state.message = action.payload as string
            })
    }
})

export const {
    reset, clearFullTagData, clearOtherUserTags,
    clearFullTagDataWords, clearClonedTagData, clearFollowedTagData,
    clearSearchResultTags
} = tagSlice.actions
export default tagSlice.reducer