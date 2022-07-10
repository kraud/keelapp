const express = require('express')
const router = express.Router()
const { getWords, setWord, updateWord, deleteWords } = require('../controllers/wordController')

router.get('/', getWords)

router.post('/', setWord)

router.put('/:id', updateWord)

router.delete('/:id', deleteWords)

module.exports = router