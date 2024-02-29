import React from 'react';
import { Link } from 'react-router-dom';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { UnitsI } from '../../../types';

interface Props {
  units: UnitsI[] | undefined;
  onDelete: (id: string) => void;
  deleteLoading: boolean | string;
}

const UnitsTable: React.FC<Props> = ({units, onDelete, deleteLoading}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Units of measure</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {units && units.map((item, index) => (
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
                <Grid container spacing={2} alignContent="center">
                  <Grid item>
                    <Button
                      component={Link} variant="contained"
                      to={'/units/update/' + item.id}
                    >
                      Update
                    </Button>
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

export default UnitsTable;