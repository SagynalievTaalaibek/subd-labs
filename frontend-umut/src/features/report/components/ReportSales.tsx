import React from 'react';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';
import { ProductSalesI } from '../../../types';

dayjs.extend(LocalizedFormat);

interface Props {
  productSales: ProductSalesI[];
}

const ReportSales: React.FC<Props> = ({productSales}) => {
  const amount  = productSales.reduce((acc, number) => {
    return acc + parseFloat(number.amount);
  }, 0);

  const quantity  = productSales.reduce((acc, number) => {
    return acc + parseFloat(number.quantity);
  }, 0);

  return (
    <>
      {/* <TableContainer component={Paper}>
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
      </TableContainer>*/}
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
        <tr  style={{ backgroundColor: '#f2f2f2', color: 'black'}}>
          <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Product</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Employee</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Sales date</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Quantity</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Amount</th>
        </tr>
        </thead>
        <tbody>
        {productSales.map((item, index) => (
          <tr key={item.id} style={{ borderBottom: '1px solid black' }}>
            <td style={{ border: '1px solid black', padding: '8px' }}>{index + 1}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.product_name}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.employee_full_name}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{dayjs(item.sale_date).format('LL')}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.quantity}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.amount}</td>
          </tr>
        ))}
        <tr>
          <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Итог</td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }} colSpan={3}></td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{quantity}</td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{amount}</td>
        </tr>
        </tbody>
      </table>
    </>
  );
};

export default ReportSales;