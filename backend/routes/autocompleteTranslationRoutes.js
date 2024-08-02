const express = require('express')
const router = express.Router()
const { getVerbES, getVerbDE } = require('../controllers/autocompleteTranslationController')
const {protect} = require('../middleware/authMiddleware')

router.get('/spanish/verb/:infinitiveVerb', protect, getVerbES)

router.get('/german/verb/:infinitiveVerb', protect, getVerbDE)

module.exports = router