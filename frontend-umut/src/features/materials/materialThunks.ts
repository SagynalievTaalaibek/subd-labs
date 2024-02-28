import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { RawMaterialI, RawMaterialMutation, RawMaterialWithID } from '../../types';

export const createMaterial = createAsyncThunk<void, RawMaterialMutation>(
  'material/create',
  async (material) => {
    const newMaterial: RawMaterialMutation = {
      name: material.name,
      amount: material.amount,
      quantity: material.quantity,
      unit_of_measure_id: material.unit_of_measure_id,
    };

    await axiosApi.post('/raw-materials', newMaterial);
  }
);

export const fetchMaterials = createAsyncThunk<RawMaterialI[], undefined>(
  'material/fetchAll',
  async () => {
    const response = await axiosApi.get<RawMaterialI[]>('/raw-materials');
    return response.data;
  }
);

export const deleteMaterial = createAsyncThunk<void, string>(
  'material/delete',
  async (id) => {
    try {
      await axiosApi.delete(`/raw-materials/${id}`);
    } catch (error: any) {
      if (error.response.status === 500) {
        console.error('Internal Server Error:', error.message);
      } else if (error.response.status === 400) {
        alert('This Raw Material is using in Ingredients!');
      }
    }
  },
);


export const editMaterial = createAsyncThunk<void, RawMaterialWithID>(
  'material/edit',
  async (material) => {
    const updateMaterial: RawMaterialWithID = {
      id: material.id,
      name: material.name,
      unit_of_measure_id: material.unit_of_measure_id,
      amount: material.amount,
      quantity: material.quantity,
    };

    await axiosApi.put('/raw-materials', updateMaterial);
  },
);

interface AddMinusAmount {
  id: string;
  amount: string;
  quantity: string;
}
export const addAmountQuantityMaterial = createAsyncThunk<void, AddMinusAmount>(
  'material/add',
  async (material) => {
    const updateMaterial = {
      id: material.id,
      amount: material.amount,
      quantity: material.quantity,
    };

    await axiosApi.put('/raw-materials-add', updateMaterial);
  },
);

export const minusAmountQuantityMaterial = createAsyncThunk<void, AddMinusAmount>(
  'material/minus',
  async (material) => {
    const updateMaterial = {
      id: material.id,
      amount: material.amount,
      quantity: material.quantity,
    };

    await axiosApi.put('/raw-materials-minus', updateMaterial);
  },
);

export const fetchOneMaterial = createAsyncThunk<RawMaterialMutation, string>(
  'material/fetchOne',
  async (id) => {
    const response = await axiosApi.get<RawMaterialWithID>(`/raw-materials/${id}`);
    const oneMaterial = response.data;
    const materialMutation: RawMaterialMutation = {
      name: oneMaterial.name,
      unit_of_measure_id: oneMaterial.unit_of_measure_id,
      amount: oneMaterial.amount,
      quantity: oneMaterial.quantity,
    };

    return materialMutation;
  },
);