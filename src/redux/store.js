import { combineReducers, configureStore } from '@reduxjs/toolkit'

import userReducer from './userSlice'

let rootReducer = combineReducers({
    user: userReducer,
})


export const store = configureStore({
  reducer: rootReducer,
})