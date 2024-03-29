const express = require('express')
const router = express.Router()
const {
    getWords, setWord, updateWord, deleteWord, getWordsSimplified, getWordById, filterWordByAnyTranslation,
    getWordDataByRequest
} = require('../controllers/wordController')
const {protect} = require('../middleware/authMiddleware')

router.get('/', protect, getWords)

router.get('/simple', protect, getWordsSimplified)

router.get('/searchWord', protect, filterWordByAnyTranslation)

router.get('/getAllWordDataByWord', protect, getWordDataByRequest) // TODO: this should be removed? Double check

router.get('/:id', protect, getWordById)

router.post('/', protect, setWord)

router.put('/:id', protect, updateWord)

router.delete('/:id', protect, deleteWord)

module.exports = router