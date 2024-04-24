import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchPositions } from '../positions/positionsThunks';
import { editEmployee, editPasswordEmail, fetchOneEmployee } from './employeeThunks';
import { selectPositions } from '../positions/positionsSlice';
import { selectEditEmployeeLoading, selectOneEmployee } from './employeeSlice';
import Typography from '@mui/material/Typography';
import { EmployeeEditPasswordEmail, EmployeeMutation, EmployeesWithID } from '../../types';
import EmployeeUpdateForm from './components/EmployeeUpdateForm';

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


  const onSubmit = async (employee: EmployeeMutation, password?: boolean) => {
    if (password) {
      const updateEmployee: EmployeeEditPasswordEmail = {
        employee_id: id,
        full_name: employee.full_name,
        position_id: employee.position_id,
        phone: employee.phone,
        address: employee.address,
        salary: employee.salary,
        email: employee.email,
        password: employee.password,
      };

      dispatch(editPasswordEmail(updateEmployee));
    } else {
      const updateEmployee: EmployeesWithID = {
        employee_id: id,
        full_name: employee.full_name,
        position_id: employee.position_id,
        phone: employee.phone,
        address: employee.address,
        salary: employee.salary,
        email: employee.email,
      };

      await dispatch(editEmployee(updateEmployee));
    }

    navigate('/employees');
  };


  return (
    <>
      <Typography variant="h4" sx={{margin: '10px 0', fontWeight: 'bold'}}>Update Position</Typography>
      {oneEmployee && (
        <EmployeeUpdateForm
          existingEmployee={oneEmployee}
          isLoading={editLoading}
          onSubmit={onSubmit}
          positions={positions}
        />
      )}
    </>
  );
};

export default EditEmployee;