import React from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Grid, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { Inventory, Paid } from '@mui/icons-material';
import Paper from '@mui/material/Paper';
import { IBank } from '../../../types';
import dayjs from 'dayjs';

interface Props {
  bankData: IBank[],
}

const BankTable: React.FC<Props> = ({ bankData }) => {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: '700px' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left">ID</TableCell>
              <TableCell align="left">Amount of credit</TableCell>
              <TableCell align="left">Duration in month</TableCell>
              <TableCell align="left">Annual Interest Rate</TableCell>
              <TableCell align="left">Penalty</TableCell>
              <TableCell align="left">Get Credit Date</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bankData &&
              bankData.map((item, index) => (
                <TableRow
                  key={item.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {item.loan_amount}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {item.term_in_month}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {item.annual_interest_rate}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {item.penalty}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {dayjs(item.loan_date).format('LLL')}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Grid container alignContent="center">
                      <Grid item xs>
                        <Tooltip title="Credit information">
                          <IconButton
                            component={Link}
                            to={'/bank/history/' + item.id}
                          >
                            <Inventory />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item xs>
                        <Tooltip title="Pay credit">
                          <IconButton
                            component={Link}
                            to={'/bank/pay/' + item.id}
                          >
                            <Paid />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default BankTable;