import {
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../../utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

export const orderThunk = createAsyncThunk(
  'order/order',
  async (ingredientsId: string[]) => orderBurgerApi(ingredientsId)
);

export const getOrderThunk = createAsyncThunk(
  'order/getOrder',
  async (id: number) => getOrderByNumberApi(id)
);

export const getOrdersThunk = createAsyncThunk('order/getOrders', getOrdersApi);

export interface orderState {
  isLoading: boolean;
  ingredientsId: string[];
  orderModalData: TOrder | null;
  orders: TOrder[];
  error: string | undefined;
}

const initialState: orderState = {
  isLoading: false,
  ingredientsId: [],
  orderModalData: null,
  orders: [],
  error: undefined
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsId: (state) => state.ingredientsId,
    getLoadingState: (state) => state.isLoading,
    getOrderModalState: (state) => state.orderModalData,
    getOrders: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder.addCase(orderThunk.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(orderThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(orderThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orderModalData = action.payload.order;
    });

    builder.addCase(getOrderThunk.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(getOrderThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(getOrderThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orderModalData = action.payload.orders[0];
    });

    builder.addCase(getOrdersThunk.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(getOrdersThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(getOrdersThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    });
  }
});

export const {
  getIngredientsId,
  getLoadingState,
  getOrderModalState,
  getOrders
} = orderSlice.selectors;

export default orderSlice.reducer;
