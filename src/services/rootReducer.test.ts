import { expect, test, describe } from '@jest/globals';
import { rootReducer } from '../services/rootReducer';
import ingredientsReducer from './slices/ingredientsSlice';
import feedsReducer from './slices/feedSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';

describe('Инициализация rootReducer', () => {
  test('инициализация rootReducer', () => {
    const expectedInitialState = {
      feed: feedsReducer(undefined, { type: '@@INIT' }),
      ingredients: ingredientsReducer(undefined, { type: '@@INIT' }),
      user: userReducer(undefined, { type: '@@INIT' }),
      order: orderReducer(undefined, { type: '@@INIT' })
    };

    expect(rootReducer(undefined, { type: '@@INIT' })).toEqual(
      expectedInitialState
    );
  });
});
