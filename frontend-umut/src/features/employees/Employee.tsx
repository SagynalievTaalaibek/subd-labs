import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteEmployees, fetchEmployees } from './employeeThunks';
import {
  selectDeleteEmployeeLoading,
  selectEmployees,
  selectFetchEmployeeLoading,
} from './employeeSlice';
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import Button from '@mui/material/Button';
import EmployeeTable from './components/EmployeeTable';
import { selectUser } from '../user/usersSlice';


const Employee = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const employees = useAppSelector(selectEmployees);
  const deleteLoading = useAppSelector(selectDeleteEmployeeLoading);
  const fetchLoading = useAppSelector(selectFetchEmployeeLoading);
  const [deleteId, setDeleteId] = useState<string | null>(null);


  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const onDeleteConfirm = async () => {
    if (deleteId) {
      await dispatch(deleteEmployees(deleteId));
      dispatch(fetchEmployees());
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
          <Button variant="contained" component={Link} to="/employees/create">
            Create employee
          </Button>

        </Grid>
      )}
      <Grid item>
        {fetchLoading ? (
          <CircularProgress />
        ) : (
          <EmployeeTable
            employees={employees}
            deleteLoading={deleteLoading}
            onDelete={onPositionDelete}
          />
        )}
      </Grid>
      <Dialog open={Boolean(deleteId)} onClose={onDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this employee?
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteConfirm}>Yes</Button>
          <Button onClick={onDeleteCancel}>No</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Employee;
