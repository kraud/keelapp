import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import wordReducer from '../features/words/wordSlice'
import notificationReducer from '../features/notifications/notificationSlice'
import friendshipReducer from '../features/friendships/friendshipSlice'
import userReducer from '../features/users/userSlice'
import tagReducer from '../features/tags/tagSlice'
import metricReducer from '../features/metrics/metricSlice'
import autocompletedTranslationReducer from '../features/autocompletedTranslation/autocompletedTranslationSlice'
import exerciseReducer from '../features/exercises/exerciseSlice'
import exercisePerformanceReducer from '../features/exercisePerformance/exercisePerformanceSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    words: wordReducer,
    notifications: notificationReducer,
    friendships: friendshipReducer,
    tags: tagReducer,
    metrics: metricReducer,
    autocompletedTranslations: autocompletedTranslationReducer,
    exercises: exerciseReducer,
    exercisesPerformance: exercisePerformanceReducer
  },
})

export type AppDispatch = typeof store.dispatch