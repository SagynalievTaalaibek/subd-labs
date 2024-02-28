import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectEditUnitLoading, selectOneUnit } from './unitSlice';
import Typography from '@mui/material/Typography';
import UnitsForm from './components/UnitsForm';
import { editUnit, fetchOneUnit } from './unitThunks';
import { UnitsI } from '../../types';
import { useEffect } from 'react';

const EditUnits = () => {
  const {id} = useParams() as { id: string };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const oneUnit = useAppSelector(selectOneUnit);
  const editLoading = useAppSelector(selectEditUnitLoading);

  useEffect(() => {
    dispatch(fetchOneUnit(id));
  }, [dispatch, id]);

  const onSubmit = async (units: string) => {
    const updateUnits: UnitsI = {
      id,
      name: units,
    };

    await dispatch(editUnit(updateUnits));
    navigate('/units');
  };


  return (
    <>
      <Typography variant="h4" sx={{margin: '10px 0', fontWeight: 'bold'}}>Update Units</Typography>
      <UnitsForm onSubmit={onSubmit} isLoading={editLoading} existingPosition={oneUnit ? oneUnit.name : ''}/>
    </>
  );
};

export default EditUnits;