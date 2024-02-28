import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProductSalesI, ProductSalesMutation } from '../../types';
import axiosApi from '../../axiosApi';


export const createProductSales = createAsyncThunk<void, ProductSalesMutation>(
  'productSales/create',
  async (productSalesData) => {
    const newProductSales: ProductSalesMutation = {
      product_id: productSalesData.product_id,
      employee_id: productSalesData.employee_id,
      sale_date: productSalesData.sale_date,
      amount: productSalesData.amount,
      quantity: productSalesData.quantity,
    };

    await axiosApi.post('/product-sales', newProductSales);
  },
);

export const fetchProductSales = createAsyncThunk<ProductSalesI[], undefined>(
  'productSales/fetchAll',
  async () => {
    const response = await axiosApi.get<ProductSalesI[]>('/product-sales');
    return response.data;
  },
);

export const deleteProductSales = createAsyncThunk<void, string>(
  'productSales/delete',
  async (id) => {
    try {
      await axiosApi.delete(`/product-sales/${id}`);
    } catch (error: any) {
      if (error.response.status === 500) {
        console.error('Internal Server Error:', error.message);
      } else if (error.response.status === 400) {
        alert('This Raw ProductSales is using in other table!');
      }
    }
  },
);

