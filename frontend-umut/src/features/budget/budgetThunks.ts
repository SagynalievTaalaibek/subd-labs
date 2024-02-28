import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { BudgetI } from '../../types';

export const fetchBudget = createAsyncThunk<BudgetI, undefined>(
  'budget/fetchAll',
  async () => {
    const response = await axiosApi.get<BudgetI>('/budget');
    return response.data;
  },
);


export const editBudget = createAsyncThunk<void, BudgetI>(
  'budget/edit',
  async (budget) => {
    const updateBudget: BudgetI = {
      id: budget.id,
      budget_amount: budget.budget_amount,
      bonus: budget.bonus,
      markup: budget.markup,
    };

    await axiosApi.put('/budget', updateBudget);
  },
);

interface BudgetUpdate {
  id: string;
  budget_amount: string;
}

export const addSumBudget = createAsyncThunk<void, BudgetUpdate>(
  'budget/addSum',
  async (budget) => {
    const addBudget = {
      id: budget.id,
      budget_amount: budget.budget_amount,
    };

    await axiosApi.put('/budget-add', addBudget);
  },
);

export const minusSumBudget = createAsyncThunk<void, BudgetUpdate>(
  'budget/minusSum',
  async (budget) => {
    const minusBudget = {
      id: budget.id,
      budget_amount: budget.budget_amount,
    };

    await axiosApi.put('/budget-minus', minusBudget);
  },
);
