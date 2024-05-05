import React from 'react';
import { SalaryI } from '../../../types';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

interface Props {
  salaryData: SalaryI[];
}

const ReportSalary: React.FC<Props> = ({salaryData}) => {
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Month</TableCell>
              <TableCell align="center">Purchase</TableCell>
              <TableCell align="center">Production</TableCell>
              <TableCell align="center">Sales</TableCell>
              <TableCell align="center">Common</TableCell>
              <TableCell align="center">Salary</TableCell>
              <TableCell align="center">Bonus</TableCell>
              <TableCell align="center">Main Salary</TableCell>
              <TableCell align="center">Issue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salaryData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.full_name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.year}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.month}
                </TableCell>
                <TableCell align="center">
                  {item.purchase_count}
                </TableCell>
                <TableCell align="center">
                  {item.production_count}
                </TableCell>
                <TableCell align="center">
                  {item.sales_count}
                </TableCell>
                <TableCell align="center">
                  {item.common_count}
                </TableCell>
                <TableCell align="center">{item.salary}</TableCell>
                <TableCell align="center">{item.bonus}</TableCell>
                <TableCell align="center">{item.general}</TableCell>
                <TableCell align="center">
                  {item.issued ? 'Yes' : 'No'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ReportSalary;