const mongoose= require('mongoose')

const exercisePerformanceSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    translationId: mongoose.Schema.Types.ObjectId,

    // wordId es para ayudar a identificar exactamente la palabra a la que pertenece el translationId,
    // para simplificar consulta de creación de ejercicios (antes translationId se mantenía al clonar tag, ahora se genera uno nuevo)
    word: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Word',
    },
    // NB! We'll use record.length & % of correct answers (true) + lastDate to calculate a "level of remembrance"
    // and sort translations to use by that metric, to encourage practicing different translations.
    // Example: if lastDate > 6 months ago => amount of correct answers counts as half (or some other calculation).
    statsByCase: {
        type:[{
            caseName: String,
            record: [Boolean],
            // record: [{
            //     type: Boolean
            // }],
            lastDate: {
                type: Date
            },
            knowledge:{
                type: Number
            }
        }]
    }
},{
    timestamps: true
})

exercisePerformanceSchema.index({ user: 1, word: 1 });

module.exports = mongoose.model('ExercisePerformance',  exercisePerformanceSchema)
