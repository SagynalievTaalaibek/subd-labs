import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import ProductionForm from './components/ProductionForm';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectProductionCreateLoading } from './productionSlice';
import { useEffect } from 'react';
import { ProductionMutation } from '../../types';
import { selectProducts } from '../products/productsSlice';
import { selectEmployees } from '../employees/employeeSlice';
import { fetchProducts } from '../products/productThunks';
import { fetchEmployees } from '../employees/employeeThunks';

const NewProduction = () => {
  const dispatch = useAppDispatch();
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

  const onSubmit = (productionData: ProductionMutation) => {
    console.log(productionData);
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