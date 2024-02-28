import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Typography from '@mui/material/Typography';
import { BUDGET_ID } from '../../constants';
import { editBudget, fetchBudget } from './budgetThunks';
import { selectBudget, selectEditBudgetLoading } from './budgetSlice';
import BudgetForm from './components/BudgetForm';
import { BudgetI, BudgetMutation } from '../../types';

const EditBudget = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const editBudgetLoading = useAppSelector(selectEditBudgetLoading);
  const budget = useAppSelector(selectBudget);

  let existingBudget: BudgetMutation = {
    budget_amount: '',
    bonus: '',
    markup: '',
  };

  if (budget) {
    existingBudget = {
      budget_amount: budget.budget_amount,
      markup: budget.markup,
      bonus: budget.bonus,
    };
  }


  useEffect(() => {
    dispatch(fetchBudget());
  }, [dispatch]);

  const onSubmit = async (budget: BudgetMutation) => {
    const updateBudget: BudgetI = {
      id: BUDGET_ID,
      budget_amount: budget.budget_amount,
      markup: budget.markup,
      bonus: budget.bonus,
    };

    await dispatch(editBudget(updateBudget));
    navigate('/budget');
  };


  return (
    <>
      <Typography variant="h4" sx={{ margin: '10px 0', fontWeight: 'bold' }}>Update Budget</Typography>
      <BudgetForm onSubmit={onSubmit} existingAmount={existingBudget} isLoading={editBudgetLoading} />
    </>
  );
};

export default EditBudget;