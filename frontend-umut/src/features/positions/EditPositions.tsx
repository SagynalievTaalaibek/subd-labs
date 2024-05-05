import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { editPosition, fetchOnePosition, fetchRoles } from './positionsThunks';
import {
  selectEditPositionLoading,
  selectFetchOnePositionLoading,
  selectOnePosition,
  selectRoles,
} from './positionsSlice';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';
import PositionForm from './components/PositionForm';
import { PositionMutation } from '../../types';


const EditPositions = () => {
  const {id} = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const roles = useAppSelector(selectRoles);
  const navigate = useNavigate();
  const onePositions = useAppSelector(selectOnePosition);
  const editLoading = useAppSelector(selectEditPositionLoading);
  const fetchOnePositionLoading = useAppSelector(selectFetchOnePositionLoading);

  useEffect(() => {
    dispatch(fetchOnePosition(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const onSubmit = async (position: PositionMutation) => {
    const updatePosition = {
      position_id: id,
      position_name: position.position_name,
      role_id: position.role_id,
    };

    await dispatch(editPosition(updatePosition));
    navigate('/positions');
  };

  const initialState: PositionMutation = {
    position_name: '',
    role_id: '',
  };


  return (
    <>
      <Typography variant="h4" sx={{margin: '10px 0', fontWeight: 'bold'}}>Update Position</Typography>
      {fetchOnePositionLoading && <CircularProgress/>}
      <PositionForm
        existingPosition={onePositions ? {position_name: onePositions.position_name, role_id: onePositions.role_id} : initialState}
        isLoading={editLoading}
        roles={roles}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default EditPositions;



