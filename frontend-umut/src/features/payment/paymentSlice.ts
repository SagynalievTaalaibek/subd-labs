import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { PaymentMutation, PaymentResponse } from '../../types';
import { fetchCreditByBankId, getPaymentList, payCredit } from './paymentThunks';

interface CreditState {
  creditData: PaymentResponse[],
  oneCredit: PaymentMutation | null
  fetchingCredit: boolean;
  payCredit: boolean;
}

const initialState: CreditState = {
  creditData: [],
  oneCredit: null,
  fetchingCredit: false,
  payCredit: false,
};

const creditSlice = createSlice({
  name: 'credit',
  initialState,
  reducers: {},
  extraReducers: (builder => {
    builder.addCase(fetchCreditByBankId.pending, (state) => {
      state.fetchingCredit = true;
    }).addCase(fetchCreditByBankId.fulfilled, (state, {payload}) => {
      state.oneCredit = payload;
      state.fetchingCredit = false;
    }).addCase(fetchCreditByBankId.rejected, (state) => {
      state.fetchingCredit = false;
    })

    builder.addCase(payCredit.pending, (state) => {
      state.payCredit = true;
    }).addCase(payCredit.fulfilled, (state) => {
      state.payCredit = false;
    }).addCase(payCredit.rejected, (state) => {
      state.payCredit = false;
    })

    builder.addCase(getPaymentList.pending, (state) => {
      state.fetchingCredit = true;
    }).addCase(getPaymentList.fulfilled, (state, {payload}) => {
      state.creditData = payload;
      state.fetchingCredit = false;
    }).addCase(getPaymentList.rejected, (state) => {
      state.fetchingCredit = false;
    })
  }),
});

export const creditReducer = creditSlice.reducer;
export const selectCreditData = (state: RootState) => state.credit.creditData;
export const selectOneCredit = (state: RootState) => state.credit.oneCredit;
export const selectCreditFetching = (state: RootState) => state.credit.fetchingCredit;
export const selectCreditCreating = (state: RootState) => state.credit.payCredit;