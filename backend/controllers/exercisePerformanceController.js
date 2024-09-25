const asyncHandler = require('express-async-handler')
const mongoose = require("mongoose")
const Word = require('../models/wordModel')
const ExercisePerformance = require('../models/exercisePerformanceModel')

/**
 *
 * @param userId String with user _id
 * @param word Word model "instance"
 */
const getPerformanceByWorId =  async (userId, word) => {
    // Array de ExercisePerformance
    let wordObjectId = word._id
    let userObjectId =  mongoose.Types.ObjectId(userId)
    const result = ExercisePerformance.find({ user: userObjectId, word: wordObjectId })
    result.then(performances => {
        return performances; // Procesar el resultado aquí si se necesita
    });
}


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


module.exports = {
    getPerformanceByWorId
}