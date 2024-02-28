import React, { useEffect, useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { SelectChangeEvent } from '@mui/material/Select';
import { Link } from 'react-router-dom';
import { FinishedProductMutation, UnitsI } from '../../../types';

interface Props {
  onSubmit: (product: FinishedProductMutation) => void;
  units: UnitsI[] | undefined;
  isLoading: boolean;
  existingProduct?: FinishedProductMutation | null;
}

const initialSate: FinishedProductMutation = {
  name: '',
  unit_of_measure_id: '',
  quantity: '',
  amount: '',
};

const FinishedProductForm: React.FC<Props> = ({onSubmit, isLoading, existingProduct, units}) => {
  if (!existingProduct) {
    existingProduct = initialSate;
  }
  const [products, setProducts] = useState<FinishedProductMutation>(existingProduct);

  useEffect(() => {
    if (existingProduct) {
      setProducts(existingProduct);
    }
  }, [existingProduct]);

  const onPositionSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(products);

    setProducts({
      name: '',
      unit_of_measure_id: '',
      quantity: '',
      amount: '',
    });
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setProducts(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const selectChangeHandler = (e: SelectChangeEvent) => {
    const {name, value} = e.target;
    setProducts(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };


  return (
    <>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': {width: '45ch', mt: 1},
        }}
        onSubmit={onPositionSubmit}
      >
        <div>
          <TextField
            label="Name"
            required
            id="name"
            name="name"
            value={products.name}
            onChange={inputChangeHandler}
          />
        </div>
        <div style={{maxWidth: '405px', margin: '8px 0'}}>
          <FormControl fullWidth>
            <InputLabel id="position_id">Units</InputLabel>
            <Select
              id="unit_of_measure_id"
              required
              labelId="demo-simple-select-label"
              value={products.unit_of_measure_id}
              name="unit_of_measure_id"
              label="Unit of measure *"
              onChange={(e) => selectChangeHandler(e)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {units && units.map(item => (
                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <TextField
            label="Quantity"
            type="number"
            required
            id="quantity"
            name="quantity"
            value={products.quantity}
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
            value={products.amount}
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
          startIcon={<SaveIcon/>}
          sx={{mt: 1}}
        >
          Save
        </LoadingButton>
        <Button
          type="button"
          variant="contained"
          sx={{mt: 1, ml: 1}}
          component={Link}
          to="/products"
        >
          Back
        </Button>
      </Box>
    </>
  );
};

export default FinishedProductForm;