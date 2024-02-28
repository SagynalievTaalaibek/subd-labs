import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { Link } from 'react-router-dom';
import { BudgetMutation } from '../../../types';

interface Props {
  onSubmit: (budget: BudgetMutation) => void;
  isLoading: boolean;
  existingAmount?: BudgetMutation;
}

const initialBudget: BudgetMutation = {
  budget_amount: '',
  bonus: '',
  markup: '',
};

const BudgetForm: React.FC<Props> = ({ isLoading, onSubmit, existingAmount = initialBudget }) => {
  const [budgetState, setBudgetState] = useState<BudgetMutation>(existingAmount);

  useEffect(() => {
    setBudgetState(existingAmount);
  }, [existingAmount]);

  const onChatSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSubmit(budgetState);
    setBudgetState({
      budget_amount: '',
      bonus: '',
      markup: '',
    });
  };

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBudgetState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { width: '45ch', mt: 1 },
        }}
        onSubmit={onChatSubmit}
      >
        <div>
          <TextField
            label="Budget"
            id="budget_amount"
            name="budget_amount"
            type="number"
            required
            value={budgetState.budget_amount}
            onChange={inputChange}
          />
        </div>
        <div>
          <TextField
            label="Bonus"
            id="bonus"
            name="bonus"
            type="number"
            error={parseFloat(budgetState.bonus) > 999.99 || parseFloat(budgetState.bonus) < -999.99}
            required
            value={budgetState.bonus}
            onChange={inputChange}
          />
        </div>
        <div>
          <TextField
            label="Markup"
            id="markup"
            name="markup"
            type="number"
            error={parseFloat(budgetState.markup) > 999.99 || parseFloat(budgetState.markup) < -999.99}
            required
            value={budgetState.markup}
            onChange={inputChange}
          />
        </div>
        <LoadingButton
          type="submit"
          color="primary"
          variant="contained"
          disabled={isLoading ||
            parseFloat(budgetState.markup) > 999.99 ||
            parseFloat(budgetState.markup) < -999.99 ||
            parseFloat(budgetState.bonus) > 999.99 ||
            parseFloat(budgetState.bonus) < -999.99
          }
          loading={isLoading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          sx={{ mt: 1 }}
        >
          Save
        </LoadingButton>
        <Button
          type="button"
          variant="contained"
          sx={{ mt: 1, ml: 1 }}
          component={Link}
          to="/budget"
        >
          Back
        </Button>
      </Box>
    </>
  );
};

export default BudgetForm;