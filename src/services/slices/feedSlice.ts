import { getFeedsApi } from '../../utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

export const getFeedThunk = createAsyncThunk('feed/getFeed', getFeedsApi);

export interface feedsState {
  isInit: boolean;
  isLoading: boolean;
  ordersData: TOrdersData | null;
  error: string | undefined;
}

const initialState: feedsState = {
  isInit: false,
  isLoading: false,
  ordersData: null,
  error: undefined
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeedState: (state) => state.ordersData,
    getLoadingState: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder.addCase(getFeedThunk.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(getFeedThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(getFeedThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.ordersData = action.payload;
    });
  }
});

export const { getFeedState, getLoadingState } = feedSlice.selectors;

export default feedSlice.reducer;
