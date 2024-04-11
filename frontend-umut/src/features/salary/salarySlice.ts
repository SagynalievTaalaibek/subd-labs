import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  fetchOneSalary,
  fetchSalary,
  fetchUpdateSalary,
  issueSalary,
  updateSalary,
  updateSalaryIssuedBudget,
} from './salaryThunks';
import { SalaryI } from '../../types';

interface SalaryState {
  salaryData: SalaryI[];
  oneSalary: SalaryI | null;
  fetchSalary: boolean;
  fetchOneSalary: boolean;
  updateSalary: boolean;
  updateData: {
    id: string;
    general: string;
  } | null;
}

const initialState: SalaryState = {
  salaryData: [],
  oneSalary: null,
  fetchSalary: false,
  fetchOneSalary: false,
  updateSalary: false,
  updateData: null,
};

const salarySlice = createSlice({
  name: 'salary',
  initialState,
  reducers: {
    updateDataReducer(
      state,
      action: PayloadAction<{ id: string; general: string } | null>,
    ) {
      state.updateData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalary.pending, (state) => {
        state.fetchSalary = true;
      })
      .addCase(fetchSalary.fulfilled, (state, { payload }) => {
        state.fetchSalary = false;
        state.salaryData = payload;
      })
      .addCase(fetchSalary.rejected, (state) => {
        state.fetchSalary = false;
      });

    builder
      .addCase(issueSalary.pending, (state) => {
        state.updateSalary = true;
      })
      .addCase(issueSalary.fulfilled, (state) => {
        state.updateSalary = false;
      })
      .addCase(issueSalary.rejected, (state) => {
        state.updateSalary = false;
      });

    builder
      .addCase(fetchOneSalary.pending, (state) => {
        state.fetchOneSalary = true;
      })
      .addCase(fetchOneSalary.fulfilled, (state, { payload }) => {
        state.fetchOneSalary = false;
        state.oneSalary = payload;
      })
      .addCase(fetchOneSalary.rejected, (state) => {
        state.fetchOneSalary = false;
      });

    builder
      .addCase(updateSalary.pending, (state) => {
        state.updateSalary = true;
      })
      .addCase(updateSalary.fulfilled, (state) => {
        state.updateSalary = false;
      })
      .addCase(updateSalary.rejected, (state) => {
        state.updateSalary = false;
      });

    builder
      .addCase(updateSalaryIssuedBudget.pending, (state) => {
        state.updateSalary = true;
      })
      .addCase(updateSalaryIssuedBudget.fulfilled, (state) => {
        state.updateSalary = false;
      })
      .addCase(updateSalaryIssuedBudget.rejected, (state) => {
        state.updateSalary = false;
      });

    builder
      .addCase(fetchUpdateSalary.pending, (state) => {
        state.fetchSalary = true;
      })
      .addCase(fetchUpdateSalary.fulfilled, (state, { payload }) => {
        state.fetchSalary = false;
        state.salaryData = payload;
      })
      .addCase(fetchUpdateSalary.rejected, (state) => {
        state.fetchSalary = false;
      });
  },
});

export const salaryReducer = salarySlice.reducer;
export const { updateDataReducer } = salarySlice.actions;
export const selectSalary = (state: RootState) => state.salary.salaryData;
export const selectOneSalary = (state: RootState) => state.salary.oneSalary;
export const selectSalaryFetchLoading = (state: RootState) =>
  state.salary.fetchSalary;
export const selectSalaryFetchOneLoading = (state: RootState) =>
  state.salary.fetchOneSalary;
export const selectSalaryUpdateLoading = (state: RootState) =>
  state.salary.updateSalary;

export const selectUpdateData = (state: RootState) => state.salary.updateData;
