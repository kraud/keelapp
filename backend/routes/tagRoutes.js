const express = require('express')
const router = express.Router()
const { searchTags, getUserTags, getTagById, createTag, deleteTag, updateTag} = require('../controllers/tagController')
const {protect} = require('../middleware/authMiddleware')

router.get('/getTags', protect, getUserTags)
router.get('/searchTags', protect, searchTags)
router.get('/:id', protect, getTagById)
router.post('/', protect, createTag)
router.delete('/:id', protect, deleteTag)
router.put('/:id', protect, updateTag)

// TODO: implement to eventually replace from wordController:
// router.get('/getAmountByTag', protect, getAmountByTag)

module.exports = router