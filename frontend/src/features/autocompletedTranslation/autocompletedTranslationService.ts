import axios from "axios";


const getEstonianNounData = async (nounEESingularNominative: string) => {
    const response = await axios.get(`https://api.sonapi.ee/v2/${nounEESingularNominative}`)
    return(response.data)
}

const autocompletedTranslationService = {
    getEstonianNounData
}

export default autocompletedTranslationService