import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchOneProduct } from '../../products/productThunks';
import { selectOneProducts } from '../../products/productsSlice';
import { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import { FormControl, InputLabel, Select, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { EmployeesI, FinishedProductI, ProductSalesMutation } from '../../../types';

interface Props {
  onSubmit: (productSales: ProductSalesMutation) => void;
  products: FinishedProductI[];
  employees: EmployeesI[],
  isLoading: boolean;
}


const ProductSalesForm: React.FC<Props> = ({
  onSubmit,
  products,
  employees,
  isLoading,
}) => {
  const dispatch = useAppDispatch();
  const oneProduct = useAppSelector(selectOneProducts);


  const [productSalesState, setProductSalesState] = useState<ProductSalesMutation>({
    product_id: '',
    sale_date: '',
    employee_id: '',
    quantity: '',
    amount: '',
  });

  useEffect(() => {
    if (productSalesState.product_id) {
      dispatch(fetchOneProduct(productSalesState.product_id));
    }
  }, [dispatch, productSalesState.product_id]);


  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    setProductSalesState(prevState => ({
      ...prevState,
      sale_date: formattedDate,
    }));
  }, []);

  const onProductSalesSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!oneProduct) {
      alert('Can not submit!');
      return;
    }

    const newAmount = (parseFloat(oneProduct.amount) / parseFloat(oneProduct.quantity)) * parseFloat(productSalesState.quantity);

    onSubmit({ ...productSalesState, amount: newAmount.toString() });
    setProductSalesState({
      product_id: '',
      sale_date: '',
      employee_id: '',
      quantity: '',
      amount: '',
    });
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductSalesState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const selectChangeHandler = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setProductSalesState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };


  return (
    <>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { width: '45ch', mt: 1 },
        }}
        onSubmit={onProductSalesSubmit}
      >
        <div style={{ maxWidth: '405px', margin: '8px 0' }}>
          <FormControl fullWidth>
            <InputLabel id="product_id">Product</InputLabel>
            <Select
              id="product_id"
              required
              labelId="demo-simple-select-label"
              value={productSalesState.product_id}
              name="product_id"
              label="Product *"
              onChange={(e) => selectChangeHandler(e)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {products && products.map(item => (
                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div style={{ maxWidth: '405px', margin: '8px 0' }}>
          <FormControl fullWidth>
            <InputLabel id="employee_id">Employee</InputLabel>
            <Select
              id="employee_id"
              required
              labelId="demo-simple-select-label"
              value={productSalesState.employee_id}
              name="employee_id"
              label="Employee *"
              onChange={(e) => selectChangeHandler(e)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {employees && employees.map(item => (
                <MenuItem key={item.employee_id} value={item.employee_id}>{item.full_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <TextField
            label="Quantity"
            type="number"
            required
            id="quantity"
            name="quantity"
            value={productSalesState.quantity}
            error={!!(oneProduct && parseFloat(oneProduct.quantity) < parseFloat(productSalesState.quantity))}
            helperText={oneProduct && parseFloat(oneProduct.quantity) < parseFloat(productSalesState.quantity) ? `You have only ${oneProduct.quantity} of ${oneProduct.name} !` : ''}
            onChange={inputChangeHandler}
          />
        </div>
        <div>
          <TextField
            type="date"
            required
            id="sale_date"
            name="sale_date"
            value={productSalesState.sale_date}
            onChange={inputChangeHandler}
          />
        </div>
        <LoadingButton
          type="submit"
          color="primary"
          variant="contained"
          disabled={isLoading || !!(oneProduct && parseFloat(oneProduct.quantity) < parseFloat(productSalesState.quantity))}
          loading={isLoading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          sx={{ mt: 1 }}
        >
          Save
        </LoadingButton>
        <Button
          type="button"
          variant="contained"
          sx={{ mt: 1, ml: 1 }}
          component={Link}
          to="/product-sales"
        >
          Back
        </Button>
      </Box>
    </>
  );
};

export default ProductSalesForm;