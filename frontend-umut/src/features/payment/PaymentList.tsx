import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCreditData, selectCreditFetching } from './paymentSlice';
import { getPaymentList } from './paymentThunks';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { CircularProgress } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';

const PaymentList = () => {
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const payments = useAppSelector(selectCreditData);
  const paymentFetching = useAppSelector(selectCreditFetching);

  useEffect(() => {
    dispatch(getPaymentList(id));
  }, [dispatch, id]);

  const loanPartAmount = payments.reduce((acc, number) => {
    return acc + parseFloat(number.loan_part);
  }, 0);

  const percentAmount = payments.reduce((acc, number) => {
    return acc + parseFloat(number.percent_amount);
  }, 0);

  const penaltyAmount = payments.reduce((acc, number) => {
    return acc + parseFloat(number.penalty_amount);
  }, 0);

  const totalAmount = payments.reduce((acc, number) => {
    return acc + parseFloat(number.total_amount);
  }, 0);

  return (
    <Box>
      <Typography variant="h4" component={'div'} sx={{ margin: '10px 0', fontWeight: 'bold' }}>Payment List</Typography>

      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
        {paymentFetching ? <CircularProgress /> : (
          <TableContainer sx={{ maxHeight: '700px' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Loan part amount</TableCell>
                  <TableCell align="left">Percent amount</TableCell>
                  <TableCell align="left">Penalty amount</TableCell>
                  <TableCell align="left">Total amount</TableCell>
                  <TableCell align="left">Payment date</TableCell>
                  <TableCell align="left">Payment received date</TableCell>
                  <TableCell align="left">Overdue</TableCell>
                  <TableCell align="left">Rest money</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments && payments.map(item => (
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    key={item.id}
                  >
                    <TableCell component="th" scope="row">
                      {parseFloat(item.loan_part).toFixed(2)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {parseFloat(item.percent_amount).toFixed(2)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {parseFloat(item.penalty_amount).toFixed(2)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {parseFloat(item.total_amount).toFixed(2)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {dayjs(item.payment_date).format('LLL')}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {dayjs(item.payment_received_date).format('LLL')}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {item.overdue}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {item.rest_money}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Typography variant={'h5'} sx={{ fontWeight: 'bold' }}>Loan part amount: {loanPartAmount}</Typography>
      <Typography variant={'h5'} sx={{ fontWeight: 'bold' }}>Percent Amount: {percentAmount}</Typography>
      <Typography variant={'h5'} sx={{ fontWeight: 'bold' }}>Penalty Amount: {penaltyAmount}</Typography>
      <Typography variant={'h5'} sx={{ fontWeight: 'bold', color: 'red' }}>Total Amount: {totalAmount}</Typography>
    </Box>
  );
};

export default PaymentList;