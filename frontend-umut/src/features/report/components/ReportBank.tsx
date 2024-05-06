import React from 'react';
import { IBank } from '../../../types';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(LocalizedFormat);

interface Props {
  bankData: IBank[]
}

const ReportBank: React.FC<Props> = ({bankData}) => {
  const loan_amount  = bankData.reduce((acc, number) => {
    return acc + parseFloat(number.loan_amount);
  }, 0);

  return (
    <>
      {/* <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: '700px' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="left">ID</StyledTableCell>
                <StyledTableCell align="left">Amount of credit</StyledTableCell>
                <StyledTableCell align="left">Duration in month</StyledTableCell>
                <StyledTableCell align="left">Annual Interest Rate</StyledTableCell>
                <StyledTableCell align="left">Penalty</StyledTableCell>
                <StyledTableCell align="left">Get Credit Date</StyledTableCell>
                <StyledTableCell align="left">Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {bankData &&
                bankData.map((item, index) => (
                  <StyledTableRow
                    key={item.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <StyledTableCell component="th" scope="row">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {item.loan_amount}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {item.term_in_month}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {item.annual_interest_rate}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {item.penalty}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {dayjs(item.loan_date).format('LLL')}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
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
                      </Grid>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>*/}
      <div>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
          <tr style={{backgroundColor: '#f2f2f2', color: 'black' }}>
            <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Amount of credit</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Duration in month</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Annual Interest Rate</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Penalty</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Get Credit Date</th>
          </tr>
          </thead>
          <tbody>
          {bankData.map((item, index) => (
            <tr key={item.id}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{index + 1}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{item.loan_amount}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{item.term_in_month}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{item.annual_interest_rate}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{item.penalty}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{dayjs(item.loan_date).format('LLL')}</td>
            </tr>
          ))}
          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>Итог</td>
            <td style={{
              border: '1px solid black',
              padding: '8px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>{loan_amount}</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}
                colSpan={4}></td>
          </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ReportBank;