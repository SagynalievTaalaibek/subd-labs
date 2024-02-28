import React, { useEffect, useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import { FormControl, InputLabel, Select, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { RawMaterialMutation, UnitsI } from '../../../types';

interface Props {
  onSubmit: (material: RawMaterialMutation) => void;
  units: UnitsI[];
  isLoading: boolean;
  existingMaterial?: RawMaterialMutation | null;
}

const initialSate: RawMaterialMutation = {
  name: '',
  unit_of_measure_id: '',
  quantity: '',
  amount: '',
};

const RawMaterialForm: React.FC<Props> = ({onSubmit, isLoading, existingMaterial, units}) => {
  if (!existingMaterial) {
    existingMaterial = initialSate;
  }
  const [material, setMaterial] = useState<RawMaterialMutation>(existingMaterial);

  useEffect(() => {
    if (existingMaterial) {
      setMaterial(existingMaterial);
    }
  }, [existingMaterial]);

  const onMaterialSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(material);
    setMaterial({
      name: '',
      unit_of_measure_id: '',
      quantity: '',
      amount: '',
    });
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setMaterial(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const selectChangeHandler = (e: SelectChangeEvent) => {
    const {name, value} = e.target;
    setMaterial(prevState => ({
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
        onSubmit={onMaterialSubmit}
      >
        <div>
          <TextField
            label="Name"
            required
            id="name"
            name="name"
            value={material.name}
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
              value={material.unit_of_measure_id}
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
            value={material.quantity}
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
            value={material.amount}
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
          to="/materials"
        >
          Back
        </Button>
      </Box>
    </>
  );
};

export default RawMaterialForm;