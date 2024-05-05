import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { creteProduction, deleteProduction, fetchProduction, fetchProductionByDate } from './productionThunks';
import { ProductionI } from '../../types';

interface ProductionState {
  productions: ProductionI[];
  createProductionLoading: boolean;
  fetchProductionLoading: boolean;
  deleteProductionLoading: boolean | string;
}

const initialState: ProductionState = {
  productions: [],
  createProductionLoading: false,
  deleteProductionLoading: false,
  fetchProductionLoading: false,
};

export const productionSlice = createSlice({
  name: 'production',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(creteProduction.pending, (state) => {
      state.createProductionLoading = true;
    }).addCase(creteProduction.fulfilled, (state) => {
      state.createProductionLoading = false;
    }).addCase(creteProduction.rejected, (state) => {
      state.createProductionLoading = false;
    });

    builder.addCase(fetchProduction.pending, (state) => {
      state.fetchProductionLoading = true;
    }).addCase(fetchProduction.fulfilled, (state, {payload}) => {
      state.fetchProductionLoading = false;
      state.productions = payload;
    }).addCase(fetchProduction.rejected, (state) => {
      state.fetchProductionLoading = false;
    });

    builder.addCase(fetchProductionByDate.pending, (state) => {
      state.fetchProductionLoading = true;
    }).addCase(fetchProductionByDate.fulfilled, (state, {payload}) => {
      state.fetchProductionLoading = false;
      state.productions = payload;
    }).addCase(fetchProductionByDate.rejected, (state) => {
      state.fetchProductionLoading = false;
    });

    builder.addCase(deleteProduction.pending, (state) => {
      state.deleteProductionLoading = true;
    }).addCase(deleteProduction.fulfilled, (state) => {
      state.deleteProductionLoading = false;
    }).addCase(deleteProduction.rejected, (state) => {
      state.deleteProductionLoading = false;
    });
  },
});

export const productionReducer = productionSlice.reducer;

export const selectProductions = (state: RootState) => state.production.productions;
export const selectProductionCreateLoading = (state: RootState) => state.production.createProductionLoading;
export const selectProductionFetchLoading = (state: RootState) => state.production.fetchProductionLoading;
export const selectProductionDeleteLoading = (state: RootState) => state.production.deleteProductionLoading;