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
import { UnitsI } from '../../../types';
import IconButton from '@mui/material/IconButton';
import { Delete, Edit } from '@mui/icons-material';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../user/usersSlice';

interface Props {
  units: UnitsI[] | undefined;
  onDelete: (id: string) => void;
  deleteLoading: boolean | string;
}

const UnitsTable: React.FC<Props> = ({ units, onDelete, deleteLoading }) => {
  const user = useAppSelector(selectUser);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Units of measure</TableCell>
            {user && user.role !== 'director' && (
              <TableCell align="center">Action</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {units &&
            units.map((item, index) => (
              <TableRow
                key={item.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                {user && user.role !== 'director' && (
                  <TableCell component="th" scope="row">
                    <Grid container spacing={2} alignContent="center">
                      <Grid item xs>
                        <IconButton
                          component={Link}
                          to={'/units/update/' + item.id}
                        >
                          <Edit />
                        </IconButton>
                      </Grid>
                      <Grid item xs>
                        <IconButton
                          type="submit"
                          disabled={
                            deleteLoading ? deleteLoading === item.id : false
                          }
                          onClick={() => onDelete(item.id)}
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

export default UnitsTable;
