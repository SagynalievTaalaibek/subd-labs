import React from 'react';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import dayjs from 'dayjs';
import TableContainer from '@mui/material/TableContainer';
import { ProductSalesI } from '../../../types';

dayjs.extend(LocalizedFormat);

interface Props {
  productSales: ProductSalesI[];
}

const ReportSales: React.FC<Props> = ({productSales}) => {
  return (
    <>
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
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ReportSales;