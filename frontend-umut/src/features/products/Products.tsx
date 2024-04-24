import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteProduct, fetchProducts } from './productThunks';
import { selectDeleteProductsLoading, selectFetchProductsLoading, selectProducts } from './productsSlice';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import FinishedProductTable from './components/FinishedProductTable';
import { selectUser } from '../user/usersSlice';


const Products = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const fetchLoading = useAppSelector(selectFetchProductsLoading);
  const deleteLoading = useAppSelector(selectDeleteProductsLoading);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  const onDeleteConfirm = async () => {
    if (deleteId) {
      await dispatch(deleteProduct(deleteId));
      await dispatch(fetchProducts());
      setDeleteId(null);
    }
  };

  const onDeleteCancel = () => {
    setDeleteId(null);
  };

  const onFinishedProductDelete = (id: string) => {
    setDeleteId(id);
  };

  return (
    <Grid container spacing={2}>
      {user && user.role !== 'director' && (
        <Grid item xs={12}>
          <Button variant="contained" component={Link} to="/products/create">Create Finished Product</Button>
        </Grid>
      )}
      <Grid item>
        {fetchLoading ? <CircularProgress /> : (
          <FinishedProductTable products={products} onDelete={onFinishedProductDelete} deleteLoading={deleteLoading} />
        )}
      </Grid>
      <Dialog open={Boolean(deleteId)} onClose={onDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this finished product ?
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteConfirm}>Yes</Button>
          <Button onClick={onDeleteCancel}>No</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Products;