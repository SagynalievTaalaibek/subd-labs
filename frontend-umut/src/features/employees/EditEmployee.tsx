import { useNavigate, useParams } from 'react-router-dom';
import { EmployeeMutation, EmployeesWithID } from '../../types';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchPositions } from '../positions/positionsThunks';
import { selectPositions } from '../positions/positionsSlice';
import EmployeeForm from './components/EmployeeForm';
import Typography from '@mui/material/Typography';
import { editEmployee, fetchOneEmployee } from './employeeThunks';
import { selectEditEmployeeLoading, selectOneEmployee } from './employeeSlice';

const EditEmployee = () => {
  const dispatch = useAppDispatch();
  const positions = useAppSelector(selectPositions);
  const oneEmployee = useAppSelector(selectOneEmployee);
  const editLoading = useAppSelector(selectEditEmployeeLoading);
  const {id} = useParams() as { id: string };
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPositions());
  }, [dispatch]);


  useEffect(() => {
    dispatch(fetchOneEmployee(id));
  }, [dispatch, id]);


  const onSubmit = async (employee: EmployeeMutation) => {
    const updateEmployee: EmployeesWithID = {
      employee_id: id,
      full_name: employee.full_name,
      position_id: employee.position_id,
      phone: employee.phone,
      address: employee.address,
      salary: employee.salary,
    };

    await dispatch(editEmployee(updateEmployee));
    navigate('/employees');
  };


  return (
    <>
      <Typography variant="h4" sx={{margin: '10px 0', fontWeight: 'bold'}}>Update Position</Typography>
      <EmployeeForm
        existingEmployee={oneEmployee ? oneEmployee : null}
        isLoading={editLoading}
        onSubmit={onSubmit}
        positions={positions}
      />
    </>
  );
};

export default EditEmployee;