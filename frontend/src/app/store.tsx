import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import wordReducer from '../features/words/wordSlice'
import notificationReducer from '../features/notifications/notificationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    words: wordReducer,
    notifications: notificationReducer,
  },
});