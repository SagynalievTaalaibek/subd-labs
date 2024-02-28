import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { createUnits, deleteUnit, editUnit, fetchOneUnit, fetchUnits } from './unitThunks';
import { UnitsI } from '../../types';

interface UnitsState {
  units: UnitsI[],
  oneUnit: UnitsI | null;
  createUnitLoading: boolean;
  fetchUnitLoading: boolean;
  fetchOneUnitLoading: boolean;
  editUnitLoading: boolean;
  deleteUnitLoading: false | string;
}

const initialState: UnitsState = {
  units: [],
  oneUnit: null,
  createUnitLoading: false,
  fetchUnitLoading: false,
  fetchOneUnitLoading: false,
  editUnitLoading: false,
  deleteUnitLoading: false
};

export const unitsSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createUnits.pending, (state) => {
      state.createUnitLoading = true;
    }).addCase(createUnits.fulfilled, state => {
      state.createUnitLoading = false;
    }).addCase(createUnits.rejected, state => {
      state.createUnitLoading = false;
    });

    builder.addCase(fetchUnits.pending, (state) => {
      state.createUnitLoading = true;
    }).addCase(fetchUnits.fulfilled, (state, {payload}) => {
      state.createUnitLoading = false;
      state.units = payload;
    }).addCase(fetchUnits.rejected, state => {
      state.createUnitLoading = false;
    });

    builder.addCase(fetchOneUnit.pending, (state) => {
      state.fetchOneUnitLoading = true;
    }).addCase(fetchOneUnit.fulfilled, (state, {payload}) => {
      state.fetchOneUnitLoading = false;
      state.oneUnit = payload;
    }).addCase(fetchOneUnit.rejected, state => {
      state.fetchOneUnitLoading = false;
    });

    builder.addCase(editUnit.pending, (state) => {
      state.editUnitLoading = true;
    }).addCase(editUnit.fulfilled, (state) => {
      state.editUnitLoading = false;
    }).addCase(editUnit.rejected, state => {
      state.editUnitLoading = false;
    });

    builder.addCase(deleteUnit.pending, (state, {meta}) => {
      state.deleteUnitLoading = meta.arg;
    }).addCase(deleteUnit.fulfilled, (state) => {
      state.deleteUnitLoading = false;
    }).addCase(deleteUnit.rejected, (state) => {
      state.deleteUnitLoading = false;
    });
  }
});

export const unitsReducer = unitsSlice.reducer;

export const selectUnits = (state: RootState) => state.units.units;
export const selectOneUnit = (state: RootState) => state.units.oneUnit;
export const selectCreateUnitLoading = (state: RootState) => state.units.createUnitLoading;
export const selectFetchUnitLoading = (state: RootState) => state.units.fetchUnitLoading;
export const selectFetchOneUnitLoading = (state: RootState) => state.units.fetchOneUnitLoading;
export const selectEditUnitLoading = (state: RootState) => state.units.editUnitLoading;
export const selectDeleteUnitLoading = (state: RootState) => state.units.deleteUnitLoading;
