const express = require('express')
const router = express.Router()
const {getExercises} = require('../controllers/exerciseController')
const {saveTranslationPerformance, savePerformanceAction} = require ('../controllers/exercisePerformanceController')
const {protect} = require('../middleware/authMiddleware')

router.get('/getUserExercises', protect, getExercises)
router.post('/saveTranslationPerformance', protect, saveTranslationPerformance)
router.post('/savePerformanceAction', protect, savePerformanceAction)

module.exports = router