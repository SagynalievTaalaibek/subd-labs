import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteIngredient, fetchIngredients } from './ingredientsThunks';
import { fetchProducts } from '../products/productThunks';
import {
  selectFetchProductsLoading,
  selectProducts,
} from '../products/productsSlice';
import {
  selectDeleteIngredientLoading,
  selectFetchIngredientsLoading,
  selectIngredients,
} from './ingredientSlice';
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  Select,
} from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import IngredientsTable from './components/IngredientsTable';

const Ingredients = () => {
  const dispatch = useAppDispatch();
  const productsData = useAppSelector(selectProducts);
  const ingredientsData = useAppSelector(selectIngredients);
  const fetchIngredientsLoading = useAppSelector(selectFetchIngredientsLoading);
  const deleteIngredientsLoading = useAppSelector(
    selectDeleteIngredientLoading,
  );
  const fetchProductsLoading = useAppSelector(selectFetchProductsLoading);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [productId, setProductId] = useState<string>('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const savedProductId = localStorage.getItem('productId');
    if (savedProductId) {
      setProductId(savedProductId);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchIngredients(productId));
  }, [dispatch, productId]);

  const onDeleteConfirm = async () => {
    if (deleteId) {
      await dispatch(deleteIngredient(deleteId));
      dispatch(fetchIngredients(productId));
      setDeleteId(null);
    }
  };

  const onDeleteCancel = () => {
    setDeleteId(null);
  };

  const onIngredientsDelete = (id: string) => {
    setDeleteId(id);
  };

  useEffect(() => {
    if (productsData && productsData.length > 0) {
      setProductId((prevProductId) => {
        if (!prevProductId) {
          const defaultProductId = productsData[0].id;
          localStorage.setItem('productId', defaultProductId);
          return defaultProductId;
        }
        return prevProductId;
      });
    }
  }, [productsData]);

  useEffect(() => {
    if (productId) {
      localStorage.setItem('productId', productId);
    }
  }, [productId]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Button variant="contained" component={Link} to="/ingredients/create">
          Create Ingredients
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { width: '45ch', mt: 1 },
          }}
        >
          <div style={{ maxWidth: '405px', margin: '8px 0' }}>
            {fetchProductsLoading ? (
              <CircularProgress />
            ) : (
              <FormControl fullWidth>
                <Select
                  id="productSelect"
                  required
                  value={productId}
                  onChange={(e) => setProductId(e.target.value as string)}
                >
                  {productsData &&
                    productsData.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          </div>
        </Box>
      </Grid>
      <Grid item>
        {fetchIngredientsLoading ? (
          <CircularProgress />
        ) : (
          <IngredientsTable
            ingredients={ingredientsData}
            onDelete={onIngredientsDelete}
            deleteLoading={deleteIngredientsLoading}
          />
        )}
      </Grid>
      <Dialog open={Boolean(deleteId)} onClose={onDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this ingredients ?
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteConfirm}>Yes</Button>
          <Button onClick={onDeleteCancel}>No</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Ingredients;
