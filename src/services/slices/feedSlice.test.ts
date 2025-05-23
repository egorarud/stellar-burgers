import { expect, test, describe } from '@jest/globals';
import feedsReducer, { getFeedThunk } from '../slices/feedSlice';
import feedsMock from '../../../cypress/fixtures/feeds.json';
import { configureStore } from '@reduxjs/toolkit';

describe('тест асинхронных экшенов feedSlice', () => {
  const mockResponse = {
    success: true,
    orders: feedsMock.orders,
    total: feedsMock.total,
    totalToday: feedsMock.totalToday
  };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })
  ) as jest.Mock;

  test('тест загрузки заказов', async () => {
    const store = configureStore({
      reducer: { feeds: feedsReducer }
    });

    await store.dispatch(getFeedThunk());

    const { ordersData, isLoading } = store.getState().feeds;
    expect(ordersData?.orders).toEqual(mockResponse.orders);
    expect(isLoading).toEqual(false);
    expect(ordersData?.total).toEqual(mockResponse.total);
    expect(ordersData?.totalToday).toEqual(mockResponse.totalToday);
  });

  test('должен установить loading в true при pending', () => {
    const store = configureStore({
      reducer: { feeds: feedsReducer }
    });

    store.dispatch({ type: getFeedThunk.pending.type });

    const { isLoading } = store.getState().feeds;
    expect(isLoading).toEqual(true);
  });

  test('должен установить error при rejected', () => {
    const store = configureStore({
      reducer: { feeds: feedsReducer }
    });

    store.dispatch({
      type: getFeedThunk.rejected.type,
      error: { message: 'Error' }
    });

    const { isLoading, error } = store.getState().feeds;
    expect(isLoading).toEqual(false);
    expect(error).toBeDefined();
  });
});
