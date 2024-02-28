import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { addSumBudget, editBudget, fetchBudget } from './budgetThunks';
import { BudgetI } from '../../types';

interface BudgetState {
  budget: BudgetI | null,
  fetchBudgetLoading: boolean;
  editBudgetLoading: boolean;
  addBudgetLoading: boolean;
}

const initialState: BudgetState = {
  budget: null,
  fetchBudgetLoading: false,
  editBudgetLoading: false,
  addBudgetLoading: false,
};

export const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBudget.pending, (state) => {
      state.fetchBudgetLoading = true;
    }).addCase(fetchBudget.fulfilled, (state, {payload}) => {
      state.fetchBudgetLoading = false;
      state.budget = payload;
    }).addCase(fetchBudget.rejected, state => {
      state.fetchBudgetLoading = false;
    });

    builder.addCase(editBudget.pending, (state) => {
      state.editBudgetLoading = true;
    }).addCase(editBudget.fulfilled, (state) => {
      state.editBudgetLoading = false;
    }).addCase(editBudget.rejected, state => {
      state.editBudgetLoading = false;
    });

    builder.addCase(addSumBudget.pending, (state) => {
      state.addBudgetLoading = true;
    }).addCase(addSumBudget.fulfilled, (state) => {
      state.addBudgetLoading = false;
    }).addCase(addSumBudget.rejected, state => {
      state.addBudgetLoading = false;
    });
  }
});

export const budgetReducer = budgetSlice.reducer;

export const selectBudget = (state: RootState) => state.budgets.budget;
export const selectFetchBudgetLoading = (state: RootState) => state.budgets.fetchBudgetLoading;
export const selectEditBudgetLoading = (state: RootState) => state.budgets.editBudgetLoading;
export const selectAddBudgetLoading = (state: RootState) => state.budgets.addBudgetLoading;
