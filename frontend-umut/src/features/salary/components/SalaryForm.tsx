import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { SalaryI } from '../../../types';

interface Props {
  salaryData: SalaryI | null;
  onUpdate: (data: string) => void;
  isLoading: boolean;
}

const SalaryForm: React.FC<Props> = ({ salaryData, onUpdate, isLoading }) => {
  const [state, setState] = useState('');

  useEffect(() => {
    if (salaryData) {
      setState(salaryData.general);
    }
  }, [salaryData]);

  const onUpdateForm = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(state);
  };

  return (
    <>
      {salaryData && (
        <>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {salaryData.full_name}
          </Typography>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Production: {salaryData.production_count}
          </Typography>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Purchase: {salaryData.purchase_count}
          </Typography>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Sales: {salaryData.sales_count}
          </Typography>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Common: {salaryData.common_count}
          </Typography>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Salary: {salaryData.salary}
          </Typography>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Bonus: {salaryData.bonus}
          </Typography>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { width: '45ch', mt: 1 },
            }}
            onSubmit={onUpdateForm}
          >
            <div>
              <TextField
                required
                id="general"
                value={state}
                onChange={(e) => setState(e.target.value)}
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
              to="/salary"
            >
              Back
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default SalaryForm;
