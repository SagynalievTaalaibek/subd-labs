import React, { useEffect, useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { SelectChangeEvent } from '@mui/material/Select';
import { Link } from 'react-router-dom';
import { FinishedProductI, IngredientMutation, RawMaterialI } from '../../../types';

interface Props {
  onSubmit: (ingredient: IngredientMutation) => void;
  product: FinishedProductI[];
  raw_material: RawMaterialI[];
  isLoading: boolean;
  existingIngredient?: IngredientMutation | null;
  edit: boolean;
}

const initialSate: IngredientMutation = {
  product_id: '',
  raw_material_id: '',
  quantity: '',
};

const IngredientForm: React.FC<Props> = ({onSubmit, isLoading, existingIngredient, product, raw_material, edit}) => {
  if (!existingIngredient) {
    existingIngredient = initialSate;
  }
  const [ingredients, setIngredients] = useState<IngredientMutation>(existingIngredient);

  useEffect(() => {
    if (existingIngredient) {
      setIngredients(existingIngredient);
    }
    const savedProductId = localStorage.getItem('productId');
    if (savedProductId) {
      setIngredients(prevState => ({
        ...prevState,
        product_id: savedProductId,
      }));
    }
  }, [existingIngredient]);

  const onPositionSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      raw_material_id: ingredients.raw_material_id,
      quantity: ingredients.quantity,
      product_id: ingredients.product_id,
    });
    localStorage.setItem('productId', ingredients.product_id);

    setIngredients({
      product_id: '',
      raw_material_id: '',
      quantity: '',
    });
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setIngredients(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const selectChangeHandler = (e: SelectChangeEvent) => {
    if (!edit) {
      const {name, value} = e.target;
      setIngredients(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };


  return (
    <>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': {width: '45ch', mt: 1},
        }}
        onSubmit={onPositionSubmit}
      >
        <div style={{maxWidth: '405px', margin: '8px 0'}}>
          <FormControl fullWidth>
            <InputLabel id="position_id">Finish Product</InputLabel>
            <Select
              id="product_id"
              required
              labelId="product_id"
              value={ingredients.product_id}
              name="product_id"
              label="Finish Product *"
              onChange={(e) => selectChangeHandler(e)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {product && product.map(item => (
                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div style={{maxWidth: '405px', margin: '8px 0'}}>
          <FormControl fullWidth>
            <InputLabel id="raw_material_id">Raw material</InputLabel>
            <Select
              id="raw_material_id"
              required
              labelId="raw_material_id"
              value={ingredients.raw_material_id}
              name="raw_material_id"
              label="Raw material *"
              onChange={(e) => selectChangeHandler(e)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {raw_material && raw_material.map(item => (
                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
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
            value={ingredients.quantity}
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
          startIcon={<SaveIcon/>}
          sx={{mt: 1}}
        >
          Save
        </LoadingButton>
        <Button
          type="button"
          variant="contained"
          sx={{mt: 1, ml: 1}}
          component={Link}
          to="/ingredients"
        >
          Back
        </Button>
      </Box>
    </>
  );
};

export default IngredientForm;