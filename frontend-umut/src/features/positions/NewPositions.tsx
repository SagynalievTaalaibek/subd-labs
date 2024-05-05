import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createPositions, fetchRoles } from './positionsThunks';
import { selectCreatePositionLoading, selectRoles } from './positionsSlice';
import Typography from '@mui/material/Typography';
import PositionForm from './components/PositionForm';
import { useEffect } from 'react';
import { PositionMutation } from '../../types';

const NewPositions = () => {
  const dispatch = useAppDispatch();
  const createLoading = useAppSelector(selectCreatePositionLoading);
  const roles = useAppSelector(selectRoles);
  const navigate = useNavigate();

  const onSubmit = async (position: PositionMutation) => {
    await dispatch(createPositions(position));
    navigate('/positions');
  };

  useEffect(() => {
    dispatch(fetchRoles);
  }, [dispatch]);


  return (
    <>
      <Typography variant="h4" sx={{margin: '10px 0', fontWeight: 'bold'}}>Create Position</Typography>
      <PositionForm isLoading={createLoading} onSubmit={onSubmit} roles={roles}/>
    </>
  );
};

export default NewPositions;