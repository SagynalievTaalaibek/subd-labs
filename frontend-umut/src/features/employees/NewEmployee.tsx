import { useNavigate } from 'react-router-dom';
import { EmployeeMutation } from '../../types';
import Typography from '@mui/material/Typography';
import EmployeeForm from './components/EmployeeForm';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectPositions } from '../positions/positionsSlice';
import { useEffect } from 'react';
import { fetchPositions } from '../positions/positionsThunks';
import { createEmployees } from './employeeThunks';
import { selectCreateEmployeeLoading } from './employeeSlice';

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
      <EmployeeForm onSubmit={onSubmit} positions={positions} isLoading={createLoading}/>
    </>
  );
};

export default NewEmployee;