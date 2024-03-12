import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { FinishedProductI, FinishedProductMutation, FinishedProductWithId } from '../../types';

export const createProduct = createAsyncThunk<void, FinishedProductMutation>(
  'product/create',
  async (product) => {
    const newProduct: FinishedProductMutation = {
      name: product.name,
      amount: product.amount,
      quantity: product.quantity,
      unit_of_measure_id: product.unit_of_measure_id,
    };

    await axiosApi.post('/finished-product', newProduct);
  }
);

export const fetchProducts = createAsyncThunk<FinishedProductI[], undefined>(
  'product/fetchAll',
  async () => {
    const response = await axiosApi.get<FinishedProductI[]>('/finished-product');
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk<void, string>(
  'product/delete',
  async (id) => {
    try {
      await axiosApi.delete(`/finished-product/${id}`);
    } catch (error: any) {
      if (error.response.status === 500) {
        console.error('Internal Server Error:', error.message);
      } else if (error.response.status === 400) {
        alert('This Product is using in Ingredients!');
      }
    }
  },
);


export const editProduct = createAsyncThunk<void, FinishedProductWithId>(
  'product/edit',
  async (product) => {
    const updateProduct: FinishedProductWithId = {
      id: product.id,
      name: product.name,
      unit_of_measure_id: product.unit_of_measure_id,
      amount: product.amount,
      quantity: product.quantity,
    };

    await axiosApi.put('/finished-product', updateProduct);
  },
);

export const fetchOneProduct = createAsyncThunk<FinishedProductMutation, string>(
  'product/fetchOne',
  async (id) => {
    const response = await axiosApi.get<FinishedProductWithId>(`/finished-product/${id}`);
    const oneProduct = response.data;
    const productMutation: FinishedProductMutation = {
      name: oneProduct.name,
      unit_of_measure_id: oneProduct.unit_of_measure_id,
      amount: oneProduct.amount,
      quantity: oneProduct.quantity,
    };

    return productMutation;
  },
);

interface ProductMinus {
  id: string;
  amount: string;
  quantity: string
}

export const productMinusUpdate = createAsyncThunk<void, ProductMinus>(
  'material/minus',
  async (product) => {
    const updateMaterial = {
      id: product.id,
      amount: product.amount,
      quantity: product.quantity,
    };

    await axiosApi.put('/finished-product-minus', updateMaterial);
  },
);

export const productPlusUpdate = createAsyncThunk<void, ProductMinus>(
  'material/plus',
  async (product) => {
    const updateMaterial = {
      id: product.id,
      amount: product.amount,
      quantity: product.quantity,
    };

    await axiosApi.put('/finished-product-plus', updateMaterial);
  },
);