const express = require('express')
const router = express.Router()
const { getUserTags, getTagById, createTag, deleteTag, updateTag} = require('../controllers/tagController')
const {protect} = require('../middleware/authMiddleware')

router.get('/getTags', protect, getUserTags)
router.get('/:id', protect, getTagById)
router.post('/', protect, createTag)
router.delete('/:id', protect, deleteTag)
router.put('/:id', protect, updateTag)


module.exports = router