const asyncHandler = require('express-async-handler')
const mongoose= require("mongoose")
const Word = require('../models/wordModel')
const ExercisePerformance = require('../models/exercisePerformanceModel')

/**
 *
 * @param userId String with user _id
 * @param word Word model "instance"
 */
const getPerformanceByWorId =  asyncHandler(async (userId, word) => {
    // Array de ExercisePerformance
    let wordObjectId = word._id
    let userObjectId =  mongoose.Types.ObjectId(userId)
    const result = await ExercisePerformance.find({ user: userObjectId, word: wordObjectId })
        .then(performances => {
            return performances; // Procesar el resultado aquí si se necesita
        });
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
                const stat = translationsPerformanceArray.find(s => s.translationId.equals(itemB.translationId));
                if (stat) {
                    // Filtrar statsByCase que coincidan con el case de itemB
                    const matchingStats = stat.statsByCase.find(statCase => statCase.caseName === itemB.case);
                    if(matchingStats){
                        const newKnowledge = calculateAging(matchingStats.knowledge, matchingStats.lastDate)
                        return {...exercise, knowledge: newKnowledge}
                    }
                }
            }
            return {...exercise, knowledge:0};
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
    calculateAging,
    findMatches,
    getPerformanceByWorIdDummy,
}