const express = require('express')
const router = express.Router()
const {getExercises} = require('../controllers/tagController')
const {protect} = require('../middleware/authMiddleware')

router.get('/getExercises', protect, getExercises)

module.exports = router