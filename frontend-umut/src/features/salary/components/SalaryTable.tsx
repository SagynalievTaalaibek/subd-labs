import React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { SalaryI } from '../../../types';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface Props {
  salaryData: SalaryI[];
  status: boolean;
}

const SalaryTable: React.FC<Props> = ({ salaryData, status }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Employee</StyledTableCell>
            <StyledTableCell align="center">Purchase</StyledTableCell>
            <StyledTableCell align="center">Production</StyledTableCell>
            <StyledTableCell align="center">Sales</StyledTableCell>
            <StyledTableCell align="center">Common</StyledTableCell>
            <StyledTableCell align="center">Salary</StyledTableCell>
            <StyledTableCell align="center">Bonus</StyledTableCell>
            <StyledTableCell align="center">Main Salary</StyledTableCell>
            <StyledTableCell align="center">Issue</StyledTableCell>
            {status && (
              <StyledTableCell align="center">Actions</StyledTableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {salaryData.map((item, index) => (
            <StyledTableRow key={item.id}>
              <StyledTableCell component="th" scope="row">
                {index + 1}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                {item.full_name}
              </StyledTableCell>
              <StyledTableCell align="center">
                {item.purchase_count}
              </StyledTableCell>
              <StyledTableCell align="center">
                {item.production_count}
              </StyledTableCell>
              <StyledTableCell align="center">
                {item.sales_count}
              </StyledTableCell>
              <StyledTableCell align="center">
                {item.common_count}
              </StyledTableCell>
              <StyledTableCell align="center">{item.salary}</StyledTableCell>
              <StyledTableCell align="center">{item.bonus}</StyledTableCell>
              <StyledTableCell align="center">{item.general}</StyledTableCell>
              <StyledTableCell align="center">
                {item.issued ? 'Yes' : 'No'}
              </StyledTableCell>
              {status && (
                <StyledTableCell align="center">
                  <Button
                    component={Link}
                    variant="contained"
                    to={`/salary/update/${item.id}`}
                    sx={{ backgroundColor: '#7a6664' }}
                  >
                    Update
                  </Button>
                </StyledTableCell>
              )}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SalaryTable;
