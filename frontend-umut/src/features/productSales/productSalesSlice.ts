import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { createProductSales, deleteProductSales, fetchProductSales } from './productSalesThunks';
import { ProductSalesI } from '../../types';

interface ProductSalesState {
  productSales: ProductSalesI[],
  createProductSalesLoading: boolean;
  fetchProductSalesLoading: boolean;
  deleteProductSalesLoading: false | string;
}

const initialState: ProductSalesState = {
  productSales: [],
  createProductSalesLoading: false,
  fetchProductSalesLoading: false,
  deleteProductSalesLoading: false
};

export const productSalesSlice = createSlice({
  name: 'productSales',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createProductSales.pending, (state) => {
      state.createProductSalesLoading = true;
    }).addCase(createProductSales.fulfilled, state => {
      state.createProductSalesLoading = false;
    }).addCase(createProductSales.rejected, state => {
      state.createProductSalesLoading = false;
    });

    builder.addCase(fetchProductSales.pending, (state) => {
      state.createProductSalesLoading = true;
    }).addCase(fetchProductSales.fulfilled, (state, {payload}) => {
      state.createProductSalesLoading = false;
      state.productSales = payload;
    }).addCase(fetchProductSales.rejected, state => {
      state.createProductSalesLoading = false;
    });


    builder.addCase(deleteProductSales.pending, (state, {meta}) => {
      state.deleteProductSalesLoading = meta.arg;
    }).addCase(deleteProductSales.fulfilled, (state) => {
      state.deleteProductSalesLoading = false;
    }).addCase(deleteProductSales.rejected, (state) => {
      state.deleteProductSalesLoading = false;
    });
  }
});

export const productSalesReducer = productSalesSlice.reducer;

export const selectProductSales = (state: RootState) => state.productSales.productSales;
export const selectCreateProductSalesLoading = (state: RootState) => state.productSales.createProductSalesLoading;
export const selectFetchProductSalesLoading = (state: RootState) => state.productSales.fetchProductSalesLoading;
export const selectDeleteProductSalesLoading = (state: RootState) => state.productSales.deleteProductSalesLoading;
