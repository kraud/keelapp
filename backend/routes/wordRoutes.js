const express = require('express')
const router = express.Router()
const {
    getWords, setWord, updateWord, deleteWords, getWordsSimplified, getWordById, filterWordByAnyTranslation, getTags,
    getAmountByTag, getAllWordDataByUserId
} = require('../controllers/wordController')
const {protect} = require('../middleware/authMiddleware')
const {getAllTagWordDataByUserId} = require("../controllers/tagController");

router.get('/', protect, getWords)

router.get('/simple', protect, getWordsSimplified)

router.get('/searchWord', protect, filterWordByAnyTranslation)

router.get('/searchTag', protect, getTags)

router.get('/getAmountByTag', protect, getAmountByTag)

router.get('/getAllWordDataByWord/:id', protect, getAllWordDataByUserId)

router.get('/:id', protect, getWordById)

router.post('/', protect, setWord)

router.put('/:id', protect, updateWord)

router.delete('/:id', protect, deleteWords)

module.exports = router