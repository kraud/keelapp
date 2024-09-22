
// NB! It is important that any language-case (key-value) pair is on the third level of the JSON object,
// because the algorithm won't keep going down indefinitely
import {GenderDE} from "../../../../frontend/src/ts/enums";

const nounGroupedCategoriesSingleLanguage = {
    Spanish: {
        multipleChoice: {
            gender: {
                "questionWord": "singularES",
                "correctValue": "genderES",
                "otherValues": ['el', 'la', 'el/la'], // we'll filter the options != to correct value
                // "otherValues": [GenderDE.M, GenderDE.F, GenderDE.N],
            },
        },
        textInput: {
            // TODO: look into other cases to practice within noun-ES
            // categoryName: {
            //     "questionWord": "",
            //     "correctValue": "",
            // },
        },
    },
    German: {
        multipleChoice: {
            gender: {
                "questionWord": "singularNominativDE",
                "correctValue": "genderDE",
                "otherValues": ['der', 'die', 'das'], // we'll filter the options != to correct value
                // "otherValues": [GenderDE.M, GenderDE.F, GenderDE.N],
            },
        },
        textInput: {
            // TODO: look into other cases to practice within noun-DE
            // categoryName: {
            //     "questionWord": "",
            //     "correctValue": "",
            // },
        },
    },
    Estonian: {
        multipleChoice: {
            // TODO: look into other cases to practice within noun-EE
            // categoryName: {
            //     "questionWord": "",
            //     "correctValue": "",
            //     "otherValues": [],
            // },
        },
        textInput: {
            shortForm: {
                "questionWord": "singularNominativDE",
                "correctValue": "shortFormEE",
            },
        },
    },
    // TODO: look into cases to practice within noun-EN? (irregular plural?)
}

module.exports = {
    nounGroupedCategoriesSingleLanguage,
}