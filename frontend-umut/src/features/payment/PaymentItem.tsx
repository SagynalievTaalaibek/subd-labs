import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { CircularProgress, Grid } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useEffect } from 'react';
import CreditTable from './component/CreditTable';
import { selectCreditFetching, selectOneCredit } from './paymentSlice';
import { fetchCreditByBankId, payCredit } from './paymentThunks';
import { PaymentMutationWithoutPenalty, PenaltyCalculate } from '../../types';
import { fetchBudget } from '../budget/budgetThunks';
import { selectBudget } from '../budget/budgetSlice';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const PaymentItem = () => {
  const { id } = useParams() as { id: string };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const creditData = useAppSelector(selectOneCredit);
  const budgetData = useAppSelector(selectBudget);
  const creditFetching = useAppSelector(selectCreditFetching);

  useEffect(() => {
    dispatch(fetchCreditByBankId(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchBudget());
  }, [dispatch]);
  const onSubmit = (data: PenaltyCalculate) => {
    if (!creditData) return;

    const newPayment: PaymentMutationWithoutPenalty = {
      loan_part: creditData.loan_part,
      percent_amount: creditData.percent_amount,
      penalty_amount: data.penalty_amount,
      total_amount: data.total_amount,
      payment_date: creditData.payment_date,
      payment_received_date: data.payment_received_date,
      rest_money: creditData.rest_money,
      bank_id: creditData.bank_id,
      overdue: data.overdue,
    }

    dispatch(payCredit(newPayment));
    navigate('/bank');
  }

  return (
    <Box>
      <Typography variant="h4" component={'div'} sx={{ margin: '10px 0', fontWeight: 'bold' }}>Payment</Typography>
      <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <AccountBalanceWalletIcon
          sx={{ fontSize: '35px', marginRight: '5px' }}
        />
        <Typography variant="h5" component="div">
          {budgetData && budgetData.budget_amount} KG
        </Typography>
      </Grid>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {!creditData && creditFetching ? <CircularProgress /> : (
          <TableContainer sx={{ maxHeight: '700px' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Loan part amount</TableCell>
                  <TableCell align="left">Percent amount</TableCell>
                  <TableCell align="left">Penalty amount</TableCell>
                  <TableCell align="left">Total amount</TableCell>
                  <TableCell align="left">Payment date</TableCell>
                  <TableCell align="left">Overdue</TableCell>
                  <TableCell align="left">Rest money</TableCell>
                  <TableCell align="left">Payment received date</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {creditData && (
                  <CreditTable
                    loan_part={creditData.loan_part}
                    percent_amount={creditData.percent_amount}
                    total_amount={creditData.total_amount}
                    rest_money={creditData.rest_money}
                    payment_date={creditData.payment_date}
                    penalty={creditData.penalty}
                    budgetData={budgetData}
                    onPay={onSubmit}
                  />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default PaymentItem;