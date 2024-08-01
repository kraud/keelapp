import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import autocompletedTranslationService from "./autocompletedTranslationService";
import {
    sanitizeDataStructureEENoun,
    sanitizeDataStructureESVerb
} from "../../components/forms/autocompleteFormFunctions";


interface autocompletedTranslationSliceState {
    autocompletedTranslationNounEE: any,
    autocompletedTranslationVerbES: any,
    isErrorAT: boolean,
    isSuccessAT: boolean,
    isLoadingAT: boolean,
    messageAT: string,
}

const initialState: autocompletedTranslationSliceState = {
    autocompletedTranslationNounEE: undefined,
    autocompletedTranslationVerbES: undefined,

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

    }
})

export const {reset} = autocompletedTranslationSlice.actions
export default autocompletedTranslationSlice.reducer