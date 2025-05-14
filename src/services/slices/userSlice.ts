import {
  loginUserApi,
  registerUserApi,
  TRegisterData,
  TLoginData,
  getUserApi,
  logoutApi,
  updateUserApi
} from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (userData: TRegisterData) => registerUserApi(userData)
);

export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (userData: TLoginData) => loginUserApi(userData)
);

export const getUserThunk = createAsyncThunk('user/user', getUserApi);

export const logoutUserThunk = createAsyncThunk('user/logout', logoutApi);

export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

export interface userState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: TUser | null;
  error: string | undefined;
}

const initialState: userState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  error: undefined
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    getUser: (state) => state.user,
    getError: (state) => state.error,
    isAuthCheked: (state) => state.isAuthChecked,
    isAuthenticated: (state) => state.isAuthenticated
  },
  extraReducers: (builder) => {
    builder.addCase(registerUserThunk.pending, (state) => {
      state.isAuthenticated = false;
      state.error = undefined;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.isAuthenticated = false;
      state.error = action.error.message;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.isAuthChecked = true;
      setCookie('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    });

    builder.addCase(loginUserThunk.pending, (state) => {
      state.isAuthenticated = false;
      state.error = undefined;
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.isAuthenticated = false;
      state.error = action.error.message;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      setCookie('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    });

    builder.addCase(getUserThunk.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isAuthChecked = true;
    });

    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.user = null;
      deleteCookie('accessToken');
      localStorage.clear();
    });

    builder.addCase(updateUserThunk.pending, (state) => {
      state.error = undefined;
    });
    builder.addCase(updateUserThunk.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(updateUserThunk.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });
  }
});

export const { getUser, getError, isAuthCheked, isAuthenticated } =
  userSlice.selectors;
export default userSlice.reducer;
