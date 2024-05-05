import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, FormControl, InputLabel, Select, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { IRole, PositionMutation } from '../../../types';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material/Select';

interface Props {
  onSubmit: (position: PositionMutation) => void;
  isLoading: boolean;
  roles: IRole[];
  existingPosition?: PositionMutation;
}

const initialState: PositionMutation = {
  position_name: '',
  role_id: '',
};

const PositionForm: React.FC<Props> = ({ isLoading, onSubmit, existingPosition = initialState, roles }) => {
  const [position, setPosition] = useState(existingPosition);

  useEffect(() => {
    setPosition(existingPosition);
  }, [existingPosition]);

  const onChatSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSubmit(position);
    setPosition(initialState);
  };

  const selectChangeHandler = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setPosition(prevState => ({
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
            label="Position"
            required
            value={position.position_name}
            onChange={(e) => setPosition(prevState => ({
              ...prevState,
              position_name: e.target.value,
            }))}
          />
        </div>
        <div style={{ maxWidth: '405px', margin: '8px 0' }}>
          <FormControl fullWidth>
            <InputLabel id="role_id">Roles</InputLabel>
            <Select
              id="role_id"
              required
              labelId="demo-simple-select-label"
              value={position.role_id}
              name="role_id"
              label="Role *"
              onChange={(e) => selectChangeHandler(e)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {roles && roles.map(item => (
                <MenuItem key={item.id} value={item.id}>{item.role_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
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
          to="/positions"
        >
          Back
        </Button>
      </Box>
    </>
  );
};

export default PositionForm;