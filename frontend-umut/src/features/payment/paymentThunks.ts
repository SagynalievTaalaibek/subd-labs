import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaymentMutation, PaymentMutationWithoutPenalty, PaymentResponse } from '../../types';
import axiosApi from '../../axiosApi';
import { BUDGET_ID } from '../../constants';

export const fetchCreditByBankId = createAsyncThunk<PaymentMutation, string>(
  'credit/fetchId',
  async (id) => {
    const result = await axiosApi.get<PaymentMutation>(`/bank/${id}`);
    return result.data;
  },
);


export const payCredit = createAsyncThunk<void, PaymentMutationWithoutPenalty>(
  'credit/createCredit',
  async (data) => {
    await axiosApi.post('/bank/pay', {
      loan_part: data.loan_part,
      percent_amount: data.percent_amount,
      penalty_amount: data.penalty_amount,
      total_amount: data.total_amount,
      payment_date: data.payment_date,
      payment_received_date: data.payment_received_date,
      overdue: data.overdue,
      rest_money: data.rest_money,
      bank_id: data.bank_id,
      budget_id: BUDGET_ID,
    });
  },
);

export const getPaymentList = createAsyncThunk<PaymentResponse[], string>(
  'credit/getPaymentList',
  async (id) => {
    const result = await axiosApi.get(`/bank/list/${id}`);
    return result.data;
  }
)