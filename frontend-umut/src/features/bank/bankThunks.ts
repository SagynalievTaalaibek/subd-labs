import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { BankMutation, IBank, ReportMutation } from '../../types';
import { BUDGET_ID } from '../../constants';

export const createNewCredit = createAsyncThunk<void, BankMutation>(
  'bank/createNewCredit',
  async (bankData) => {
    await axiosApi.post('/bank', {
      loan_date: bankData.loan_date,
      loan_amount: bankData.loan_amount,
      annual_interest_rate: bankData.annual_interest_rate,
      term_in_month: bankData.term_in_month,
      penalty: bankData.penalty,
      budgetId: BUDGET_ID,
    });
  },
);

export const fetchBanks = createAsyncThunk<IBank[]>(
  'bank/fetchAll',
  async () => {
    const result = await axiosApi.get('/bank');
    return result.data;
  },
);

export const fetchBanksByDate = createAsyncThunk<IBank[], ReportMutation>(
  'bank/fetchAllByDate',
  async (date) => {
    const result = await axiosApi.get(`/bank?startDate=${date.startDate}&endDate=${date.endDate}`);
    return result.data;
  },
);
