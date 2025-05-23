import { expect, test, describe } from '@jest/globals';
import ingredientsReducer, {
  getIngredientsThunk
} from '../slices/ingredientsSlice';
import ingredientsMock from '../../../cypress/fixtures/ingredients.json';
import { configureStore } from '@reduxjs/toolkit';

describe('тест асинхронных экшенов ingredientsSlice', () => {
  const mockResponse = {
    success: true,
    data: ingredientsMock.data
  };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })
  ) as jest.Mock;

  test('тест загрузки ингредиентов', async () => {
    const store = configureStore({
      reducer: { ingredients: ingredientsReducer }
    });

    await store.dispatch(getIngredientsThunk());

    const { ingredients, isLoading } = store.getState().ingredients;
    expect(ingredients).toEqual(mockResponse.data);
    expect(isLoading).toEqual(false);
  });

  test('должен установить loading в true при pending', () => {
    const store = configureStore({
      reducer: { ingredients: ingredientsReducer }
    });

    store.dispatch({ type: getIngredientsThunk.pending.type });

    const { isLoading } = store.getState().ingredients;
    expect(isLoading).toEqual(true);
  });

  test('должен установить error при rejected', () => {
    const store = configureStore({
      reducer: { ingredients: ingredientsReducer }
    });

    store.dispatch({
      type: getIngredientsThunk.rejected.type,
      error: { message: 'Error' }
    });

    const { isLoading, error } = store.getState().ingredients;
    expect(isLoading).toEqual(false);
    expect(error).toBeDefined();
  });
});
