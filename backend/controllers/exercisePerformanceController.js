const asyncHandler = require('express-async-handler')
const mongoose= require("mongoose")
const ExercisePerformance = require('../models/exercisePerformanceModel')

/**
 *
 * @param userId String with user _id
 * @param word Word model "instance"
 */
const getPerformanceByWorId = asyncHandler(async (userId, word) => {
    // Array de ExercisePerformance
    let wordObjectId = word._id
    let userObjectId =  mongoose.Types.ObjectId(userId)
    return await ExercisePerformance.find({user: userObjectId, word: wordObjectId})
        .then(performances => {
            return performances; // Procesar el resultado aquí si se necesita
        });
})

const getPerformanceByWordIdAndTranslationId =  asyncHandler(async (userId, wordId, ) => {
    // Array de ExercisePerformance
    let wordObjectId = word._id
    let userObjectId =  mongoose.Types.ObjectId(userId)
    const result = await ExercisePerformance.find({ user: userObjectId, word: wordObjectId })
        .then(performances => {
            return performances; // Procesar el resultado aquí si se necesita
        });
})

// @desc    Set Word
// @route   POST /api/saveExerciseResult
// @access  Private
const saveExerciseResult = asyncHandler(async (req, res) => {
    if (!req.body.partOfSpeech) {
        res.status(400)
        throw new Error("Please add part of speech")
    }
    if (!req.body.translations || req.body.translations.length < 2) {
        res.status(400)
        throw new Error("Please add 2 or more translations")
    }

    // Body del servicio:
    // performanceId: req.performanceId
    // Si tenemos performanceId => buscamos y actualizamos de acuerdo al resultado actual.
    // Sino => creamos nuevo:
    // user: req.user
    // translationId: req.translationId
    // word: req.word
    // caseName: req.case
    // record: true/false
    // lastDate: today

    const exercisePerformance = await ExercisePerformance.findById(req.body.performanceId)

    if(!exercisePerformance){
        const knowledge = calculateNewPercentageOfKnowledge(0,[req.body.record])

        const exercisePerformance = await ExercisePerformance.create({
            user: req.user,
            translationId: req.body.translationId,
            word: req.body.word, //<= ObjectId
            statsByCase: [{
                caseName: req.body.caseName,
                record: [req.body.record],
                lastDate: new Date(),
                knowledge: knowledge
            }]
        })
    } else {
        //update
        let statByCaseName = exercisePerformance.statsByCase.find(stat => stat.caseName = req.body.caseName);
        if (statByCaseName) {
            if (statByCaseName.record.length === 4) {
                statByCaseName.record.splice(0, 1)
                statByCaseName.record.push(req.body.record)
            } else {
                statByCaseName.record.push(req.body.record)
            }
            statByCaseName.knowledge = calculateNewPercentageOfKnowledge(statByCaseName.knowledge, statByCaseName.record)
            statByCaseName.lastDate = new Date()
        } else {
            statByCaseName = {
                caseName: req.body.caseName,
                record: [req.body.record],
                lastDate: new Date(),
                knowledge: calculateNewPercentageOfKnowledge(0,[req.body.record])
            }
            exercisePerformance.statsByCase.push(statByCaseName)
        }

        try{
            exercisePerformance.save()
        } catch (error){
            console.log(error)
        }
    }
})



//Function to calculate the aging of the actual percentage of knowledge.
//percentageOfKnowledge is the current percentage and lastDate must be a Date.
function calculateAging(percentageOfKnowledge, lastDate){
    const actualDate = new Date();
    const difOfDays = Math.floor((actualDate - lastDate)/ (1000 * 60 * 60 * 24));
    return percentageOfKnowledge * Math.exp((-0.01 * difOfDays))
}

//Function to calculate the new percentage of knowledge after making an exercise.
//arrayResults have the new result and previousPercentageOfKnowledge is after to aging.
function calculateNewPercentageOfKnowledge(previousPercentageOfKnowledge, arrayResults){
    if(arrayResults.length > 0){
        const averageOfArray = (arrayResults.filter(Boolean).length / arrayResults.length) * 100;
        return ((1 * previousPercentageOfKnowledge ) + (3 * averageOfArray))/4
    }
    return previousPercentageOfKnowledge;
}

const findMatches = (word, translationsPerformanceArray) => {
    // return word.map(obj => {
    return word.exercises
        .map(exercise => {
            const itemB = exercise.matchingTranslations.itemB;
            if (itemB && itemB.translationId && Array.isArray(translationsPerformanceArray)) {
                // stat is object of ExercisePerformance
                const stat = translationsPerformanceArray.find(s => s.translationId.equals(itemB.translationId));
                if (stat) {
                    // Filtrar statsByCase que coincidan con el case de itemB
                    const caseMatchingStats = stat.statsByCase.find(statCase => statCase.caseName === itemB.case);
                    if(caseMatchingStats){
                        const newKnowledge = calculateAging(caseMatchingStats.knowledge, caseMatchingStats.lastDate)
                        return {...exercise, knowledge: newKnowledge, performance: stat }
                    }
                    return {...exercise, knowledge: 0, performance: stat }
                }
            }
            return {...exercise, knowledge:0, performance: {} };
        })
        .filter(result => result !== null).flat();
};

const getPerformanceByWorIdDummy = (userId, word) => {
    return (
        [
            {
                "user": "usuario",
                "translationId":   new mongoose.Types.ObjectId("66b6de8a3b68472b47739673"),
                "word": "word",
                "statsByCase": [
                    {
                        "caseName": "gerundNonFiniteSimpleES",
                        "record": [
                            true, false
                        ],
                        "lastDate": new Date("2023-12-01"),
                        "knowledge": 45
                    },
                    {
                        "caseName": "participleNonFiniteSimpleES",
                        "record": [
                            true, false
                        ],
                        "lastDate": new Date("2023-11-01"),
                        "knowledge": 22

                    },
                    {
                        "caseName": "indicativePresent1sES",
                        "record": [
                            true, false
                        ],
                        "lastDate": new Date("2023-10-01"),
                        "knowledge": 15

                    },
                    {
                        "caseName": "indicativeFuture1plES",
                        "record": [
                            true, true
                        ],
                        "lastDate": new Date("2023-09-01"),
                        "knowledge": 11
                    }
                ]
            }
        ]
    )
};


module.exports = {
    getPerformanceByWorId,
    saveExerciseResult,
    calculateAging,
    findMatches,
    getPerformanceByWorIdDummy,
}