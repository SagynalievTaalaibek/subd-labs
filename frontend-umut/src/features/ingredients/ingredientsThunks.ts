import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { IngredientI, IngredientMutation, IngredientsWithID } from '../../types';

export const createIngredient = createAsyncThunk<void, IngredientMutation>(
  'ingredient/create',
  async (ingredient) => {
    try {
      const newIngredient: IngredientMutation = {
        product_id: ingredient.product_id,
        raw_material_id: ingredient.raw_material_id,
        quantity: ingredient.quantity,
      };

      await axiosApi.post('/ingredients', newIngredient);
    } catch (error: any) {
      if (error.response.status === 500) {
        console.error('Internal Server Error:', error.message);
      } else if (error.response.status === 400) {
        alert('This raw-materials is using with this Product!');
      }
    }
  }
);

export const fetchIngredients = createAsyncThunk<IngredientI[], string>(
  'ingredient/fetchAll',
  async (id) => {
    const response = await axiosApi.get<IngredientI[]>(`/ingredients-by-fp/${id}`);
    return response.data;
  }
);

export const deleteIngredient = createAsyncThunk<void, string>(
  'ingredient/delete',
  async (id) => {
    try {
      await axiosApi.delete(`/ingredients/${id}`);
    } catch (error: any) {
      alert(error);
    }
  },
);


export const editIngredient = createAsyncThunk<void, IngredientsWithID>(
  'ingredient/edit',
  async (ingredient) => {
    try {
      const newIngredient: IngredientsWithID = {
        id: ingredient.id,
        product_id: ingredient.product_id,
        raw_material_id: ingredient.raw_material_id,
        quantity: ingredient.quantity,
      };

      await axiosApi.put('/ingredients', newIngredient);
    } catch (error: any) {
      if (error.response.status === 500) {
        console.error('Internal Server Error:', error.message);
      } else if (error.response.status === 400) {
        alert('This raw-materials is using with this Product!');
      }
    }
  },
);

export const fetchOneIngredient = createAsyncThunk<IngredientMutation, string>(
  'ingredient/fetchOne',
  async (id) => {
    const response = await axiosApi.get<IngredientsWithID>(`/ingredients/${id}`);
    const oneIngredient = response.data;

    const IngredientMutation: IngredientMutation = {
      product_id: oneIngredient.product_id,
      raw_material_id: oneIngredient.raw_material_id,
      quantity: oneIngredient.quantity,
    };

    return IngredientMutation;
  },
);