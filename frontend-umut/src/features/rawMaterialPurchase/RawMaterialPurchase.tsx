import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteRawMaterialsPurchase, fetchRawMaterialsPurchases } from './purchaseThunks';
import { fetchBudget } from '../budget/budgetThunks';
import {
  selectDeleteRawMaterialsPurchaseLoading,
  selectFetchRawMaterialsPurchaseLoading,
  selectRawMaterialsPurchase
} from './purchaseSlice';
import { selectBudget } from '../budget/budgetSlice';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RawMaterialPurchaseTable from './components/RawMaterialPurchaseTable';

const RawMaterialPurchase = () => {
  const dispatch = useAppDispatch();
  const budgetData = useAppSelector(selectBudget);
  const rawMaterialPurchase = useAppSelector(selectRawMaterialsPurchase);
  const deleteLoading = useAppSelector(selectDeleteRawMaterialsPurchaseLoading);
  const fetchLoading = useAppSelector(selectFetchRawMaterialsPurchaseLoading);

  const [purchaseId, setPurchaseId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchRawMaterialsPurchases());
    dispatch(fetchBudget());
  }, [dispatch]);

  const onDeleteConfirm = async () => {
    if (purchaseId) {
      await dispatch(deleteRawMaterialsPurchase(purchaseId));
      await dispatch(fetchRawMaterialsPurchases());
      setPurchaseId(null);
    }
  };

  const onDeleteCancel = () => {
    setPurchaseId(null);
  };

  const onRawMaterialsDelete = (id: string) => {
    setPurchaseId(id);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Button variant="contained" component={Link} to="/purchase/create/">New Purchase</Button>
      </Grid>
      <Grid item xs={6} sx={{display: 'flex', alignItems: 'center'}}>
        <AccountBalanceWalletIcon sx={{fontSize: '35px', marginRight: '5px'}}/>
        <Typography variant="h5" component="div">{budgetData && budgetData.budget_amount} KG</Typography>
      </Grid>
      <Grid item>
        {fetchLoading ? <CircularProgress/> : (
          <RawMaterialPurchaseTable
            rawMaterialsPurchase={rawMaterialPurchase}
            deleteLoading={deleteLoading}
            onDelete={onRawMaterialsDelete}
          />
        )}
      </Grid>
      <Dialog open={Boolean(purchaseId)} onClose={onDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this purchase ?
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteConfirm}>Yes</Button>
          <Button onClick={onDeleteCancel}>No</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default RawMaterialPurchase;