import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { editMaterial, fetchOneMaterial } from './materialThunks';
import { fetchUnits } from '../units/unitThunks';
import {
  selectEditMaterialLoading,
  selectFetchOneMaterialLoading,
  selectOneMaterial
} from './materialSlice';
import Typography from '@mui/material/Typography';
import { selectUnits } from '../units/unitSlice';
import { CircularProgress } from '@mui/material';
import RawMaterialForm from './components/RawMaterialForm';
import { RawMaterialMutation, RawMaterialWithID } from '../../types';

const EditMaterials = () => {
  const {id} = useParams() as { id: string };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const unitsData = useAppSelector(selectUnits);
  const oneMaterial = useAppSelector(selectOneMaterial);
  const editLoading = useAppSelector(selectEditMaterialLoading);
  const fetchOneLoading = useAppSelector(selectFetchOneMaterialLoading);

  useEffect(() => {
    dispatch(fetchOneMaterial(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchUnits());
  }, [dispatch]);

  const onSubmit = async (material: RawMaterialMutation) => {
    const updateMaterial: RawMaterialWithID = {
      id: id,
      name: material.name,
      amount: material.amount,
      quantity: material.quantity,
      unit_of_measure_id: material.unit_of_measure_id,
    };

    await dispatch(editMaterial(updateMaterial));
    navigate('/materials');
  };

  return (
    <>
      <Typography variant="h4" sx={{margin: '10px 0', fontWeight: 'bold'}}>Update Raw Material</Typography>
      {fetchOneLoading ? <CircularProgress/> : (
        <RawMaterialForm
          onSubmit={onSubmit}
          units={unitsData}
          isLoading={editLoading}
          existingMaterial={oneMaterial ? oneMaterial : null}
        />
      )}
    </>
  );
};

export default EditMaterials;