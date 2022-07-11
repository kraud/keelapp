const express = require('express')
const router = express.Router()
const { getWords, setWord, updateWord, deleteWords } = require('../controllers/wordController')
const {protect} = require('../middleware/authMiddleware')

router.get('/', protect, getWords)

router.post('/', protect,  setWord)

router.put('/:id', protect,  updateWord)

router.delete('/:id', protect,  deleteWords)

module.exports = router