import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteMaterial, fetchMaterials } from './materialThunks';
import {
  selectDeleteMaterialLoading,
  selectFetchMaterialsLoading,
  selectMaterials
} from './materialSlice';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import RawMaterialTable from './components/RawMaterialTable';

const Materials = () => {
  const dispatch = useAppDispatch();
  const materials = useAppSelector(selectMaterials);
  const deleteLoading = useAppSelector(selectDeleteMaterialLoading);
  const fetchLoading = useAppSelector(selectFetchMaterialsLoading);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  const onDeleteConfirm = async () => {
    if (deleteId) {
      await dispatch(deleteMaterial(deleteId));
      await dispatch(fetchMaterials());
      setDeleteId(null);
    }
  };

  const onDeleteCancel = () => {
    setDeleteId(null);
  };

  const onRawMaterialsDelete = (id: string) => {
    setDeleteId(id);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Button variant="contained" component={Link} to="/materials/create">Create Raw Material</Button>
      </Grid>
      <Grid item>
        {fetchLoading ? <CircularProgress/> : (
          <RawMaterialTable materials={materials} onDelete={onRawMaterialsDelete} deleteLoading={deleteLoading}/>
        )}
      </Grid>
      <Dialog open={Boolean(deleteId)} onClose={onDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this raw material ?
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteConfirm}>Yes</Button>
          <Button onClick={onDeleteCancel}>No</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Materials;