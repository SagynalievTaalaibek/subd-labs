import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { RawMaterialPurchaseI, RawMaterialPurchaseMutation, ReportMutation } from '../../types';

export const createRawMaterialsPurchase = createAsyncThunk<void, RawMaterialPurchaseMutation>(
  'rawMaterialPurchase/create',
  async (rawMaterialPurchase) => {
    const newRawMaterialsPurchase: RawMaterialPurchaseMutation = {
      raw_material_id: rawMaterialPurchase.raw_material_id,
      employee_id: rawMaterialPurchase.employee_id,
      purchase_date: rawMaterialPurchase.purchase_date,
      quantity: rawMaterialPurchase.quantity,
      amount: rawMaterialPurchase.amount,
    };

    await axiosApi.post('/raw-purchase', newRawMaterialsPurchase);
  }
);

export const fetchRawMaterialsPurchases = createAsyncThunk<RawMaterialPurchaseI[], undefined>(
  'rawMaterialPurchase/fetchAll',
  async () => {
    const response = await axiosApi.get<RawMaterialPurchaseI[]>('/raw-purchase');
    return response.data;
  }
);

export const fetchRawMaterialsPurchasesByDate = createAsyncThunk<RawMaterialPurchaseI[], ReportMutation>(
  'rawMaterialPurchase/fetchAllByDate',
  async (date) => {
    const response = await axiosApi.get<RawMaterialPurchaseI[]>(`/raw-purchase?startDate=${date.startDate}&endDate=${date.endDate}`);
    return response.data;
  }
);

export const deleteRawMaterialsPurchase = createAsyncThunk<void, string>(
  'rawMaterialPurchase/delete',
  async (id) => {
    try {
      await axiosApi.delete(`/raw-purchase/${id}`);
    } catch (error: any) {
      if (error.response.status === 500) {
        console.error('Internal Server Error:', error.message);
      } else if (error.response.status === 400) {
        alert('This Raw Material Purchase is using in other table!');
      }
    }
  },
);
