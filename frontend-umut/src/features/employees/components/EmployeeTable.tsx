import React from 'react';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Button, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import TableContainer from '@mui/material/TableContainer';
import { EmployeesI } from '../../../types';

interface Props {
  employees: EmployeesI[] | undefined;
  deleteLoading: boolean;
  onDelete: (id: string) => void;
}

const EmployeeTable: React.FC<Props> = ({employees, deleteLoading, onDelete}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Full name</TableCell>
            <TableCell align="left">Position</TableCell>
            <TableCell align="left">Salary</TableCell>
            <TableCell align="left">Address</TableCell>
            <TableCell align="left">Phone</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees && employees.map((item, index) => (
            <TableRow
              key={item.employee_id}
              sx={{'&:last-child td, &:last-child th': {border: 0}}}
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
                <Grid container spacing={2} alignContent="center">
                  <Grid item>
                    <Button component={Link} variant="contained"
                            to={'/employees/update/' + item.employee_id}>Update</Button>
                  </Grid>
                  <Grid item>
                    <LoadingButton
                      type="submit"
                      color="error"
                      variant="contained"
                      disabled={deleteLoading}
                      loading={deleteLoading}
                      onClick={() => onDelete(item.employee_id)}
                    >
                      Delete
                    </LoadingButton>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeTable;