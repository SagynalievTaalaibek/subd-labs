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
import { SalaryI } from '../../../types';
import IconButton from '@mui/material/IconButton';
import { Edit } from '@mui/icons-material';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../user/usersSlice';

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

const StyledIconEdit = styled(Edit)`
  &:hover {
    color: #76ff03;
  }
`;

const SalaryTable: React.FC<Props> = ({ salaryData, status }) => {
  const user = useAppSelector(selectUser);

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
            {status && user && user.role !== 'director' && (
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
              {status && user && user.role !== 'director' && (
                <StyledTableCell align="center">
                  <IconButton component={Link} to={`/salary/update/${item.id}`}>
                    <StyledIconEdit />
                  </IconButton>
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
