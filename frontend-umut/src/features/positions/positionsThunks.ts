import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { IOnePosition, IRole, PositionI, PositionMutation } from '../../types';

export const createPositions = createAsyncThunk<void, PositionMutation>(
  'position/create',
  async (position) => {
    await axiosApi.post('/position', position);
  }
);

export const fetchPositions = createAsyncThunk<PositionI[], undefined>(
  'position/fetch',
  async () => {
    const response = await axiosApi.get<PositionI[]>('/position');
    return response.data;
  }
);

export const fetchRoles = createAsyncThunk<IRole[]>(
  'roles/fetch',
  async () => {
    const response = await axiosApi.get('/roles');
    return response.data;
  }
)

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

interface PositionWithOutId  {
  position_id: string;
  position_name: string;
  role_id: string;
}


export const editPosition = createAsyncThunk<void, PositionWithOutId>(
  'position/edit',
  async (position) => {
    await axiosApi.put('/position', position);
  },
);

export const fetchOnePosition = createAsyncThunk<IOnePosition, string>(
  'position/fetchOne',
  async (id) => {
    const response = await axiosApi.get(`/position/${id}`);
    return response.data;
  },
);