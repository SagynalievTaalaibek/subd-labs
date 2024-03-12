import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProducts, productPlusUpdate } from '../products/productThunks';
import { minusAmountQuantityMaterial } from '../materials/materialThunks';
import { fetchEmployees } from '../employees/employeeThunks';
import { creteProduction } from './productionThunks';
import { selectProducts } from '../products/productsSlice';
import { selectEmployees } from '../employees/employeeSlice';
import { selectProductionCreateLoading } from './productionSlice';
import { clearIngredients } from '../ingredients/ingredientSlice';
import ProductionForm from './components/ProductionForm';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ProductionMutation, ProductionSendData } from '../../types';

const NewProduction = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const productsData = useAppSelector(selectProducts);
  const employeesData = useAppSelector(selectEmployees);
  const createLoading = useAppSelector(selectProductionCreateLoading);

  useEffect(() => {
    const fetch = async () => {
      await dispatch(fetchProducts());
      await dispatch(fetchEmployees());
    };

    void fetch();
  }, [dispatch]);

  const onSubmit = async (productionData: ProductionMutation, sendData: ProductionSendData) => {
    await dispatch(creteProduction(productionData));
    await dispatch(productPlusUpdate({
      id: productionData.product_id,
      amount: sendData.productsSum,
      quantity: sendData.selectedQuantity,
    }));

    sendData.materialsMinus.forEach((material) => {
      dispatch(minusAmountQuantityMaterial({
        id: material.id,
        amount: material.amount,
        quantity: material.quantity,
      }));
    });

    dispatch(clearIngredients());
    navigate('/production');
  };

  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <Typography variant="h4" sx={{ margin: '10px 0', fontWeight: 'bold' }}>New production</Typography>
        </Grid>
      </Grid>
      <ProductionForm
        products={productsData}
        employees={employeesData}
        onSubmit={onSubmit}
        isLoading={createLoading}
      />
    </>
  );
};

export default NewProduction;