import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addSumBudget, fetchBudget } from './budgetThunks';
import { selectAddBudgetLoading, selectBudget, selectFetchBudgetLoading } from './budgetSlice';
import { Alert, CircularProgress, Grid, Modal, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { AccountBalanceWallet, CurrencyExchange, TrendingUp } from '@mui/icons-material';
import Box from '@mui/material/Box';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { BUDGET_ID } from '../../constants';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'background.paper',
  width: 400,
  border: '2px solid #000',
  borderRadius: '10px',
  padding: '26px 16px',
  '& .MuiTextField-root': { width: '40ch', mt: 1 },
};
const Budget = () => {
  const dispatch = useAppDispatch();
  const budgetData = useAppSelector(selectBudget);
  const fetchBudgetLoading = useAppSelector(selectFetchBudgetLoading);
  const addSumLoading = useAppSelector(selectAddBudgetLoading);

  const [open, setOpen] = useState(false);
  const [sumAdd, setSumAdd] = useState('');

  useEffect(() => {
    dispatch(fetchBudget());
  }, [dispatch]);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSumAdd('');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(addSumBudget({ budget_amount: sumAdd, id: BUDGET_ID }));
    await dispatch(fetchBudget());
    void handleClose();
  };

  return (
    <Grid container spacing={2} sx={{ mt: 3 }}>
      {fetchBudgetLoading ? <CircularProgress /> : (
        <>
          <Grid item>
            <Typography variant="h5" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>Budget</Typography>
            <Alert icon={<AccountBalanceWallet sx={{ fontSize: '45px' }} />} severity="info">
              <Typography variant="h4" component="div">{budgetData && budgetData.budget_amount} KG</Typography>
            </Alert>
          </Grid>
          <Grid item>
            <Typography variant="h5" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>Bonus</Typography>
            <Alert icon={<CurrencyExchange sx={{ fontSize: '45px' }} />} severity="info">
              <Typography variant="h4" component="div">{budgetData && budgetData.bonus} %</Typography>
            </Alert>
          </Grid>
          <Grid item>
            <Typography variant="h5" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>Markup</Typography>
            <Alert icon={<TrendingUp sx={{ fontSize: '45px' }} />} severity="info">
              <Typography variant="h4" component="div">{budgetData && budgetData.markup} %</Typography>
            </Alert>
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <Button onClick={handleOpen} variant="contained">Add budget</Button>
        <Button variant="contained" component={Link} to={'/budget/update/' + BUDGET_ID}
                sx={{ marginLeft: '20px' }}>Edit</Button>
      </Grid>
      <Modal
        open={open}
      >
        <Box
          sx={style}
          component="form"
          onSubmit={onSubmit}
        >
          <div>
            <TextField
              label="Amount"
              type="number"
              required
              value={sumAdd}
              onChange={(e) => setSumAdd(e.target.value)}
            />
          </div>
          <LoadingButton
            type="submit"
            color="primary"
            variant="contained"
            disabled={addSumLoading}
            loading={addSumLoading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            sx={{ mt: 1 }}
          >
            Add
          </LoadingButton>
          <Button variant="contained" onClick={handleClose} sx={{ mt: 1, marginLeft: '10px' }}>Back</Button>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Budget;