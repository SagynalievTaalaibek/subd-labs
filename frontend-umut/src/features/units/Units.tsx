import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteUnit, fetchUnits } from './unitThunks';
import { selectDeleteUnitLoading, selectFetchUnitLoading, selectUnits } from './unitSlice';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import UnitsTable from './components/UnitsTable';
import { selectUser } from '../user/usersSlice';

const Units = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const unitsData = useAppSelector(selectUnits);
  const fetchLoading = useAppSelector(selectFetchUnitLoading);
  const deleteLoading = useAppSelector(selectDeleteUnitLoading);

  const [deleteId, setDeleteId] = useState<string | null>(null);


  useEffect(() => {
    dispatch(fetchUnits());
  }, [dispatch]);

  const onDeleteConfirm = async () => {
    if (deleteId) {
      await dispatch(deleteUnit(deleteId));
      await dispatch(fetchUnits());
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
      {user && user.role !== 'director' && (
        <Grid item xs={12}>
          <Button variant="contained" component={Link} to="/units/create">Create Units</Button>
        </Grid>
      )}
      <Grid item>
        {fetchLoading ? <CircularProgress /> : (
          <UnitsTable units={unitsData} onDelete={onPositionDelete} deleteLoading={deleteLoading} />
        )}
      </Grid>
      <Dialog open={Boolean(deleteId)} onClose={onDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this units?
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteConfirm}>Yes</Button>
          <Button onClick={onDeleteCancel}>No</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Units;