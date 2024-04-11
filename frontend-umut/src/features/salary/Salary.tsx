import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import SalaryTable from './components/SalaryTable';
import Typography from '@mui/material/Typography';
import {
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { BUDGET_ID, months, years } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectSalary,
  selectSalaryFetchLoading,
  selectSalaryUpdateLoading,
  selectUpdateData,
  updateDataReducer,
} from './salarySlice';
import {
  fetchSalary,
  fetchUpdateSalary,
  updateSalaryIssuedBudget,
} from './salaryThunks';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { selectBudget } from '../budget/budgetSlice';
import { fetchBudget } from '../budget/budgetThunks';
import { LoadingButton } from '@mui/lab';
import { Paid } from '@mui/icons-material';

const Salary = () => {
  const dispatch = useAppDispatch();
  const salaryData = useAppSelector(selectSalary);
  const budgetData = useAppSelector(selectBudget);
  const salaryFetchLoading = useAppSelector(selectSalaryFetchLoading);
  const salaryUpdateLoading = useAppSelector(selectSalaryUpdateLoading);
  const updateData = useAppSelector(selectUpdateData);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState(currentMonth.toString());

  const [status, setStatus] = useState(true);
  let generalSum = 0;

  useEffect(() => {
    if (!updateData) {
      dispatch(fetchSalary({ year, month }));
    } else {
      console.log(updateData);
      dispatch(fetchUpdateSalary({ year, month }));
    }
  }, [dispatch, year, month, updateData]);

  useEffect(() => {
    if (salaryData && salaryData[0] && salaryData[0].issued) {
      setStatus(false);
    } else {
      setStatus(true);
    }
  }, [salaryData]);

  useEffect(() => {
    dispatch(fetchBudget());
  }, [dispatch]);

  const onIssue = async () => {
    if (budgetData && parseFloat(budgetData.budget_amount) >= generalSum) {
      /*await dispatch(
        minusSumBudget({
          id: BUDGET_ID,
          budget_amount: generalSum.toString(),
        }),
      );

      await dispatch(issueSalary({ year, month }));*/

      await dispatch(
        updateSalaryIssuedBudget({
          yearNumber: year,
          monthNumber: month,
          budgetId: BUDGET_ID,
          budgetAmountUpdate: generalSum.toString(),
        }),
      );
      await dispatch(fetchSalary({ year, month }));

      await dispatch(fetchBudget());
      dispatch(updateDataReducer(null));
    }
  };

  if (salaryData.length > 0) {
    generalSum = salaryData.reduce((acc, number) => {
      return acc + parseFloat(number.general);
    }, 0);
  }

  return (
    <>
      <Typography
        variant="h3"
        component="div"
        sx={{ fontWeight: 'bold', mb: 2 }}
      >
        Salary list
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { width: '45ch', mt: 1 },
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id="year-label">Year</InputLabel>
                <Select
                  labelId="year-label"
                  id="year"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  required
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id="month-label">Month</InputLabel>
                <Select
                  labelId="month-label"
                  id="month"
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                  required
                >
                  {months.map((month) => (
                    <MenuItem key={month.id} value={month.value}>
                      {month.month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <AccountBalanceWalletIcon
                sx={{ fontSize: '35px', marginRight: '5px' }}
              />
              <Typography variant="h5" component="div">
                {budgetData && budgetData.budget_amount} KG
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {salaryFetchLoading ? (
        <CircularProgress />
      ) : (
        <>
          <SalaryTable salaryData={salaryData} status={status} />
          {status && budgetData && (
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={5}>
                <Typography variant={'h4'} sx={{ fontWeight: 'bold' }}>
                  General Sum: {generalSum}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <LoadingButton
                  color="primary"
                  variant="contained"
                  disabled={parseFloat(budgetData.budget_amount) < generalSum}
                  loading={salaryUpdateLoading}
                  loadingPosition="start"
                  startIcon={<Paid />}
                  onClick={() => onIssue()}
                >
                  Issue
                </LoadingButton>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </>
  );
};

export default Salary;
