import axios from "axios"
import {EstonianAPIRequest} from "../../ts/interfaces";

const BE_URL = process.env.REACT_APP_VERCEL_BE_URL
const API_URL = (BE_URL!!) ?BE_URL+'/api/autocompleteTranslations' :'/api/autocompleteTranslations'

const getEstonianNounData = async (token: any, nounEESingularNominative: EstonianAPIRequest) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            searchInEnglish: nounEESingularNominative.searchInEnglish!!,
        }
    }
    let response = await axios.get(`${API_URL}/estonian/noun/${nounEESingularNominative.query}`,config)
    return(response.data)
}

const getEstonianAdjectiveData = async (token: any, adjectiveEESingularNominative: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(`${API_URL}/estonian/adjective/${adjectiveEESingularNominative}`, config)
    return(response.data)
}

const getEstonianVerbData = async (token: any, verbEEMaInfinitive: EstonianAPIRequest) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            searchInEnglish: verbEEMaInfinitive.searchInEnglish!!,
        }
    }
    let response = await axios.get(`${API_URL}/estonian/verb/${verbEEMaInfinitive.query}`, config)
    return(response.data)
}

const getSpanishVerbData = async (token: any, verbESInfinitive: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(`${API_URL}/spanish/verb/${verbESInfinitive}`, config)
    return(response.data)
}

const getSpanishNounGender = async (token: any, singularNominativeNoun: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(`${API_URL}/spanish/noun/${singularNominativeNoun}`, config)
    return(response.data)
}

const getGermanVerbData = async (token: any, verbDEInfinitive: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(`${API_URL}/german/verb/${verbDEInfinitive}`, config)
    return(response.data)
}

const getGermanNounData = async (token: any, singularNominativeNoun: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(`${API_URL}/german/noun/${singularNominativeNoun}`, config)
    return(response.data)
}

const getEnglishVerbData = async (token: any, verbENInfinitive: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(`${API_URL}/english/verb/${verbENInfinitive}`, config)
    return(response.data)
}

const autocompletedTranslationService = {
    getEstonianNounData, getSpanishVerbData, getEnglishVerbData, getEstonianVerbData, getGermanVerbData,
    getEstonianAdjectiveData, getGermanNounData, getSpanishNounGender
}

export default autocompletedTranslationService