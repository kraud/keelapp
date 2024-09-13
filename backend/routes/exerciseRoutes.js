const express = require('express')
const router = express.Router()
const {getExercises} = require('../controllers/exerciseController')
const {protect} = require('../middleware/authMiddleware')

router.get('/getUserExercises', protect, getExercises)

module.exports = router