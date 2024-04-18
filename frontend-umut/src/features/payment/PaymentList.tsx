import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
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
  const dispatch = useDispatch();
  const payments = useAppSelector(selectCreditData);
  const paymentFetching = useAppSelector(selectCreditFetching);

  useEffect(() => {
    dispatch(getPaymentList(id));
  }, [dispatch, id]);


  return (
    <Box>
      <Typography variant="h4" component={'div'} sx={{ margin: '10px 0', fontWeight: 'bold' }}>Payment List</Typography>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
    </Box>
  );
};

export default PaymentList;