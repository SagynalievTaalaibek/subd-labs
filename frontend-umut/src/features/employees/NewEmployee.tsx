import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchPositions } from '../positions/positionsThunks';
import { createEmployees } from './employeeThunks';
import { selectPositions } from '../positions/positionsSlice';
import { selectCreateEmployeeLoading } from './employeeSlice';
import Typography from '@mui/material/Typography';
import EmployeeCreateForm from './components/EmployeeCreateForm';
import { EmployeeMutation } from '../../types';

const NewEmployee = () => {
  const dispatch = useAppDispatch();
  const positions = useAppSelector(selectPositions);
  const createLoading = useAppSelector(selectCreateEmployeeLoading);
  const navigate = useNavigate();


  useEffect(() => {
    dispatch(fetchPositions());
  }, [dispatch]);

  const onSubmit = async (employee: EmployeeMutation) => {
    await dispatch(createEmployees(employee));
    navigate('/employees');
  };


  return (
    <>
      <Typography variant="h4" sx={{margin: '10px 0', fontWeight: 'bold'}}>Create Employee</Typography>
      <EmployeeCreateForm onSubmit={onSubmit} positions={positions} isLoading={createLoading}/>
    </>
  );
};

export default NewEmployee;