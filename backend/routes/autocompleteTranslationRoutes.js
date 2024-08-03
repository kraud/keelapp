const express = require('express')
const router = express.Router()
const { getVerbES, getVerbDE, getNounDE } = require('../controllers/autocompleteTranslationController')
const {protect} = require('../middleware/authMiddleware')

router.get('/spanish/verb/:infinitiveVerb', protect, getVerbES)

router.get('/german/verb/:infinitiveVerb', protect, getVerbDE)

router.get('/german/noun/:singularNominativeNoun', protect, getNounDE)

module.exports = router