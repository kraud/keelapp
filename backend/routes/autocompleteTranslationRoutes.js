const express = require('express')
const router = express.Router()
const { getVerbES } = require('../controllers/autocompleteTranslationController')
const {protect} = require('../middleware/authMiddleware')

router.get('/spanish/verb/:infinitiveVerb', protect, getVerbES)

module.exports = router