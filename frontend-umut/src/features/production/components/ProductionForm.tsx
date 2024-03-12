import React, { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchIngredients } from '../../ingredients/ingredientsThunks';
import { fetchMaterials } from '../../materials/materialThunks';
import { clearIngredients, selectFetchIngredientsLoading, selectIngredients } from '../../ingredients/ingredientSlice';
import { selectMaterials } from '../../materials/materialSlice';
import { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import { Alert, CircularProgress, FormControl, Grid, InputLabel, Select, TextField } from '@mui/material';
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
import { EmployeesI, FinishedProductI, MinusMaterial, ProductionMutation, ProductionSendData } from '../../../types';

interface Props {
  onSubmit: (productionDate: ProductionMutation, sendData: ProductionSendData) => void;
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
  const materials = useAppSelector(selectMaterials);
  const fetchIngredientsLoading = useAppSelector(selectFetchIngredientsLoading);
  const notValidMaterials: string[] = [];
  const [helperText, setHelperText] = useState('');
  const [productionState, setProductionState] = useState<ProductionMutation>({
    product_id: '',
    production_date: '',
    employee_id: '',
    quantity: '',
  });

  useEffect(() => {
    if (productionState.product_id.length > 2) {
      dispatch(fetchIngredients(productionState.product_id));
      setHelperText('');
    }
  }, [dispatch, productionState.product_id]);

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    setProductionState(prevState => ({
      ...prevState,
      production_date: formattedDate,
    }));
  }, []);

  const checkMaterial = () => {
    let isValid = true;
    const materialMinusData: MinusMaterial[] = [];
    let productsSum = 0;
    const selectedQuantity = parseFloat(productionState.quantity);

    ingredients.forEach((ingredient) => {
      const material = materials.find((m) => m.id === ingredient.raw_material_id);
      if (material) {
        const requiredQuantity = parseFloat(ingredient.quantity) * selectedQuantity;

        if (parseFloat(material.quantity) >= requiredQuantity) {
          const materialAmount = parseFloat(material.amount) / parseFloat(material.quantity);
          const amountToMinus = requiredQuantity * materialAmount;
          materialMinusData.push({
            id: material.id,
            quantity: requiredQuantity.toString(),
            amount: amountToMinus.toString(),
          });
          productsSum += amountToMinus;
        } else {
          isValid = false;
          notValidMaterials.push(`We need ${material.name} ${requiredQuantity}, but only have ${material.quantity}.`);
        }
      }
    });

    return {
      isValid,
      materialMinusData,
      productsSum: productsSum.toString(),
      selectedQuantity: selectedQuantity.toString(),
    };
  };


  const onProductSalesSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { isValid, materialMinusData, productsSum, selectedQuantity } = checkMaterial();

    if (isValid) {
      onSubmit(productionState, { materialsMinus: materialMinusData, productsSum, selectedQuantity });
      setProductionState({
        product_id: '',
        production_date: '',
        employee_id: '',
        quantity: '',
      });

      setHelperText('');
    } else {
      let text: string = '';

      notValidMaterials.forEach((item) => {
        text += ' ';
        text += item;
      });

      setHelperText(text);

      setProductionState(prevState => ({
        ...prevState,
        quantity: '',
      }));
    }
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

  let alertBlock: ReactElement<any, any> | null = null;

  if (helperText.length > 0) {
    alertBlock = (
      <Alert severity="error" sx={{ margin: '10px 0' }}>
        {helperText}
      </Alert>
    );
  }


  return (
    <>
      {alertBlock ? alertBlock : ''}
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
              disabled={isLoading || parseFloat(productionState.quantity) < 0}
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
              onClick={() => dispatch(clearIngredients())}
            >
              Back
            </Button>
          </Box>
        </Grid>
        <Grid item xs={6}>
          {fetchIngredientsLoading && ingredients ? <CircularProgress /> : (
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
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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