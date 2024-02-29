import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchUnits } from '../units/unitThunks';
import { editProduct, fetchOneProduct } from './productThunks';
import { selectUnits } from '../units/unitSlice';
import {
  selectEditProductsLoading,
  selectFetchOneProductsLoading,
  selectOneProducts
} from './productsSlice';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';
import FinishedProductForm from './components/FinishedProductForm';
import { FinishedProductMutation, FinishedProductWithId } from '../../types';

const EditProduct = () => {
  const {id} = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const oneProduct = useAppSelector(selectOneProducts);
  const unitsData = useAppSelector(selectUnits);
  const fetchOneProductLoading = useAppSelector(selectFetchOneProductsLoading);
  const editLoading = useAppSelector(selectEditProductsLoading);

  useEffect(() => {
    dispatch(fetchUnits());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchOneProduct(id));
  }, [dispatch, id]);

  const onSubmit = async (product: FinishedProductMutation) => {
    const updateProduct: FinishedProductWithId = {
      id: id,
      name: product.name,
      amount: product.amount,
      quantity: product.quantity,
      unit_of_measure_id: product.unit_of_measure_id,
    };

    await dispatch(editProduct(updateProduct));
    navigate('/products');
  };

  return (
    <>
      <Typography variant="h4" sx={{margin: '10px 0', fontWeight: 'bold'}}>Update Finished Product</Typography>
      {fetchOneProductLoading ? <CircularProgress/> : (
        <FinishedProductForm
          onSubmit={onSubmit}
          units={unitsData}
          isLoading={editLoading}
          existingProduct={oneProduct ? oneProduct : null}
        />
      )}
    </>
  );
};

export default EditProduct;