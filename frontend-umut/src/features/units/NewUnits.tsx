import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createUnits } from './unitThunks';
import { selectCreateUnitLoading } from './unitSlice';
import Typography from '@mui/material/Typography';
import UnitsForm from './components/UnitsForm';

const NewUnits = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const createLoading = useAppSelector(selectCreateUnitLoading);

  const onSubmit = async (units: string) => {
    await dispatch(createUnits(units));
    navigate('/units');
  };


  return (
    <>
      <Typography variant="h4" sx={{margin: '10px 0', fontWeight: 'bold'}}>Create Units</Typography>
      <UnitsForm onSubmit={onSubmit} isLoading={createLoading}/>
    </>
  );
};

export default NewUnits;