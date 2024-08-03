import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import autocompletedTranslationService from "./autocompletedTranslationService";
import {
    sanitizeDataStructureEEAdjective,
    sanitizeDataStructureEENoun, sanitizeDataStructureEEVerb,
    sanitizeDataStructureESVerb
} from "../../components/forms/autocompleteFormFunctions";


interface autocompletedTranslationSliceState {
    autocompletedTranslationNounEE: any,

    autocompletedTranslationAdjectiveEE: any,

    autocompletedTranslationVerbES: any,
    autocompletedTranslationVerbEN: any,
    autocompletedTranslationVerbEE: any,
    autocompletedTranslationVerbDE: any,

    isErrorAT: boolean,
    isSuccessAT: boolean,
    isLoadingAT: boolean,
    messageAT: string,
}

const initialState: autocompletedTranslationSliceState = {
    autocompletedTranslationNounEE: undefined,

    autocompletedTranslationAdjectiveEE: undefined,

    autocompletedTranslationVerbES: undefined,
    autocompletedTranslationVerbEN: undefined,
    autocompletedTranslationVerbEE: undefined,
    autocompletedTranslationVerbDE: undefined,

    isErrorAT: false,
    isSuccessAT: false,
    isLoadingAT: false,
    messageAT: "",
}

// Get Estonian translation data for a noun using the singular nominative form
export const getAutocompletedEstonianNounData = createAsyncThunk(`autocompleteTranslation/getEENoun`, async (nounEESingularNominative: string, thunkAPI) => {
    try {
        // @ts-ignore
        // const token = thunkAPI.getState().auth.user.token
        return await autocompletedTranslationService.getEstonianNounData(nounEESingularNominative)
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

// Get Estonian translation data for a noun using the singular nominative form
export const getAutocompletedEstonianAdjectiveData = createAsyncThunk(`autocompleteTranslation/getEEAdjective`, async (adjectiveEESingularNominative: string, thunkAPI) => {
    try {
        // @ts-ignore
        // const token = thunkAPI.getState().auth.user.token
        return await autocompletedTranslationService.getEstonianAdjectiveData(adjectiveEESingularNominative)
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

// Get Spanish translation data for a verb using the infinitive form
export const getAutocompletedSpanishVerbData = createAsyncThunk(`autocompleteTranslation/getESVerb`, async (verbESInfinitive: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await autocompletedTranslationService.getSpanishVerbData(token, verbESInfinitive)
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

// Get Spanish translation data for a verb using the infinitive form
export const getAutocompletedGermanVerbData = createAsyncThunk(`autocompleteTranslation/getDEVerb`, async (verbDEInfinitive: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await autocompletedTranslationService.getGermanVerbData(token, verbDEInfinitive)
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

//TODO: not yet implemented. Get English translation data for a verb using the simple present first-person singular form
export const getAutocompletedEnglishVerbData = createAsyncThunk(`autocompleteTranslation/getENVerb`, async (verbENInfinitive: string, thunkAPI) => {
    try {
        // @ts-ignore
        const token = thunkAPI.getState().auth.user.token
        return await autocompletedTranslationService.getEnglishVerbData(token, verbENInfinitive)
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

// Get Estonian translation data for a verb using the -ma infinitive form
export const getAutocompletedEstonianVerbData = createAsyncThunk(`autocompleteTranslation/getEEVerb`, async (verbEEInfinitive: string, thunkAPI) => {
    try {
        return await autocompletedTranslationService.getEstonianVerbData(verbEEInfinitive)
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


export const autocompletedTranslationSlice = createSlice({
    name: 'autocompletedTranslation',
    initialState,
    reducers: {
        reset: (state: any) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAutocompletedEstonianNounData.pending, (state) => {
                state.isLoadingAT = true
            })
            .addCase(getAutocompletedEstonianNounData.fulfilled, (state, action) => {
                const nounEEDataToStore = sanitizeDataStructureEENoun(action.payload)
                if(nounEEDataToStore.foundNoun){
                    state.isLoadingAT = false
                    state.isSuccessAT = true
                    state.messageAT = initialState.messageAT
                    state.autocompletedTranslationNounEE = nounEEDataToStore.nounData
                } else {
                    state.isLoadingAT = false
                    state.isSuccessAT = false
                    state.isErrorAT = true
                    state.messageAT = "There is not information in our system for that word."
                    state.autocompletedTranslationNounEE = initialState.autocompletedTranslationNounEE
                }
            })
            .addCase(getAutocompletedEstonianNounData.rejected, (state, action) => {
                state.isLoadingAT = false
                state.isErrorAT = true
                state.messageAT = action.payload as string
            })
            .addCase(getAutocompletedSpanishVerbData.pending, (state) => {
                state.isLoadingAT = true
            })
            .addCase(getAutocompletedSpanishVerbData.fulfilled, (state, action) => {
                const verbESDataToStore = sanitizeDataStructureESVerb(action.payload)
                if(verbESDataToStore.foundVerb){
                    state.isLoadingAT = false
                    state.isSuccessAT = true
                    state.messageAT = initialState.messageAT
                    state.autocompletedTranslationVerbES = verbESDataToStore.verbData
                } else {
                    state.isLoadingAT = false
                    state.isSuccessAT = false
                    state.isErrorAT = true
                    state.messageAT = "There is not information in our system for that word."
                    state.autocompletedTranslationVerbES = initialState.autocompletedTranslationVerbES
                }
            })
            .addCase(getAutocompletedSpanishVerbData.rejected, (state, action) => {
                state.isLoadingAT = false
                state.isErrorAT = true
                state.messageAT = action.payload as string
            })
            .addCase(getAutocompletedEstonianVerbData.pending, (state) => {
                state.isLoadingAT = true
            })
            .addCase(getAutocompletedEstonianVerbData.fulfilled, (state, action) => {
                const verbEEDataToStore = sanitizeDataStructureEEVerb(action.payload)
                if(verbEEDataToStore.foundVerb){
                    state.isLoadingAT = false
                    state.isSuccessAT = true
                    state.messageAT = initialState.messageAT
                    state.autocompletedTranslationVerbEE = verbEEDataToStore.verbData
                } else {
                    state.isLoadingAT = false
                    state.isSuccessAT = false
                    state.isErrorAT = true
                    state.messageAT = "There is not information in our system for that word."
                    state.autocompletedTranslationVerbEE = initialState.autocompletedTranslationVerbEE
                }
            })
            .addCase(getAutocompletedEstonianVerbData.rejected, (state, action) => {
                state.isLoadingAT = false
                state.isErrorAT = true
                state.messageAT = action.payload as string
            })
            .addCase(getAutocompletedGermanVerbData.pending, (state) => {
                state.isLoadingAT = true
            })
            .addCase(getAutocompletedGermanVerbData.fulfilled, (state, action) => {
                // NB! There is no need for a sanitize function, because we create the response format ourselves in the BEc
                if(action.payload.foundVerb){
                    state.isLoadingAT = false
                    state.isSuccessAT = true
                    state.messageAT = initialState.messageAT
                    state.autocompletedTranslationVerbDE = action.payload.verbData
                } else {
                    state.isLoadingAT = false
                    state.isSuccessAT = false
                    state.isErrorAT = true
                    state.messageAT = "There is not information in our system for that word."
                    state.autocompletedTranslationVerbDE = initialState.autocompletedTranslationVerbDE
                }
            })
            .addCase(getAutocompletedGermanVerbData.rejected, (state, action) => {
                state.isLoadingAT = false
                state.isErrorAT = true
                state.messageAT = action.payload as string
            })
            .addCase(getAutocompletedEstonianAdjectiveData.pending, (state) => {
                state.isLoadingAT = true
            })
            .addCase(getAutocompletedEstonianAdjectiveData.fulfilled, (state, action) => {
                const adjectiveEEDataToStore = sanitizeDataStructureEEAdjective(action.payload)
                if(adjectiveEEDataToStore.foundAdjective){
                    state.isLoadingAT = false
                    state.isSuccessAT = true
                    state.messageAT = initialState.messageAT
                    state.autocompletedTranslationAdjectiveEE = adjectiveEEDataToStore.adjectiveData
                } else {
                    state.isLoadingAT = false
                    state.isSuccessAT = false
                    state.isErrorAT = true
                    state.messageAT = "There is not information in our system for that word."
                    state.autocompletedTranslationAdjectiveEE = initialState.autocompletedTranslationAdjectiveEE
                }
            })
            .addCase(getAutocompletedEstonianAdjectiveData.rejected, (state, action) => {
                state.isLoadingAT = false
                state.isErrorAT = true
                state.messageAT = action.payload as string
            })

    }
})

export const {reset} = autocompletedTranslationSlice.actions
export default autocompletedTranslationSlice.reducer