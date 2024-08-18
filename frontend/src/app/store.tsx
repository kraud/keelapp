import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import wordReducer from '../features/words/wordSlice'
import notificationReducer from '../features/notifications/notificationSlice'
import friendshipReducer from '../features/friendships/friendshipSlice'
import userReducer from '../features/users/userSlice'
import tagReducer from '../features/tags/tagSlice'
import autocompletedTranslationReducer from '../features/autocompletedTranslation/autocompletedTranslationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    words: wordReducer,
    notifications: notificationReducer,
    friendships: friendshipReducer,
    tags: tagReducer,
    autocompletedTranslations: autocompletedTranslationReducer,
  },
});

export type AppDispatch = typeof store.dispatch