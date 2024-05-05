import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { ProductionI, ProductionMutation, ReportMutation } from '../../types';

export const creteProduction = createAsyncThunk<void, ProductionMutation>(
  'production/create',
  async (productionData) => {
    try {
      const newProduction: ProductionMutation = {
        product_id: productionData.product_id,
        employee_id: productionData.employee_id,
        production_date: productionData.production_date,
        quantity: productionData.quantity,
      };

      await axiosApi.post('/production', newProduction);
    } catch (error: any) {
      if (error.response.status === 500) {
        console.error('Internal Server Error:', error.message);
      } else if (error.response.status === 400) {
        alert('We don not have enough material!');
      }

      throw error;
    }
  },
);

export const fetchProduction = createAsyncThunk<ProductionI[]>(
  'production/fetchAll',
  async () => {
    const response = await axiosApi.get<ProductionI[]>('/production');
    return response.data;
  },
);

export const fetchProductionByDate = createAsyncThunk<ProductionI[], ReportMutation>(
  'production/fetchAllByDate',
  async (date) => {
    const response = await axiosApi.get<ProductionI[]>(`/production?startDate=${date.startDate}&endDate=${date.endDate}`);
    return response.data;
  },
);

export const deleteProduction = createAsyncThunk<void, string>(
  'production/delete',
  async (id) => {
    try {
      await axiosApi.delete(`/production/${id}`);
    } catch (error: any) {
      if (error.response.status === 500) {
        console.error('Internal Server Error:', error.message);
      } else if (error.response.status === 400) {
        alert('This Production Product is using in other table!');
      }
    }
  },
);
