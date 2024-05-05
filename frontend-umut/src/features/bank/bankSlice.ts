import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { createNewCredit, fetchBanks, fetchBanksByDate } from './bankThunks';
import { IBank } from '../../types';

interface BankState {
  banks: IBank[];
  creating: boolean;
  fetchingBank: boolean;
}

const initialState: BankState = {
  banks: [],
  creating: false,
  fetchingBank: false,
};

const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {},
  extraReducers: (builder => {
    builder.addCase(createNewCredit.pending, (state) => {
      state.creating = true;
    }).addCase(createNewCredit.fulfilled, (state) => {
      state.creating = false;
    }).addCase(createNewCredit.rejected, (state) => {
      state.creating = false;
    });

    builder.addCase(fetchBanks.pending, state => {
      state.fetchingBank = true;
    }).addCase(fetchBanks.fulfilled, (state, { payload }) => {
      state.banks = payload;
      state.fetchingBank = false;
    }).addCase(fetchBanks.rejected, state => {
      state.fetchingBank = false;
    });

    builder.addCase(fetchBanksByDate.pending, state => {
      state.fetchingBank = true;
    }).addCase(fetchBanksByDate.fulfilled, (state, { payload }) => {
      state.banks = payload;
      state.fetchingBank = false;
    }).addCase(fetchBanksByDate.rejected, state => {
      state.fetchingBank = false;
    });
  }),
});

export const bankReducer = bankSlice.reducer;
export const selectBanks = (state: RootState) => state.bank.banks;
export const selectBankCreating = (state: RootState) => state.bank.creating;
export const selectBankFetching = (state: RootState) => state.bank.fetchingBank;
