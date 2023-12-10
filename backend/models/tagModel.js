const mongoose = require('mongoose')

const tagSchema = mongoose.Schema(
    {
        // author: id of the user that created this tag
        author:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        // TODO: should have a 'subscriber' list in case other users (that are not the author) are subscribed to this tag?
        // text used to identify the tag (must be unique for the user)
        label: {
            type: String,
            required: [true, 'Please add a label for the tag'],
            // unique: true // TODO: should be unique for the user, not for the whole DB
        },
        // public: determines how the particular tag by this user can be filtered on search results
        public: { // 'type' as a property name can cause issues with mongoose when defining a schema
            type: String, // 'Public', 'Private', 'Friends-Only'
            required: [true, 'Please specify a tag public status'],
        },
        // list of wordIds that contain the current tag's ID in its 'tags' array
        // TODO: this would have to be updated when changes are made to a word. Potential 2nd source of truth? Should be avoided?
        wordsId: [{
            type: String
        }]
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model('Tag',  tagSchema)