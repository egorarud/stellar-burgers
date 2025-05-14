import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import feedsReducer from './slices/feedSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';

export const rootReducer = combineReducers({
  feed: feedsReducer,
  ingredients: ingredientsReducer,
  user: userReducer,
  order: orderReducer
});
