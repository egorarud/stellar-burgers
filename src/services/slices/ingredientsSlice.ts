import { getIngredientsApi } from '../../utils/burger-api';
import {
  createSlice,
  createAsyncThunk,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import {
  TIngredient,
  TConstructorIngredient,
  TConstructorItem
} from '@utils-types';

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/getIngredients',
  getIngredientsApi
);

export interface ingredientsState {
  isLoading: boolean;
  ingredients: TIngredient[];
  constructorItem: TConstructorItem;
  error: string | undefined;
}

const initialState: ingredientsState = {
  isLoading: false,
  ingredients: [],
  constructorItem: {
    bun: null,
    ingredients: []
  },
  error: undefined
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItem.bun = action.payload;
        } else {
          state.constructorItem.ingredients =
            state.constructorItem.ingredients.concat([action.payload]);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    removeIngredient: (state, action) => {
      state.constructorItem.ingredients =
        state.constructorItem.ingredients.filter(
          (elem) => elem.id !== action.payload.id
        );
    },
    moveIngredientUp: (
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) => {
      const newIngredients = [...state.constructorItem.ingredients];
      const { index, direction } = action.payload;

      const diff = direction === 'up' ? -1 : 1;
      [newIngredients[index], newIngredients[index + diff]] = [
        newIngredients[index + diff],
        newIngredients[index]
      ];

      state.constructorItem.ingredients = newIngredients;
    },
    clearConstructor: (state) => {
      state.constructorItem = {
        bun: null,
        ingredients: []
      };
    }
  },
  selectors: {
    getIngredients: (state) => state.ingredients,
    getLoadingState: (state) => state.isLoading,
    getConstructorItem: (state) => state.constructorItem
  },
  extraReducers: (builder) => {
    builder.addCase(getIngredientsThunk.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(getIngredientsThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(getIngredientsThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.ingredients = action.payload;
    });
  }
});

export const { getIngredients, getLoadingState, getConstructorItem } =
  ingredientsSlice.selectors;
export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  clearConstructor
} = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
