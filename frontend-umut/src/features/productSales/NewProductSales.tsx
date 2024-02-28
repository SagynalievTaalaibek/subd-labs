import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { selectEmployees } from '../employees/employeeSlice';
import { fetchEmployees } from '../employees/employeeThunks';
import { addSumBudget, fetchBudget } from '../budget/budgetThunks';
import { Grid } from '@mui/material';
import { fetchProducts, productMinusUpdate } from '../products/productThunks';
import { selectProducts } from '../products/productsSlice';
import ProductSalesForm from './components/ProductSalesForm';
import { selectBudget } from '../budget/budgetSlice';
import { BUDGET_ID } from '../../constants';
import { createProductSales } from './productSalesThunks';
import { ProductSalesMutation } from '../../types';
import { selectCreateProductSalesLoading } from './productSalesSlice';

const NewProductSales = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const productsData = useAppSelector(selectProducts);
    const employeeData = useAppSelector(selectEmployees);
    const createLoading = useAppSelector(selectCreateProductSalesLoading);
    const budgetData = useAppSelector(selectBudget);

    useEffect(() => {
      const fetchData = async () => {
        await dispatch(fetchProducts());
        await dispatch(fetchEmployees());
        await dispatch(fetchBudget());
      };

      void fetchData();
    }, [dispatch]);

    const onSubmit = async (productSales: ProductSalesMutation) => {
      const index = productsData.findIndex(value => value.id === productSales.product_id);
      let currentProduct = null;

      if (!budgetData) {
        alert('Submit error in budget!');
        return;
      }

      let updateBudget = 0;

      if (budgetData && budgetData.markup) {
        const markup = parseFloat(budgetData.markup);
        updateBudget = parseFloat(productSales.amount) * (1 + (markup / 100));
      }
      if (index !== -1) {
        currentProduct = productsData[index];
      }


      if (currentProduct) {
        await dispatch(productMinusUpdate({
          id: productSales.product_id,
          amount: productSales.amount,
          quantity: productSales.quantity,
        }));
      }

      await dispatch(addSumBudget({
        id: BUDGET_ID,
        budget_amount: updateBudget.toString(),
      }));

      await dispatch(createProductSales(productSales));
      await dispatch(fetchBudget());
      await dispatch(fetchProducts());
      navigate('/product-sales');
    };

    return (
      <>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h4" sx={{ margin: '10px 0', fontWeight: 'bold' }}>Sale product</Typography>
          </Grid>
        </Grid>
        <ProductSalesForm
          products={productsData}
          employees={employeeData}
          onSubmit={onSubmit}
          isLoading={createLoading}
        />
      </>
    );
  }
;

export default NewProductSales;