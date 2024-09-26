const express = require('express')
const router = express.Router()
const {getExercises} = require('../controllers/exerciseController')
const {saveExerciseResult} = require ('../controllers/exercisePerformanceController')
const {protect} = require('../middleware/authMiddleware')

router.get('/getUserExercises', protect, getExercises)
router.post('/saveExerciseResult', protect, saveExerciseResult)

module.exports = router