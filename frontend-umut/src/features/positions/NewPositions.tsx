import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createPositions } from './positionsThunks';
import { selectCreatePositionLoading } from './positionsSlice';
import Typography from '@mui/material/Typography';
import PositionForm from './components/PositionForm';

const NewPositions = () => {
  const dispatch = useAppDispatch();
  const createLoading = useAppSelector(selectCreatePositionLoading);
  const navigate = useNavigate();

  const onSubmit = async (position: string) => {
    await dispatch(createPositions(position));
    navigate('/positions');
  };


  return (
    <>
      <Typography variant="h4" sx={{margin: '10px 0', fontWeight: 'bold'}}>Create Position</Typography>
      <PositionForm isLoading={createLoading} onSubmit={onSubmit}/>
    </>
  );
};

export default NewPositions;