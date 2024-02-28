import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { RawMaterialPurchaseI, RawMaterialPurchaseMutation } from '../../types';
import {
  createRawMaterialsPurchase,
  deleteRawMaterialsPurchase,
  fetchRawMaterialsPurchases
} from './purchaseThunks';

interface RawMaterialsPurchaseState {
  rawMaterialsPurchase: RawMaterialPurchaseI[],
  oneRawMaterial: RawMaterialPurchaseMutation | null;
  createRawMaterialPurchaseLoading: boolean;
  fetchRawMaterialsPurchaseLoading: boolean;
  deleteRawMaterialPurchaseLoading: false | string;
}

const initialState: RawMaterialsPurchaseState = {
  rawMaterialsPurchase: [],
  oneRawMaterial: null,
  createRawMaterialPurchaseLoading: false,
  fetchRawMaterialsPurchaseLoading: false,
  deleteRawMaterialPurchaseLoading: false
};

export const rawMaterialsPurchaseSlice = createSlice({
  name: 'rawMaterialPurchase',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createRawMaterialsPurchase.pending, (state) => {
      state.createRawMaterialPurchaseLoading = true;
    }).addCase(createRawMaterialsPurchase.fulfilled, state => {
      state.createRawMaterialPurchaseLoading = false;
    }).addCase(createRawMaterialsPurchase.rejected, state => {
      state.createRawMaterialPurchaseLoading = false;
    });

    builder.addCase(fetchRawMaterialsPurchases.pending, (state) => {
      state.fetchRawMaterialsPurchaseLoading = true;
    }).addCase(fetchRawMaterialsPurchases.fulfilled, (state, {payload}) => {
      state.fetchRawMaterialsPurchaseLoading = false;
      state.rawMaterialsPurchase = payload;
    }).addCase(fetchRawMaterialsPurchases.rejected, state => {
      state.fetchRawMaterialsPurchaseLoading = false;
    });

    builder.addCase(deleteRawMaterialsPurchase.pending, (state, {meta}) => {
      state.deleteRawMaterialPurchaseLoading = meta.arg;
    }).addCase(deleteRawMaterialsPurchase.fulfilled, (state) => {
      state.deleteRawMaterialPurchaseLoading = false;
    }).addCase(deleteRawMaterialsPurchase.rejected, (state) => {
      state.deleteRawMaterialPurchaseLoading = false;
    });
  }
});

export const rawMaterialPurchaseReducer = rawMaterialsPurchaseSlice.reducer;

export const selectRawMaterialsPurchase = (state: RootState) => state.rawMaterialPurchase.rawMaterialsPurchase;
export const selectCreateRawMaterialsPurchaseLoading = (state: RootState) => state.rawMaterialPurchase.createRawMaterialPurchaseLoading;
export const selectFetchRawMaterialsPurchaseLoading = (state: RootState) => state.rawMaterialPurchase.fetchRawMaterialsPurchaseLoading;
export const selectDeleteRawMaterialsPurchaseLoading = (state: RootState) => state.rawMaterialPurchase.deleteRawMaterialPurchaseLoading;
