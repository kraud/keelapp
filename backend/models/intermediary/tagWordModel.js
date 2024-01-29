const mongoose = require('mongoose')

const tagWordSchema = mongoose.Schema(
    {
        tagId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Tag',
        },
        wordId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Word',
        },
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model('TagWord',  tagWordSchema)