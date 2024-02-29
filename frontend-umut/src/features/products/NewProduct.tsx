import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchUnits } from '../units/unitThunks';
import { createProduct } from './productThunks';
import { selectCreateProductsLoading } from './productsSlice';
import { selectUnits } from '../units/unitSlice';
import Typography from '@mui/material/Typography';
import FinishedProductForm from './components/FinishedProductForm';
import { FinishedProductMutation } from '../../types';

const NewProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const unitsData = useAppSelector(selectUnits);
  const createLoading = useAppSelector(selectCreateProductsLoading);

  useEffect(() => {
    dispatch(fetchUnits());
  }, [dispatch]);

  const onSubmit = async (products: FinishedProductMutation) => {
    await dispatch(createProduct(products));
    navigate('/products');
  };

  return (
    <>
      <Typography variant="h4" sx={{margin: '10px 0', fontWeight: 'bold'}}>Create Finished Product</Typography>
      <FinishedProductForm onSubmit={onSubmit} units={unitsData} isLoading={createLoading}/>
    </>
  );
};

export default NewProduct;