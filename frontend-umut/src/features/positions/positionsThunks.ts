import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { PositionI } from '../../types';

export const createPositions = createAsyncThunk<void, string>(
  'position/create',
  async (position) => {
    const newPosition = {
      name: position,
    };
    await axiosApi.post('/position', newPosition);
  }
);

export const fetchPositions = createAsyncThunk<PositionI[], undefined>(
  'position/fetch',
  async () => {
    const response = await axiosApi.get<PositionI[]>('/position');
    return response.data;
  }
);

export const deletePosition = createAsyncThunk<void, string>(
  'position/delete',
  async (id) => {
    try {
      await axiosApi.delete(`/position/${id}`);
    } catch (error: any) {
      if (error.response.status === 500) {
        console.error('Internal Server Error:', error.message);
      } else if (error.response.status === 400) {
        alert('This position is using in Employee!');
      }
    }
  },
);


export const editPosition = createAsyncThunk<void, PositionI>(
  'position/edit',
  async ({position_id, position_name}) => {
    const updatePosition: PositionI = {
      position_id,
      position_name,
    };
    await axiosApi.put('/position', updatePosition);
  },
);

export const fetchOnePosition = createAsyncThunk<PositionI, string>(
  'position/fetchOne',
  async (id) => {
    const response = await axiosApi.get<PositionI>(`/position/${id}`);
    return response.data;
  },
);