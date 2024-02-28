import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectProducts } from '../products/productsSlice';
import { selectMaterials } from '../materials/materialSlice';
import { selectCreateIngredientLoading } from './ingredientSlice';
import { createIngredient } from './ingredientsThunks';
import { fetchProducts } from '../products/productThunks';
import { fetchMaterials } from '../materials/materialThunks';
import Typography from '@mui/material/Typography';
import IngredientForm from './components/IngredientForm';
import { IngredientMutation } from '../../types';

const NewIngredients = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const productsData = useAppSelector(selectProducts);
  const materialsData = useAppSelector(selectMaterials);
  const createIngredientLoading = useAppSelector(selectCreateIngredientLoading);

  const onSubmit = async (ingredient: IngredientMutation) => {
    await dispatch(createIngredient(ingredient));
    navigate('/ingredients');
  };

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchMaterials());
  }, [dispatch]);


  return (
    <>
      <Typography variant="h4" sx={{margin: '10px 0', fontWeight: 'bold'}}>Create New Ingredient</Typography>
      <IngredientForm
        onSubmit={onSubmit}
        product={productsData}
        raw_material={materialsData}
        isLoading={createIngredientLoading}
        edit={false}
      />
    </>
  );
};

export default NewIngredients;