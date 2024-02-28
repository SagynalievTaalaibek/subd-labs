import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { UnitsI } from '../../types';

export const createUnits = createAsyncThunk<void, string>(
  'unit/create',
  async (unit) => {
    const newUnit = {
      name: unit,
    };
    await axiosApi.post('/units', newUnit);
  }
);

export const fetchUnits = createAsyncThunk<UnitsI[], undefined>(
  'unit/fetchAll',
  async () => {
    const response = await axiosApi.get<UnitsI[]>('/units');
    return response.data;
  }
);

export const deleteUnit = createAsyncThunk<void, string>(
  'unit/delete',
  async (id) => {
    try {
      await axiosApi.delete(`/units/${id}`);
    } catch (error: any) {
      if (error.response.status === 500) {
        console.error('Internal Server Error:', error.message);
      } else if (error.response.status === 400) {
        alert('This units is using in Material or Finish Product!');
      }
    }
  },
);


export const editUnit = createAsyncThunk<void, UnitsI>(
  'unit/edit',
  async (units) => {
    const updateUnit: UnitsI = {
      id: units.id,
      name: units.name,
    };

    await axiosApi.put('/units', updateUnit);
  },
);

export const fetchOneUnit = createAsyncThunk<UnitsI, string>(
  'Unit/fetchOne',
  async (id) => {
    const response = await axiosApi.get<UnitsI>(`/units/${id}`);
    return response.data;
  },
);