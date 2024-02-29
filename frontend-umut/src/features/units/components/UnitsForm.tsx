import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';

interface Props {
  onSubmit: (units: string) => void;
  isLoading: boolean;
  existingPosition?: string;
}

const UnitsForm: React.FC<Props> = ({isLoading, onSubmit, existingPosition = ''}) => {
  const [units, setUnits] = useState(existingPosition);

  useEffect(() => {
    setUnits(existingPosition);
  }, [existingPosition]);

  const onUnitsSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSubmit(units);
    setUnits('');
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': {width: '45ch', mt: 1},
        }}
        onSubmit={onUnitsSubmit}
      >
        <div>
          <TextField
            label="Units of measure"
            required
            value={units}
            onChange={(e) => setUnits(e.target.value)}
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
          to="/units"
        >
          Back
        </Button>
      </Box>
    </>
  );
};

export default UnitsForm;