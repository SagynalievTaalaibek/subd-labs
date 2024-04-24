import React from 'react';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Grid } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import { EmployeesI } from '../../../types';
import IconButton from '@mui/material/IconButton';
import { Delete, Edit } from '@mui/icons-material';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../user/usersSlice';

interface Props {
  employees: EmployeesI[] | undefined;
  deleteLoading: boolean;
  onDelete: (id: string) => void;
}

const EmployeeTable: React.FC<Props> = ({
  employees,
  deleteLoading,
  onDelete,
}) => {
  const user = useAppSelector(selectUser);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Full name</TableCell>
            <TableCell align="left">Position</TableCell>
            <TableCell align="left">Salary</TableCell>
            <TableCell align="left">Address</TableCell>
            <TableCell align="left">Phone</TableCell>
            <TableCell align="left">Email</TableCell>
            {user && user.role !== 'director' && (
              <TableCell align="center">Action</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {employees &&
            employees.map((item, index) => (
              <TableRow
                key={item.employee_id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.full_name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.position_name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.salary}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.address}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.phone}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.email}
                </TableCell>
                {user && user.role !== 'director' && (
                  <TableCell component="th" scope="row">
                    <Grid container spacing={2} alignContent="center">
                      <Grid item xs>
                        <IconButton
                          component={Link}
                          to={'/employees/update/' + item.employee_id}
                        >
                          <Edit />
                        </IconButton>
                      </Grid>
                      <Grid item xs>
                        <IconButton
                          type="submit"
                          disabled={deleteLoading}
                          onClick={() => onDelete(item.employee_id)}
                        >
                          <Delete color="error" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeTable;
