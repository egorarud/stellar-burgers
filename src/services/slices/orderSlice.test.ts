import { expect, test, describe } from '@jest/globals';
import orderReducer, {
  getOrderThunk,
  getOrdersThunk
} from '../slices/orderSlice';
import orderMock from '../../../cypress/fixtures/order.json';
import ordersMock from '../../../cypress/fixtures/orders.json';
import { configureStore } from '@reduxjs/toolkit';

describe('тест асинхронного экшена getOrdersThunk', () => {
  const mockResponse = {
    success: true,
    orders: ordersMock.orders
  };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })
  ) as jest.Mock;

  test('тест загрузки заказов', async () => {
    const store = configureStore({
      reducer: { order: orderReducer }
    });

    await store.dispatch(getOrdersThunk());

    const { orders, isLoading } = store.getState().order;
    expect(orders).toEqual(mockResponse.orders);
    expect(isLoading).toEqual(false);
  });

  test('должен установить loading в true при pending', () => {
    const store = configureStore({
      reducer: { order: orderReducer }
    });

    store.dispatch({ type: getOrdersThunk.pending.type });

    const { isLoading } = store.getState().order;
    expect(isLoading).toEqual(true);
  });

  test('должен установить error при rejected', () => {
    const store = configureStore({
      reducer: { order: orderReducer }
    });

    store.dispatch({
      type: getOrdersThunk.rejected.type,
      error: { message: 'Error' }
    });

    const { isLoading, error } = store.getState().order;
    expect(isLoading).toEqual(false);
    expect(error).toBeDefined();
  });
});

describe('тест асинхронного экшена getOrderThunk', () => {
  const mockResponse = {
    success: true,
    orders: ordersMock.orders
  };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })
  ) as jest.Mock;

  test('тест загрузки заказа', async () => {
    const store = configureStore({
      reducer: { order: orderReducer }
    });

    await store.dispatch(getOrderThunk(77155));

    const { orderModalData, isLoading } = store.getState().order;
    expect(orderModalData).toEqual(mockResponse.orders[0]);
    expect(isLoading).toEqual(false);
  });

  test('должен установить loading в true при pending', () => {
    const store = configureStore({
      reducer: { order: orderReducer }
    });

    store.dispatch({ type: getOrderThunk.pending.type });

    const { isLoading } = store.getState().order;
    expect(isLoading).toEqual(true);
  });

  test('должен установить error при rejected', () => {
    const store = configureStore({
      reducer: { order: orderReducer }
    });

    store.dispatch({
      type: getOrderThunk.rejected.type,
      error: { message: 'Error' }
    });

    const { isLoading, error } = store.getState().order;
    expect(isLoading).toEqual(false);
    expect(error).toBeDefined();
  });
});
