const express = require('express')
const router = express.Router()
const { getVerbES, getVerbDE, getNounDE, getNounGenderES } = require('../controllers/autocompleteTranslationController')
const {protect} = require('../middleware/authMiddleware')

router.get('/spanish/verb/:infinitiveVerb', protect, getVerbES)
router.get('/spanish/noun/:singularNominativeNoun', protect, getNounGenderES)

router.get('/german/verb/:infinitiveVerb', protect, getVerbDE)
router.get('/german/noun/:singularNominativeNoun', protect, getNounDE)

module.exports = router