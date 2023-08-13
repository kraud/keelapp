import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit"
import wordService from "./wordService"
import {SearchResults, WordData, WordDataBE} from "../../ts/interfaces";

interface worldSliceState {
    // list with full translation info for all words might not be needed?
    // wordSimple + request for specific data in word can be enough?
    words: WordData[],
    wordsSimple: any[],
    word?: WordData,
    searchResults: SearchResults[],
    isError: boolean,
    isSuccess: boolean,
    isLoading: boolean,
    // different loading status for search, since it's displayed simultaneously with other components that depend on isLoading
    isSearchLoading: boolean,
    message: string,
}

const initialState: worldSliceState = {
    words: [], // TODO: adjust this to the structure defined in TranslationForm and WordFromGeneric
    wordsSimple: [],
    word: {
        translations: []
    },
    searchResults: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    isSearchLoading: false,
    message: "",
}

// Create a new word
export const createWord = createAsyncThunk('words/create', async (word: WordData, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await wordService.createWord(word, token)
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
// Get user words
export const getWords = createAsyncThunk('words/getAll', async (_, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await wordService.getWords(token)
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
// Get user words simplified to be displayed on table
export const getWordsSimplified = createAsyncThunk('words/getAllSimple', async (_, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await wordService.getWordsSimplified(token)
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
// Get a word data by its id
export const getWordById = createAsyncThunk(`words/getWordById`, async (wordId: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await wordService.getWordById(token, wordId)
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
// Update a word data by its id
export const updateWordById = createAsyncThunk(`words/updateWordById`, async (updatedData: WordDataBE, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await wordService.updateWordById(token, updatedData)
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
// Delete a word data by its id
export const deleteWordById = createAsyncThunk(`words/updateWordById`, async (wordId: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await wordService.deleteWordById(token, wordId)
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

// Get a word data by its id
export const searchWordByAnyTranslation = createAsyncThunk(`words/searchWord`, async (query: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await wordService.searchWord(token, query)
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

export const wordSlice = createSlice({
    name: 'word',
    initialState,
    reducers: {
        reset: (state: any) => initialState,
        clearWord: (state: any) => {
            return ({
                ...state,
                word: initialState.word
            })
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createWord.pending, (state) => {
                state.isLoading = true
                state.isSuccess = false
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
            .addCase(getWords.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getWords.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.words = (action.payload)
            })
            .addCase(getWords.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(getWordsSimplified.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getWordsSimplified.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.wordsSimple = (action.payload)
            })
            .addCase(getWordsSimplified.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(getWordById.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getWordById.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.word = (action.payload)
            })
            .addCase(getWordById.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(updateWordById.pending, (state) => {
                state.isLoading = true
            })
            // TODO: instead of '| any', it should be WordData, with all the possible fields coming from the backend - dates, ids, etc.
            .addCase(updateWordById.fulfilled, (state, action: PayloadAction<{} | any>) => {
                state.isLoading = false
                state.isSuccess = true
                state.word = (action.payload)
            })
            .addCase(updateWordById.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(searchWordByAnyTranslation.pending, (state) => {
                state.isSearchLoading = true
            })
            .addCase(searchWordByAnyTranslation.fulfilled, (state, action) => {
                state.isSearchLoading = false
                state.isSuccess = true
                state.searchResults = (action.payload)
            })
            .addCase(searchWordByAnyTranslation.rejected, (state, action) => {
                state.isSearchLoading = false
                state.isError = true
                state.message = action.payload as string
            })
    }
})

export const {reset, clearWord} = wordSlice.actions
export default wordSlice.reducer