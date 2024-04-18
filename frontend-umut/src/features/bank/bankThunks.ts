import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { BankMutation, IBank } from '../../types';
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


