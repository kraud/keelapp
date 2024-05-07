const express = require('express')
const router = express.Router()
const {
    searchTags, getUserTags, getTagById, createTag, deleteTag, updateTag, getAmountByTag, getOtherUserTags,
    getTagDataByRequest, addExternalTag, checkIfTagLabelInUse
} = require('../controllers/tagController')
const {protect} = require('../middleware/authMiddleware')

router.get('/getTags', protect, getUserTags)
router.get('/getOtherUserTags', protect, getOtherUserTags)
router.get('/searchTags', protect, searchTags)
router.get('/filterTags', protect, getTagDataByRequest) // TODO: this should be removed? Double check
router.get('/:id', protect, getTagById)
router.post('/addExternalTag', protect, addExternalTag)
router.post('/checkIfTagLabelInUse', protect, checkIfTagLabelInUse)
router.get('/getAmountByTag/:id', protect, getAmountByTag)
router.post('/', protect, createTag)
router.delete('/:id', protect, deleteTag)
router.put('/:id', protect, updateTag)

module.exports = router