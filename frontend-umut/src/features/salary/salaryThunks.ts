import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { SalaryI } from '../../types';

interface DataYear {
  year: string;
  month: string;
}

export const fetchSalary = createAsyncThunk<SalaryI[], DataYear>(
  'salary/fetchAll',
  async ({ year, month }) => {
    const response = await axiosApi.get(`/salary?year=${year}&month=${month}}`);
    return response.data;
  },
);

export const fetchOneSalary = createAsyncThunk<SalaryI, string>(
  'salary/fetchOne',
  async (id) => {
    const response = await axiosApi.get(`/salary/${id}`);
    return response.data;
  },
);

export const issueSalary = createAsyncThunk<void, DataYear>(
  'salary/issue',
  async ({ year, month }) => {
    const data: DataYear = {
      month,
      year,
    };

    await axiosApi.patch('/salary', data);
  },
);

interface UpdateSalary {
  id: string;
  general: string;
}

export const updateSalary = createAsyncThunk<void, UpdateSalary>(
  'salary/update',
  async (data) => {
    await axiosApi.put('/salary', data);
  },
);

export const fetchUpdateSalary = createAsyncThunk<SalaryI[], DataYear>(
  'salary/fetchUpdateData',
  async ({ year, month }) => {
    const response = await axiosApi.get(
      `/salary/update?year=${year}}&month=${month}}`,
    );
    return response.data;
  },
);

interface UpdateIssuedBudget {
  budgetId: string;
  budgetAmountUpdate: string;
  yearNumber: string;
  monthNumber: string;
}

export const updateSalaryIssuedBudget = createAsyncThunk<
  void,
  UpdateIssuedBudget
>('salary/updateSalaryIssuedBudget', async (dataUpdate) => {
  await axiosApi.put('/salary/update_issued_budget', dataUpdate);
});
