import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit"
import wordService from "./wordService"
import {FilterItem, SearchResult, WordData, WordDataBE} from "../../ts/interfaces";
import {PartOfSpeech} from "../../ts/enums";

interface wordSliceState {
    // list with full translation info for all words might not be needed?
    // wordSimple + request for specific data in word can be enough?
    words: WordData[],
    wordsSimple: any[], // TODO: replace any with a specific type
    word?: WordData, // check if it should be WordDataBE
    searchResults: SearchResult[],
    currentlySelectedPoS?: PartOfSpeech, // when adding a new word, we need to know the PoS, so we can display the proper labels

    // state-tracking properties
    isError: boolean,
    isSuccess: boolean,
    isLoading: boolean,
    // different loading status for search, since it's displayed simultaneously with other components that depend on isLoading
    isSearchLoading: boolean,
    message: string,
}

const initialState: wordSliceState = {
    words: [],
    wordsSimple: [],
    word: {
        translations: []
    },
    searchResults: [],
    currentlySelectedPoS: undefined,
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

// Get user words (complete translation data, but it doesn't include tag data) => NOT IN USE YET (we use getSimple).
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
export const getWordsSimplified = createAsyncThunk('words/getAllSimple', async (filters: FilterItem[] | undefined, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await wordService.getWordsSimplified(token, filters)
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
export const deleteWordById = createAsyncThunk(`words/deleteWordById`, async (wordId: string, thunkAPI) => {
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

export const deleteManyWordsById = createAsyncThunk(`words/deleteManyWordsById`, async (wordsId: string[], thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await wordService.deleteManyWordsById(token, wordsId)
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

// Gets all words that match (partially or fully) a string query
export const searchWordByAnyTranslation = createAsyncThunk(`words/searchWord`, async (query: string, thunkAPI) => {
    try {
        console.log(query)
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
        },
        clearResults: (state: any) => {
            return ({
                ...state,
                searchResults: initialState.searchResults
            })
        },
        clearWordsSimple: (state: any) => {
            return ({
                ...state,
                wordsSimple: initialState.wordsSimple
            })
        },
        setSelectedPoS: (state: any, action: PayloadAction) => {
            return ({
                ...state,
                currentlySelectedPoS: action.payload
            })
        },
        resetSelectedPoS: (state: any) => {
            return ({
                ...state,
                currentlySelectedPoS: undefined
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
                state.word = action.payload
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
            .addCase(deleteManyWordsById.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteManyWordsById.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                // state.searchResults = (action.payload) // TODO: what do we get from the payload?
            })
            .addCase(deleteManyWordsById.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(deleteWordById.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteWordById.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.word = initialState.word // TODO: what do we get from the payload?
            })
            .addCase(deleteWordById.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
            })
    }
})

export const {reset, clearWord, clearResults, clearWordsSimple, setSelectedPoS, resetSelectedPoS} = wordSlice.actions
export default wordSlice.reducer