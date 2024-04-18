import React, { useEffect, useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Grid, TextField, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import { BudgetI, PenaltyCalculate } from '../../../types';
import Button from '@mui/material/Button';

interface Props {
  loan_part: string;
  percent_amount: string;
  total_amount: string;
  payment_date: string;
  rest_money: string;
  penalty: string;
  budgetData: BudgetI | null;
  onPay: (data: PenaltyCalculate) => void;
}

const CreditTable: React.FC<Props> = ({
  rest_money,
  loan_part,
  percent_amount,
  total_amount,
  payment_date,
  penalty,
  onPay,
  budgetData,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [penaltyCalc, setPenaltyCalc] = useState({
    overdue: 0,
    penalty_amount: 0,
  });

  const [totalSum, setTotalSum] = useState('');

  useEffect(() => {
    setTotalSum(total_amount);
  }, [total_amount, setTotalSum]);

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosenDate = e.target.value;
    setDate(chosenDate);
    const chooseDate = new Date(chosenDate);
    const payDay = new Date(payment_date);
    const timeDifference = chooseDate.getTime() - payDay.getTime();
    const oneDayMilliseconds = 1000 * 60 * 60 * 24;
    const daysDifference = Math.floor(timeDifference / oneDayMilliseconds);

    if (daysDifference < 0) {
      return;
    } else {
      const penaltyAmount = (parseFloat(loan_part) + parseFloat(percent_amount)) * parseFloat(penalty) / 100 * daysDifference;
      const total = (penaltyAmount + parseFloat(loan_part) + parseFloat(percent_amount)).toString();

      setPenaltyCalc({
        penalty_amount: penaltyAmount,
        overdue: daysDifference,
      });

      setTotalSum(total);
      console.log('Here');
    }
  };

  const onPayClick = () => {
    const data = {
      total_amount: totalSum,
      penalty_amount: penaltyCalc.penalty_amount.toString(),
      overdue: penaltyCalc.overdue.toString(),
      payment_received_date: date,
    };

    console.log(data);
    onPay(data);

    setPenaltyCalc({
      penalty_amount: 0,
      overdue: 0,
    });

    setTotalSum('');
  };

  return (
    <TableRow
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {parseFloat(loan_part).toFixed(2)}
      </TableCell>
      <TableCell component="th" scope="row">
        {parseFloat(percent_amount).toFixed(2)}
      </TableCell>
      <TableCell component="th" scope="row">
        {penaltyCalc.penalty_amount.toFixed(2)}
      </TableCell>
      <TableCell component="th" scope="row">
        {parseFloat(totalSum).toFixed(2)}
      </TableCell>
      <TableCell component="th" scope="row">
        {dayjs(payment_date).format('LLL')}
      </TableCell>
      <TableCell component="th" scope="row">
        {penaltyCalc.overdue}
      </TableCell>
      <TableCell component="th" scope="row">
        {rest_money}
      </TableCell>
      <TableCell component="th" scope="row">
        <div>
          <TextField
            type="date"
            required
            id="date"
            name="date"
            value={date}
            onChange={onDateChange}
          />
        </div>
      </TableCell>
      <TableCell component="th" scope="row">
        <Grid container alignContent="center">
          {budgetData && (
            <Grid item xs>
              <Tooltip title="Pay credit">
                <Button
                  onClick={onPayClick}
                  variant={'contained'}
                  disabled={parseFloat(budgetData?.budget_amount) < parseFloat(totalSum)}
                >
                  Pay
                </Button>
              </Tooltip>
            </Grid>
          )}
        </Grid>
      </TableCell>
    </TableRow>
  );
};

export default CreditTable;
