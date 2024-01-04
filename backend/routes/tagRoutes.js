const express = require('express')
const router = express.Router()
const { searchTags, getUserTags, getTagById, createTag, deleteTag, updateTag, getAmountByTag, getOtherUserTags} = require('../controllers/tagController')
const {protect} = require('../middleware/authMiddleware')

router.get('/getTags', protect, getUserTags)
router.get('/getOtherUserTags', protect, getOtherUserTags)
router.get('/searchTags', protect, searchTags)
router.get('/:id', protect, getTagById)
router.get('/getAmountByTag/:id', protect, getAmountByTag)
router.post('/', protect, createTag)
router.delete('/:id', protect, deleteTag)
router.put('/:id', protect, updateTag)

module.exports = router