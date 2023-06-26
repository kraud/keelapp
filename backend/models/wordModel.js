const mongoose = require('mongoose')

const wordSchema = mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        partOfSpeech:{
            type: String,
            required: true,
        },
        translations:{
            type: [{
                language: String,
                nounCases: [{ // TODO: later on we should have this renamed to fit nouns-verbs-adverbs-etc
                    word: String,
                    caseName: String,
                    _id: false
                }]
            }],
            required: true,
        },
        clue: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Word',  wordSchema)