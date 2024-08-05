const express = require('express')
const router = express.Router()
const { getVerbES, getVerbDE, getNounDE,
    getNounGenderES, getVerbEN
} = require('../controllers/autocompleteTranslationController')
const {protect} = require('../middleware/authMiddleware')

router.get('/english/verb/:infinitiveVerb', protect, getVerbEN)

router.get('/spanish/verb/:infinitiveVerb', protect, getVerbES)
router.get('/spanish/noun/:singularNominativeNoun', protect, getNounGenderES)

router.get('/german/verb/:infinitiveVerb', protect, getVerbDE)
router.get('/german/noun/:singularNominativeNoun', protect, getNounDE)

module.exports = router