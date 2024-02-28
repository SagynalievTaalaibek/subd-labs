import { useNavigate, useParams } from 'react-router-dom';
import { IngredientMutation, IngredientsWithID } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectEditIngredientLoading,
  selectFetchOneIngredientLoading,
  selectOneIngredient
} from './ingredientSlice';
import { selectProducts } from '../products/productsSlice';
import { selectMaterials } from '../materials/materialSlice';
import Typography from '@mui/material/Typography';
import IngredientForm from './components/IngredientForm';
import { editIngredient, fetchOneIngredient } from './ingredientsThunks';
import { CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { fetchProducts } from '../products/productThunks';
import { fetchMaterials } from '../materials/materialThunks';

const EditIngredient = () => {
  const {id} = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const materials = useAppSelector(selectMaterials);
  const oneIngredient = useAppSelector(selectOneIngredient);
  const editIngredientLoading = useAppSelector(selectEditIngredientLoading);
  const fetchOneIngredientLoading = useAppSelector(selectFetchOneIngredientLoading);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchOneIngredient(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchMaterials());
  }, [dispatch]);


  const onSubmit = async (ingredients: IngredientMutation) => {
    const updateIngredients: IngredientsWithID = {
      id: id,
      product_id: ingredients.product_id,
      raw_material_id: ingredients.raw_material_id,
      quantity: ingredients.quantity,
    };

    await dispatch(editIngredient(updateIngredients));
    navigate('/ingredients');
  };


  return (
    <>
      <Typography variant="h4" sx={{margin: '10px 0', fontWeight: 'bold'}}>Update Ingredients</Typography>
      {fetchOneIngredientLoading ? <CircularProgress/> : (
        <IngredientForm
          onSubmit={onSubmit}
          product={products}
          raw_material={materials}
          isLoading={editIngredientLoading}
          existingIngredient={oneIngredient ? oneIngredient : null}
          edit={true}
        />
      )}
    </>
  );
};

export default EditIngredient;