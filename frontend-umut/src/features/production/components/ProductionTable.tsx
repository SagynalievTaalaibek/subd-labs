import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Grid } from '@mui/material';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';
import { ProductionI } from '../../../types';
import IconButton from '@mui/material/IconButton';
import { Delete } from '@mui/icons-material';

dayjs.extend(LocalizedFormat);

interface Props {
  productionData: ProductionI[];
  onDelete: (id: string) => void;
  deleteLoading: boolean | string;
}

const ProductionTable: React.FC<Props> = ({
  productionData,
  onDelete,
  deleteLoading,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Product</TableCell>
            <TableCell align="left">Employee</TableCell>
            <TableCell align="left">Production date</TableCell>
            <TableCell align="left">Quantity</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productionData &&
            productionData.map((item, index) => (
              <TableRow
                key={item.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.product_name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.employee_full_name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {dayjs(item.production_date).format('LL')}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.quantity}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Grid container spacing={2} alignContent="center">
                    <Grid item>
                      <IconButton
                        disabled={
                          deleteLoading ? deleteLoading === item.id : false
                        }
                        onClick={() => onDelete(item.id)}
                      >
                        <Delete color={'error'} />
                      </IconButton>
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

export default ProductionTable;
