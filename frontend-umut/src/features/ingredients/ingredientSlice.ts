import { createSlice } from '@reduxjs/toolkit';
import { IngredientI, IngredientMutation } from '../../types';
import { RootState } from '../../app/store';
import {
  createIngredient,
  deleteIngredient,
  editIngredient,
  fetchIngredients,
  fetchOneIngredient
} from './ingredientsThunks';

interface IngredientsState {
  ingredients: IngredientI[],
  oneIngredient: IngredientMutation | null;
  createIngredientsLoading: boolean;
  fetchIngredientsLoading: boolean;
  fetchOneIngredientsLoading: boolean;
  editIngredientsLoading: boolean;
  deleteIngredientsLoading: false | string;
}

const initialState: IngredientsState = {
  ingredients: [],
  oneIngredient: null,
  createIngredientsLoading: false,
  fetchIngredientsLoading: false,
  fetchOneIngredientsLoading: false,
  editIngredientsLoading: false,
  deleteIngredientsLoading: false
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createIngredient.pending, (state) => {
      state.createIngredientsLoading = true;
    }).addCase(createIngredient.fulfilled, state => {
      state.createIngredientsLoading = false;
    }).addCase(createIngredient.rejected, state => {
      state.createIngredientsLoading = false;
    });

    builder.addCase(fetchIngredients.pending, (state) => {
      state.createIngredientsLoading = true;
    }).addCase(fetchIngredients.fulfilled, (state, {payload}) => {
      state.createIngredientsLoading = false;
      state.ingredients = payload;
    }).addCase(fetchIngredients.rejected, state => {
      state.createIngredientsLoading = false;
    });

    builder.addCase(fetchOneIngredient.pending, (state) => {
      state.fetchOneIngredientsLoading = true;
    }).addCase(fetchOneIngredient.fulfilled, (state, {payload}) => {
      state.fetchOneIngredientsLoading = false;
      state.oneIngredient = payload;
    }).addCase(fetchOneIngredient.rejected, state => {
      state.fetchOneIngredientsLoading = false;
    });

    builder.addCase(editIngredient.pending, (state) => {
      state.editIngredientsLoading = true;
    }).addCase(editIngredient.fulfilled, (state) => {
      state.editIngredientsLoading = false;
    }).addCase(editIngredient.rejected, state => {
      state.editIngredientsLoading = false;
    });

    builder.addCase(deleteIngredient.pending, (state, {meta}) => {
      state.deleteIngredientsLoading = meta.arg;
    }).addCase(deleteIngredient.fulfilled, (state) => {
      state.deleteIngredientsLoading = false;
    }).addCase(deleteIngredient.rejected, (state) => {
      state.deleteIngredientsLoading = false;
    });
  }
});

export const ingredientReducer = ingredientsSlice.reducer;

export const selectIngredients = (state: RootState) => state.ingredients.ingredients;
export const selectOneIngredient = (state: RootState) => state.ingredients.oneIngredient;
export const selectCreateIngredientLoading = (state: RootState) => state.ingredients.createIngredientsLoading;
export const selectFetchIngredientsLoading = (state: RootState) => state.ingredients.fetchIngredientsLoading;
export const selectFetchOneIngredientLoading = (state: RootState) => state.ingredients.fetchOneIngredientsLoading;
export const selectEditIngredientLoading = (state: RootState) => state.ingredients.editIngredientsLoading;
export const selectDeleteIngredientLoading = (state: RootState) => state.ingredients.deleteIngredientsLoading;
