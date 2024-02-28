import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { editPosition, fetchOnePosition } from './positionsThunks';
import Typography from '@mui/material/Typography';
import PositionForm from './components/PositionForm';
import {
  selectEditPositionLoading,
  selectFetchOnePositionLoading,
  selectOnePosition
} from './positionsSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { PositionI } from '../../types';
import { CircularProgress } from '@mui/material';

const EditPositions = () => {
  const {id} = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onePositions = useSelector(selectOnePosition);
  const editLoading = useSelector(selectEditPositionLoading);
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



