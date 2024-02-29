import * as React from 'react';
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { RawMaterialI } from '../../../types';

interface Props {
  materials: RawMaterialI[];
  onDelete: (id: string) => void;
  deleteLoading: boolean | string;
}

const RawMaterialTable: React.FC<Props> = ({materials, onDelete, deleteLoading}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Units od measure</TableCell>
            <TableCell align="left">Quantity</TableCell>
            <TableCell align="left">Amount</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {materials && materials.map((item, index) => (
            <TableRow
              key={item.id}
              sx={{'&:last-child td, &:last-child th': {border: 0}}}
            >
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell component="th" scope="row">
                {item.name}
              </TableCell>
              <TableCell component="th" scope="row">
                {item.units_of_measure_name}
              </TableCell>
              <TableCell component="th" scope="row">
                {item.quantity}
              </TableCell>
              <TableCell component="th" scope="row">
                {item.amount}
              </TableCell>
              <TableCell component="th" scope="row">
                <Grid container spacing={2} alignContent="center">
                  <Grid item>
                    <Button
                      component={Link} variant="contained"
                      to={'/materials/update/' + item.id}
                    >
                      Update</Button>
                  </Grid>
                  <Grid item>
                    <LoadingButton
                      type="submit"
                      color="error"
                      variant="contained"
                      disabled={deleteLoading ? deleteLoading === item.id : false}
                      loading={deleteLoading === item.id}
                      onClick={() => onDelete(item.id)}
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

export default RawMaterialTable;