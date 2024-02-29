import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchUnits } from '../units/unitThunks';
import { createMaterial } from './materialThunks';
import { selectUnits } from '../units/unitSlice';
import { selectCreateMaterialLoading } from './materialSlice';
import Typography from '@mui/material/Typography';
import RawMaterialForm from './components/RawMaterialForm';
import { RawMaterialMutation } from '../../types';

const NewMaterials = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const unitsData = useAppSelector(selectUnits);
  const createLoading = useAppSelector(selectCreateMaterialLoading);

  useEffect(() => {
    dispatch(fetchUnits());
  }, [dispatch]);

  const onSubmit = async (material: RawMaterialMutation) => {
    await dispatch(createMaterial(material));
    navigate('/materials');
  };

  return (
    <>
      <Typography variant="h4" sx={{margin: '10px 0', fontWeight: 'bold'}}>Create Raw Material</Typography>
      <RawMaterialForm onSubmit={onSubmit} units={unitsData} isLoading={createLoading}/>
    </>
  );
};

export default NewMaterials;