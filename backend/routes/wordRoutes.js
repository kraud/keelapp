const express = require('express')
const router = express.Router()
const {
    getWords, setWord, updateWord, deleteWords, getWordsSimplified, getWordById, filterWordByAnyTranslation, getTags,
    getAmountByTag, getWordDataByRequest
} = require('../controllers/wordController')
const {protect} = require('../middleware/authMiddleware')

router.get('/', protect, getWords)

router.get('/simple', protect, getWordsSimplified)

router.get('/searchWord', protect, filterWordByAnyTranslation)

router.get('/searchTag', protect, getTags)

router.get('/getAmountByTag', protect, getAmountByTag)

router.get('/getAllWordDataByWord', protect, getWordDataByRequest) // TODO: this should be removed? Double check

router.get('/:id', protect, getWordById)

router.post('/', protect, setWord)

router.put('/:id', protect, updateWord)

router.delete('/:id', protect, deleteWords)

module.exports = router