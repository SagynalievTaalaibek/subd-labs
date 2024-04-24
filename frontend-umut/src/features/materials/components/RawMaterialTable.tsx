import React from 'react';
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Grid } from '@mui/material';
import { RawMaterialI } from '../../../types';
import IconButton from '@mui/material/IconButton';
import { Delete, Edit } from '@mui/icons-material';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../user/usersSlice';
dayjs.extend(LocalizedFormat);

interface Props {
  materials: RawMaterialI[];
  onDelete: (id: string) => void;
  deleteLoading: boolean | string;
}

const RawMaterialTable: React.FC<Props> = ({
  materials,
  onDelete,
  deleteLoading,
}) => {
  const user = useAppSelector(selectUser);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: '700px' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left">ID</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Units od measure</TableCell>
              <TableCell align="left">Quantity</TableCell>
              <TableCell align="left">Amount</TableCell>
              {user && user.role !== 'director' && (
                <TableCell align="left">Action</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {materials &&
              materials.map((item, index) => (
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
                  <TableCell component="th" scope="row">
                    {item.units_of_measure_name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {item.quantity}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {item.amount}
                  </TableCell>
                  {user && user.role !== 'director' && (
                    <TableCell component="th" scope="row">
                      <Grid container spacing={2} alignContent="center">
                        <Grid item xs>
                          <IconButton
                            component={Link}
                            to={'/materials/update/' + item.id}
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
    </Paper>
  );
};

export default RawMaterialTable;
