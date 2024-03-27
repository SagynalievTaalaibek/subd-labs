import Typography from '@mui/material/Typography';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectOneSalary,
  selectSalaryFetchOneLoading,
  selectSalaryUpdateLoading,
  updateDataReducer,
} from './salarySlice';
import { CircularProgress } from '@mui/material';
import SalaryForm from './components/SalaryForm';
import { useEffect } from 'react';
import { fetchOneSalary, updateSalary } from './salaryThunks';

const EditSalary = () => {
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const oneSalaryData = useAppSelector(selectOneSalary);
  const fetchingOneSalary = useAppSelector(selectSalaryFetchOneLoading);
  const updateSalaryLoading = useAppSelector(selectSalaryUpdateLoading);

  const updateSalaryData = async (newSum: string) => {
    await dispatch(updateSalary({ id: id, general: newSum }));
    dispatch(updateDataReducer({ id: id, general: newSum }));
    navigate(`/salary`);
  };

  useEffect(() => {
    dispatch(fetchOneSalary(id));
  }, [dispatch, id]);

  return (
    <>
      <Typography variant="h4" sx={{ margin: '10px 0', fontWeight: 'bold' }}>
        Edit Salary
      </Typography>
      {fetchingOneSalary ? (
        <CircularProgress />
      ) : (
        <SalaryForm
          salaryData={oneSalaryData}
          onUpdate={updateSalaryData}
          isLoading={updateSalaryLoading}
        />
      )}
    </>
  );
};

export default EditSalary;
