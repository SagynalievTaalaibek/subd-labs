import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deletePosition, fetchPositions } from './positionsThunks';
import {
  selectDeletePositionLoading,
  selectFetchPositionLoading,
  selectPositions
} from './positionsSlice';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import PositionTable from './components/PositionTable';

const Positions = () => {
  const dispatch = useAppDispatch();
  const positions = useAppSelector(selectPositions);
  const fetchLoading = useAppSelector(selectFetchPositionLoading);
  const deletePositionLoading = useAppSelector(selectDeletePositionLoading);

  const [deleteId, setDeleteId] = useState<string | null>(null);


  useEffect(() => {
    dispatch(fetchPositions());
  }, [dispatch]);

  const onDeleteConfirm = async () => {
    if (deleteId) {
      await dispatch(deletePosition(deleteId));
      await dispatch(fetchPositions());
      setDeleteId(null);
    }
  };

  const onDeleteCancel = () => {
    setDeleteId(null);
  };

  const onPositionDelete = (id: string) => {
    setDeleteId(id);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Button variant="contained" component={Link} to="/positions/create">Create position</Button>
      </Grid>
      <Grid item>
        {fetchLoading ? <CircularProgress/> : (
          <PositionTable position={positions} onDelete={onPositionDelete} deleteLoading={deletePositionLoading}/>
        )}
      </Grid>
      <Dialog open={Boolean(deleteId)} onClose={onDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this position?
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteConfirm}>Yes</Button>
          <Button onClick={onDeleteCancel}>No</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Positions;