import axios from "axios"

const BE_URL = process.env.REACT_APP_VERCEL_BE_URL
const API_URL = (BE_URL!!) ?BE_URL+'/api/autocompleteTranslations' :'/api/autocompleteTranslations'

const getEstonianNounData = async (nounEESingularNominative: string) => {
    const response = await axios.get(`https://api.sonapi.ee/v2/${nounEESingularNominative}`)
    return(response.data)
}

const getEstonianVerbData = async (verbEEMaInfinitive: string) => {
    const response = await axios.get(`https://api.sonapi.ee/v2/${verbEEMaInfinitive}`)
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
    getEstonianNounData, getSpanishVerbData, getEnglishVerbData, getEstonianVerbData
}

export default autocompletedTranslationService