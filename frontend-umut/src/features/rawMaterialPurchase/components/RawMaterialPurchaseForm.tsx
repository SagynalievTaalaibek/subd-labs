import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { selectBudget } from '../../budget/budgetSlice';
import { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import { FormControl, InputLabel, Select, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { EmployeesI, RawMaterialI, RawMaterialPurchaseMutation } from '../../../types';

interface Props {
  onSubmit: (rawMaterialPurchase: RawMaterialPurchaseMutation) => void;
  raw_material: RawMaterialI[];
  employees: EmployeesI[],
  isLoading: boolean;
  existingMaterialPurchase?: RawMaterialPurchaseMutation | null;
}

const initialSate: RawMaterialPurchaseMutation = {
  raw_material_id: '',
  employee_id: '',
  purchase_date: '',
  quantity: '',
  amount: '',
};

const RawMaterialPurchaseForm: React.FC<Props> = ({
  onSubmit,
  raw_material,
  employees,
  existingMaterialPurchase,
  isLoading,
}) => {
  if (!existingMaterialPurchase) {
    existingMaterialPurchase = initialSate;
  }
  const [rawMaterialPurchase, setRawMaterialPurchase] = useState<RawMaterialPurchaseMutation>(existingMaterialPurchase);
  const budgetData = useAppSelector(selectBudget);

  useEffect(() => {
    if (existingMaterialPurchase) {
      setRawMaterialPurchase(existingMaterialPurchase);
    }
  }, [existingMaterialPurchase]);

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    setRawMaterialPurchase(prevState => ({
      ...prevState,
      purchase_date: formattedDate,
    }));
  }, []);

  const onMaterialPurchaseSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (budgetData && parseFloat(budgetData.budget_amount) < parseFloat(rawMaterialPurchase.amount)) {
      setRawMaterialPurchase(prevState => ({
        ...prevState,
        amount: '',
      }));

      return;
    }
    onSubmit(rawMaterialPurchase);
    setRawMaterialPurchase({
      raw_material_id: '',
      employee_id: '',
      purchase_date: '',
      quantity: '',
      amount: '',
    });
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRawMaterialPurchase(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const selectChangeHandler = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setRawMaterialPurchase(prevState => ({
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
        onSubmit={onMaterialPurchaseSubmit}
      >

        <div style={{ maxWidth: '405px', margin: '8px 0' }}>
          <FormControl fullWidth>
            <InputLabel id="raw_material_id">Material</InputLabel>
            <Select
              id="raw_material_id"
              required
              labelId="demo-simple-select-label"
              value={rawMaterialPurchase.raw_material_id}
              name="raw_material_id"
              label="Material *"
              onChange={(e) => selectChangeHandler(e)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {raw_material && raw_material.map(item => (
                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div style={{ maxWidth: '405px', margin: '8px 0' }}>
          <FormControl fullWidth>
            <InputLabel id="employee_id">Employee</InputLabel>
            <Select
              id="employee_id"
              required
              labelId="demo-simple-select-label"
              value={rawMaterialPurchase.employee_id}
              name="employee_id"
              label="Employee *"
              onChange={(e) => selectChangeHandler(e)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {employees && employees.map(item => (
                <MenuItem key={item.employee_id} value={item.employee_id}>{item.full_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <TextField
            type="date"
            required
            id="purchase_date"
            name="purchase_date"
            value={rawMaterialPurchase.purchase_date}
            onChange={inputChangeHandler}
          />
        </div>
        <div>
          <TextField
            label="Quantity"
            type="number"
            required
            id="quantity"
            name="quantity"
            value={rawMaterialPurchase.quantity}
            onChange={inputChangeHandler}
          />
        </div>
        <div>
          <TextField
            label="Amount"
            required
            type="number"
            id="amount"
            name="amount"
            value={rawMaterialPurchase.amount}
            onChange={inputChangeHandler}
            error={!!(budgetData && parseFloat(budgetData.budget_amount) < parseFloat(rawMaterialPurchase.amount))}
            helperText={budgetData && parseFloat(budgetData.budget_amount) < parseFloat(rawMaterialPurchase.amount) ? 'You don not have enough money!' : ''}
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
          to="/purchase"
        >
          Back
        </Button>
      </Box>
    </>
  );
};

export default RawMaterialPurchaseForm;