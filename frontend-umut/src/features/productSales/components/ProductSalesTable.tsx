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
import { ProductSalesI } from '../../../types';
import IconButton from '@mui/material/IconButton';
import { Delete } from '@mui/icons-material';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../user/usersSlice';

dayjs.extend(LocalizedFormat);

interface Props {
  productSales: ProductSalesI[];
  onDelete: (id: string) => void;
  deleteLoading: boolean | string;
}

const ProductSalesTable: React.FC<Props> = ({
  productSales,
  onDelete,
  deleteLoading,
}) => {
  const user = useAppSelector(selectUser);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Product</TableCell>
            <TableCell align="left">Employee</TableCell>
            <TableCell align="left">Sales date</TableCell>
            <TableCell align="left">Quantity</TableCell>
            <TableCell align="left">Amount</TableCell>
            {user && user.role !== 'director' && (
              <TableCell align="left">Action</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {productSales &&
            productSales.map((item, index) => (
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
                  {dayjs(item.sale_date).format('LL')}
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
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductSalesTable;
