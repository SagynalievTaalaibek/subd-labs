import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { editPosition, fetchOnePosition } from './positionsThunks';
import { selectEditPositionLoading, selectFetchOnePositionLoading, selectOnePosition } from './positionsSlice';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';
import PositionForm from './components/PositionForm';
import { PositionI } from '../../types';

const EditPositions = () => {
  const {id} = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onePositions = useAppSelector(selectOnePosition);
  const editLoading = useAppSelector(selectEditPositionLoading);
  const fetchOnePositionLoading = useAppSelector(selectFetchOnePositionLoading);

  useEffect(() => {
    dispatch(fetchOnePosition(id));
  }, [dispatch, id]);


  const onSubmit = async (position: string) => {
    const updatePosition: PositionI = {
      position_id: id,
      position_name: position,
    };

    await dispatch(editPosition(updatePosition));
    navigate('/positions');
  };


  return (
    <>
      <Typography variant="h4" sx={{margin: '10px 0', fontWeight: 'bold'}}>Update Position</Typography>
      {fetchOnePositionLoading && <CircularProgress/>}
      <PositionForm
        existingPosition={onePositions ? onePositions.position_name : ''}
        isLoading={editLoading}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default EditPositions;



