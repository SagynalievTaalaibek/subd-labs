import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  createPositions,
  deletePosition,
  editPosition,
  fetchOnePosition,
  fetchPositions,
  fetchRoles,
} from './positionsThunks';
import { IOnePosition, IRole, PositionI } from '../../types';

interface PositionsState {
  positions: PositionI[],
  roles: IRole[],
  onePosition: IOnePosition | null;
  createPositionLoading: boolean;
  fetchPositionLoading: boolean;
  fetchOnePositionLoading: boolean;
  editPositionLoading: boolean;
  deletePositionLoading: false | string;
}

const initialState: PositionsState = {
  positions: [],
  roles: [],
  onePosition: null,
  createPositionLoading: false,
  fetchPositionLoading: false,
  fetchOnePositionLoading: false,
  editPositionLoading: false,
  deletePositionLoading: false
};

export const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createPositions.pending, (state) => {
      state.createPositionLoading = true;
    }).addCase(createPositions.fulfilled, state => {
      state.createPositionLoading = false;
    }).addCase(createPositions.rejected, state => {
      state.createPositionLoading = false;
    });

    builder.addCase(fetchPositions.pending, (state) => {
      state.createPositionLoading = true;
    }).addCase(fetchPositions.fulfilled, (state, {payload}) => {
      state.createPositionLoading = false;
      state.positions = payload;
    }).addCase(fetchPositions.rejected, state => {
      state.createPositionLoading = false;
    });

    builder.addCase(fetchRoles.pending, (state) => {
      state.createPositionLoading = true;
    }).addCase(fetchRoles.fulfilled, (state, {payload}) => {
      state.createPositionLoading = false;
      state.roles = payload;
    }).addCase(fetchRoles.rejected, state => {
      state.createPositionLoading = false;
    });

    builder.addCase(fetchOnePosition.pending, (state) => {
      state.fetchOnePositionLoading = true;
    }).addCase(fetchOnePosition.fulfilled, (state, {payload}) => {
      state.fetchOnePositionLoading = false;
      state.onePosition = payload;
    }).addCase(fetchOnePosition.rejected, state => {
      state.fetchOnePositionLoading = false;
    });

    builder.addCase(editPosition.pending, (state) => {
      state.editPositionLoading = true;
    }).addCase(editPosition.fulfilled, (state) => {
      state.editPositionLoading = false;
    }).addCase(editPosition.rejected, state => {
      state.editPositionLoading = false;
    });

    builder.addCase(deletePosition.pending, (state, {meta}) => {
      state.deletePositionLoading = meta.arg;
    }).addCase(deletePosition.fulfilled, (state) => {
      state.deletePositionLoading = false;
    }).addCase(deletePosition.rejected, (state) => {
      state.deletePositionLoading = false;
    });
  }
});

export const positionsReducer = positionsSlice.reducer;

export const selectPositions = (state: RootState) => state.positions.positions;
export const selectRoles = (state: RootState) => state.positions.roles;
export const selectOnePosition = (state: RootState) => state.positions.onePosition;
export const selectCreatePositionLoading = (state: RootState) => state.positions.createPositionLoading;
export const selectFetchPositionLoading = (state: RootState) => state.positions.fetchPositionLoading;
export const selectFetchOnePositionLoading = (state: RootState) => state.positions.fetchOnePositionLoading;
export const selectEditPositionLoading = (state: RootState) => state.positions.editPositionLoading;
export const selectDeletePositionLoading = (state: RootState) => state.positions.deletePositionLoading;
