import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { Link } from 'react-router-dom';

interface Props {
  onSubmit: (position: string) => void;
  isLoading: boolean;
  existingPosition?: string;
}

const PositionForm: React.FC<Props> = ({isLoading, onSubmit, existingPosition = ''}) => {
  const [position, setPosition] = useState(existingPosition);

  useEffect(() => {
    setPosition(existingPosition);
  }, [existingPosition]);

  const onChatSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSubmit(position);
    setPosition('');
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': {width: '45ch', mt: 1},
        }}
        onSubmit={onChatSubmit}
      >
        <div>
          <TextField
            label="Position"
            required
            value={position}
            onChange={(e) => setPosition(e.target.value)}
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
          to="/positions"
        >
          Back
        </Button>
      </Box>
    </>
  );
};

export default PositionForm;