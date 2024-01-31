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
                cases: [{
                    word: {type: String},
                    caseName: {type: String},
                    _id: false
                }]
            }],
            required: true,
        },
        clue: {
            type: String,
        },
        // TODO: currently holds strings with tag-labels (old system)
        // soon will be changed into pair of [tagId, tagLabel] (or similar) - (new system)
        tags: [{
            type: String
        }]
    },
    {
        timestamps: true,
    }
)

wordSchema.virtual('words', {
    ref: 'TagWord',
    localField: '_id',
    foreignField: 'wordId'
})

module.exports = mongoose.model('Word',  wordSchema)