import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { createMaterial, deleteMaterial, editMaterial, fetchMaterials, fetchOneMaterial } from './materialThunks';
import { RawMaterialI, RawMaterialMutation } from '../../types';

interface materialsState {
  materials: RawMaterialI[],
  oneMaterial: RawMaterialMutation | null;
  createMaterialsLoading: boolean;
  fetchMaterialsLoading: boolean;
  fetchOneMaterialsLoading: boolean;
  editMaterialsLoading: boolean;
  deleteMaterialsLoading: false | string;
}

const initialState: materialsState = {
  materials: [],
  oneMaterial: null,
  createMaterialsLoading: false,
  fetchMaterialsLoading: false,
  fetchOneMaterialsLoading: false,
  editMaterialsLoading: false,
  deleteMaterialsLoading: false
};

export const materialsSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createMaterial.pending, (state) => {
      state.createMaterialsLoading = true;
    }).addCase(createMaterial.fulfilled, state => {
      state.createMaterialsLoading = false;
    }).addCase(createMaterial.rejected, state => {
      state.createMaterialsLoading = false;
    });

    builder.addCase(fetchMaterials.pending, (state) => {
      state.createMaterialsLoading = true;
    }).addCase(fetchMaterials.fulfilled, (state, {payload}) => {
      state.createMaterialsLoading = false;
      state.materials = payload;
    }).addCase(fetchMaterials.rejected, state => {
      state.createMaterialsLoading = false;
    });

    builder.addCase(fetchOneMaterial.pending, (state) => {
      state.fetchOneMaterialsLoading = true;
    }).addCase(fetchOneMaterial.fulfilled, (state, {payload}) => {
      state.fetchOneMaterialsLoading = false;
      state.oneMaterial = payload;
    }).addCase(fetchOneMaterial.rejected, state => {
      state.fetchOneMaterialsLoading = false;
    });

    builder.addCase(editMaterial.pending, (state) => {
      state.editMaterialsLoading = true;
    }).addCase(editMaterial.fulfilled, (state) => {
      state.editMaterialsLoading = false;
    }).addCase(editMaterial.rejected, state => {
      state.editMaterialsLoading = false;
    });

    builder.addCase(deleteMaterial.pending, (state, {meta}) => {
      state.deleteMaterialsLoading = meta.arg;
    }).addCase(deleteMaterial.fulfilled, (state) => {
      state.deleteMaterialsLoading = false;
    }).addCase(deleteMaterial.rejected, (state) => {
      state.deleteMaterialsLoading = false;
    });
  }
});

export const materialReducer = materialsSlice.reducer;

export const selectMaterials = (state: RootState) => state.materials.materials;
export const selectOneMaterial = (state: RootState) => state.materials.oneMaterial;
export const selectCreateMaterialLoading = (state: RootState) => state.materials.createMaterialsLoading;
export const selectFetchMaterialsLoading = (state: RootState) => state.materials.fetchMaterialsLoading;
export const selectFetchOneMaterialLoading = (state: RootState) => state.materials.fetchOneMaterialsLoading;
export const selectEditMaterialLoading = (state: RootState) => state.materials.editMaterialsLoading;
export const selectDeleteMaterialLoading = (state: RootState) => state.materials.deleteMaterialsLoading;
