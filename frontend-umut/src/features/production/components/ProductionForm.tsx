import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchIngredients } from '../../ingredients/ingredientsThunks';
import { selectFetchIngredientsLoading, selectIngredients } from '../../ingredients/ingredientSlice';
import { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import { CircularProgress, FormControl, Grid, InputLabel, Select, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { EmployeesI, FinishedProductI, ProductionMutation } from '../../../types';

interface Props {
  onSubmit: (productionDate: ProductionMutation) => void;
  products: FinishedProductI[];
  employees: EmployeesI[],
  isLoading: boolean;
}


const ProductionForm: React.FC<Props> = ({
  onSubmit,
  products,
  employees,
  isLoading,
}) => {
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);
  const fetchIngredientsLoading = useAppSelector(selectFetchIngredientsLoading);
  const [productionState, setProductionState] = useState<ProductionMutation>({
    product_id: '',
    production_date: '',
    employee_id: '',
    quantity: '',
  });

  console.log(ingredients);


  useEffect(() => {
    if (productionState.product_id.length > 2) {
      dispatch(fetchIngredients(productionState.product_id));
    }
  }, [dispatch, productionState.product_id]);

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    setProductionState(prevState => ({
      ...prevState,
      production_date: formattedDate,
    }));
  }, []);

  const onProductSalesSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    onSubmit(productionState);
    setProductionState({
      product_id: '',
      production_date: '',
      employee_id: '',
      quantity: '',
    });
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductionState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const selectChangeHandler = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setProductionState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };


  return (
    <>
      <Grid container>
        <Grid item xs={6}>
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
                  value={productionState.product_id}
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
                  value={productionState.employee_id}
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
                value={productionState.quantity}
                onChange={inputChangeHandler}
              />
            </div>
            <div>
              <TextField
                type="date"
                required
                id="production_date"
                name="production_date"
                value={productionState.production_date}
                onChange={inputChangeHandler}
              />
            </div>
            <LoadingButton
              type="submit"
              color="primary"
              variant="contained"
              disabled={isLoading}
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
              to="/production"
            >
              Back
            </Button>
          </Box>
        </Grid>
        <Grid item xs={6}>
          {fetchIngredientsLoading && ingredients ? <CircularProgress/> : (
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">ID</TableCell>
                    <TableCell align="left">Material Name</TableCell>
                    <TableCell align="left">Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ingredients && ingredients.map((item, index) => (
                    <TableRow
                      key={item.id}
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {item.raw_material_name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {item.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>

    </>
  );
};

export default ProductionForm;