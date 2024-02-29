import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteProduction, fetchProduction } from './productionThunks';
import { selectProductionDeleteLoading, selectProductions } from './productionSlice';
import { selectFetchProductsLoading } from '../products/productsSlice';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import ProductionTable from './components/ProductionTable';

const Production = () => {
  const dispatch = useAppDispatch();
  const productionsData = useAppSelector(selectProductions);
  const fetchProductionLoading = useAppSelector(selectFetchProductsLoading);
  const deleteProductionLoading = useAppSelector(selectProductionDeleteLoading);

  const [productSalesId, setProductSalesId] = useState<string | null>(null);


  const onDeleteConfirm = async () => {
    if (productSalesId) {
      await dispatch(deleteProduction(productSalesId));
      await dispatch(fetchProduction());
      setProductSalesId(null);
    }
  };

  const onDeleteCancel = () => {
    setProductSalesId(null);
  };

  const onProductionDelete = (id: string) => {
    setProductSalesId(id);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Button variant="contained" component={Link} to="/production/create">New Production</Button>
      </Grid>
      <Grid item>
        {fetchProductionLoading ? <CircularProgress /> : (
          <ProductionTable
            productionData={productionsData}
            deleteLoading={deleteProductionLoading}
            onDelete={onProductionDelete}
          />
        )}
      </Grid>
      <Dialog open={Boolean(productSalesId)} onClose={onDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this production?
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteConfirm}>Yes</Button>
          <Button onClick={onDeleteCancel}>No</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Production;