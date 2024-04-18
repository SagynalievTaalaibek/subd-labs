import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectBankFetching, selectBanks } from './bankSlice';
import { CircularProgress, Grid } from '@mui/material';
import BankTable from './components/BankTable';
import { useEffect } from 'react';
import { fetchBanks } from './bankThunks';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Typography from '@mui/material/Typography';
import { fetchBudget } from '../budget/budgetThunks';
import { selectBudget } from '../budget/budgetSlice';

const Bank = () => {
  const dispatch = useAppDispatch();
  const banks = useAppSelector(selectBanks);
  const fetchLoading = useAppSelector(selectBankFetching);
  const budgetData = useAppSelector(selectBudget);

  useEffect(() => {
    dispatch(fetchBanks());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchBudget());
  }, [dispatch]);


  return (
    <>
      <Button variant={'contained'} component={Link} to="/bank/create" sx={{ margin: '15px 0' }}>Create new
        credit</Button>
      <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <AccountBalanceWalletIcon
          sx={{ fontSize: '35px', marginRight: '5px' }}
        />
        <Typography variant="h5" component="div">
          {budgetData && budgetData.budget_amount} KG
        </Typography>
      </Grid>
      {fetchLoading ? <CircularProgress /> : (
        <BankTable bankData={banks} />
      )}
    </>
  );
};

export default Bank;