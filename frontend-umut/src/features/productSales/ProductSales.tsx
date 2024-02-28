import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectDeleteProductSalesLoading,
  selectFetchProductSalesLoading,
  selectProductSales,
} from './productSalesSlice';
import { deleteProductSales, fetchProductSales } from './productSalesThunks';
import ProductSalesTable from './components/ProductSalesTable';

const ProductSales = () => {
  const dispatch = useAppDispatch();
  const productSalesData = useAppSelector(selectProductSales);
  const fetchProductSalesLoading = useAppSelector(selectFetchProductSalesLoading);
  const deleteProductSalesLoading = useAppSelector(selectDeleteProductSalesLoading);

  const [productSalesId, setProductSalesId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProductSales());
  }, [dispatch]);

  const onDeleteConfirm = async () => {
    if (productSalesId) {
      await dispatch(deleteProductSales(productSalesId));
      await dispatch(fetchProductSales());
      setProductSalesId(null);
    }
  };

  const onDeleteCancel = () => {
    setProductSalesId(null);
  };

  const onProductSalesDelete = (id: string) => {
    setProductSalesId(id);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Button variant="contained" component={Link} to="/product-sales/create/">New Product Sales</Button>
      </Grid>
      <Grid item>
        {fetchProductSalesLoading ? <CircularProgress /> : (
          <ProductSalesTable
            productSales={productSalesData}
            onDelete={onProductSalesDelete}
            deleteLoading={deleteProductSalesLoading}
          />
        )}
      </Grid>
      <Dialog open={Boolean(productSalesId)} onClose={onDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product sale?
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteConfirm}>Yes</Button>
          <Button onClick={onDeleteCancel}>No</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default ProductSales;