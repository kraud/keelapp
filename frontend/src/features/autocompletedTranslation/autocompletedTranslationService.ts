import axios from "axios"

const BE_URL = process.env.REACT_APP_VERCEL_BE_URL
const API_URL = (BE_URL!!) ?BE_URL+'/api/autocompleteTranslations' :'/api/autocompleteTranslations'

const getEstonianNounData = async (nounEESingularNominative: string) => {
    const response = await axios.get(`https://api.sonapi.ee/v2/${nounEESingularNominative}`)
    return(response.data)
}
const getSpanishVerbData = async (verbESInfinitive: string) => {
    const response = await axios.get(`${API_URL}/spanish/verb/${verbESInfinitive}`)
    return(response.data)
}

const autocompletedTranslationService = {
    getEstonianNounData, getSpanishVerbData
}

export default autocompletedTranslationService