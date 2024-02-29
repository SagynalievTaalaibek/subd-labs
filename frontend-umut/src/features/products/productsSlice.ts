import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { createProduct, deleteProduct, editProduct, fetchOneProduct, fetchProducts } from './productThunks';
import { FinishedProductI, FinishedProductMutation } from '../../types';

interface ProductsState {
  products: FinishedProductI[],
  oneProduct: FinishedProductMutation | null;
  createProductsLoading: boolean;
  fetchProductsLoading: boolean;
  fetchOneProductsLoading: boolean;
  editProductsLoading: boolean;
  deleteProductsLoading: false | string;
}

const initialState: ProductsState = {
  products: [],
  oneProduct: null,
  createProductsLoading: false,
  fetchProductsLoading: false,
  fetchOneProductsLoading: false,
  editProductsLoading: false,
  deleteProductsLoading: false
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createProduct.pending, (state) => {
      state.createProductsLoading = true;
    }).addCase(createProduct.fulfilled, state => {
      state.createProductsLoading = false;
    }).addCase(createProduct.rejected, state => {
      state.createProductsLoading = false;
    });

    builder.addCase(fetchProducts.pending, (state) => {
      state.createProductsLoading = true;
    }).addCase(fetchProducts.fulfilled, (state, {payload}) => {
      state.createProductsLoading = false;
      state.products = payload;
    }).addCase(fetchProducts.rejected, state => {
      state.createProductsLoading = false;
    });

    builder.addCase(fetchOneProduct.pending, (state) => {
      state.fetchOneProductsLoading = true;
    }).addCase(fetchOneProduct.fulfilled, (state, {payload}) => {
      state.fetchOneProductsLoading = false;
      state.oneProduct = payload;
    }).addCase(fetchOneProduct.rejected, state => {
      state.fetchOneProductsLoading = false;
    });

    builder.addCase(editProduct.pending, (state) => {
      state.editProductsLoading = true;
    }).addCase(editProduct.fulfilled, (state) => {
      state.editProductsLoading = false;
    }).addCase(editProduct.rejected, state => {
      state.editProductsLoading = false;
    });

    builder.addCase(deleteProduct.pending, (state, {meta}) => {
      state.deleteProductsLoading = meta.arg;
    }).addCase(deleteProduct.fulfilled, (state) => {
      state.deleteProductsLoading = false;
    }).addCase(deleteProduct.rejected, (state) => {
      state.deleteProductsLoading = false;
    });
  }
});

export const productsReducer = productsSlice.reducer;

export const selectProducts = (state: RootState) => state.products.products;
export const selectOneProducts = (state: RootState) => state.products.oneProduct;
export const selectCreateProductsLoading = (state: RootState) => state.products.createProductsLoading;
export const selectFetchProductsLoading = (state: RootState) => state.products.fetchProductsLoading;
export const selectFetchOneProductsLoading = (state: RootState) => state.products.fetchOneProductsLoading;
export const selectEditProductsLoading = (state: RootState) => state.products.editProductsLoading;
export const selectDeleteProductsLoading = (state: RootState) => state.products.deleteProductsLoading;
