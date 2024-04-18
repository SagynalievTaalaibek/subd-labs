import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { BankMutation } from '../../../types';

interface Props {
  isLoading: boolean;
  onBankSubmit: (bank: BankMutation) => void;
}

const BankForm: React.FC<Props> = ({ isLoading, onBankSubmit }) => {
  const [bankValue, setBankValue] = useState<BankMutation>({
    loan_amount: '',
    loan_date: '',
    annual_interest_rate: '',
    penalty: '',
    term_in_month: '',
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onBankSubmit(bankValue);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setBankValue(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    setBankValue((prevState) => ({
      ...prevState,
      loan_date: formattedDate,
    }));
  }, []);

  return (
    <>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { width: '45ch', mt: 1 },
        }}
        onSubmit={onSubmit}
      >
        <div>
          <TextField
            label="Amount of credit"
            required
            id="loan_amount"
            name="loan_amount"
            value={bankValue.loan_amount}
            onChange={inputChangeHandler}
          />
        </div>
        <div>
          <TextField
            label="Duration in month"
            required
            id="term_in_month"
            name="term_in_month"
            value={bankValue.term_in_month}
            onChange={inputChangeHandler}
          />
        </div>
        <div>
          <TextField
            label="Annual Interest Rate"
            required
            id="annual_interest_rate"
            name="annual_interest_rate"
            value={bankValue.annual_interest_rate}
            onChange={inputChangeHandler}
          />
        </div>
        <div>
          <TextField
            label="Penalty"
            required
            id="penalty"
            name="penalty"
            value={bankValue.penalty}
            onChange={inputChangeHandler}
          />
        </div>
        <div>
          <TextField
            type="date"
            required
            id="loan_date"
            name="loan_date"
            value={bankValue.loan_date}
            onChange={inputChangeHandler}
          />
        </div>
        <LoadingButton
          type="submit"
          color="primary"
          variant="contained"
          disabled={isLoading}
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
          to="/bank"
        >
          Back
        </Button>
      </Box>
    </>
  );
};

export default BankForm;