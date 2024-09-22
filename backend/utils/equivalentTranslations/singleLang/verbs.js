
// NB! It is important that any language-case (key-value) pair is on the third level of the JSON object,
// because the algorithm won't keep going down indefinitely
import {GenderDE} from "../../../../frontend/src/ts/enums";

const verbGroupedCategoriesSingleLanguage = {
    Spanish: {
        multipleChoice: {
            // categoryName: {
            //     "questionWord": "",
            //     "correctValue": "",
            //     "otherValues": [],
            // },
        },
        textInput: {
            participle: {
                "questionWord": "infinitiveNonFiniteSimpleES",
                "correctValue": "participleNonFiniteSimpleES",
            },
        },
    },
}

module.exports = {
    verbGroupedCategoriesSingleLanguage,
}