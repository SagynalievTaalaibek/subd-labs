import React, { useEffect, useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { SelectChangeEvent } from '@mui/material/Select';
import { Link } from 'react-router-dom';
import { EmployeeMutation, PositionI } from '../../../types';

interface Props {
  onSubmit: (employee: EmployeeMutation) => void;
  positions: PositionI[] | undefined;
  isLoading: boolean;
  existingEmployee?: EmployeeMutation | null;
}

const initialSate = {
  full_name: '',
  position_id: '',
  salary: '',
  address: '',
  phone: '',
};

const EmployeeForm: React.FC<Props> = ({onSubmit, isLoading, existingEmployee, positions}) => {
  if (!existingEmployee) {
    existingEmployee = initialSate;
  }
  const [employee, setEmployee] = useState<EmployeeMutation>(existingEmployee);

  useEffect(() => {
    if (existingEmployee) {
      setEmployee(existingEmployee);
    }
  }, [existingEmployee]);

  const onPositionSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(employee);
    setEmployee({
      full_name: '',
      position_id: '',
      salary: '',
      address: '',
      phone: '',
    });
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setEmployee(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const selectChangeHandler = (e: SelectChangeEvent) => {
    const {name, value} = e.target;
    setEmployee(prevState => ({
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
            label="Full name"
            required
            id="full_name"
            name="full_name"
            value={employee.full_name}
            onChange={inputChangeHandler}
          />
        </div>
        <div style={{maxWidth: '405px', margin: '8px 0'}}>
          <FormControl fullWidth>
            <InputLabel id="position_id">Position</InputLabel>
            <Select
              id="position_id"
              required
              labelId="demo-simple-select-label"
              value={employee.position_id}
              name="position_id"
              label="Position *"
              onChange={(e) => selectChangeHandler(e)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {positions && positions.map(item => (
                <MenuItem key={item.position_id} value={item.position_id}>{item.position_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <TextField
            label="Salary"
            type="number"
            required
            id="salary"
            name="salary"
            value={employee.salary}
            onChange={inputChangeHandler}
          />
        </div>
        <div>
          <TextField
            label="Address"
            required
            id="address"
            name="address"
            value={employee.address}
            onChange={inputChangeHandler}
          />
        </div>
        <div>
          <TextField
            label="Phone"
            required
            id="phone"
            name="phone"
            value={employee.phone}
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
          to="/employees"
        >
          Back
        </Button>
      </Box>
    </>
  );
};

export default EmployeeForm;