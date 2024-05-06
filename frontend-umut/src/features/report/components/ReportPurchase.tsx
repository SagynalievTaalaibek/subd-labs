import React from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { RawMaterialPurchaseI } from '../../../types';

dayjs.extend(LocalizedFormat);

interface Props {
  rawMaterialsPurchase: RawMaterialPurchaseI[];
}

const ReportPurchase: React.FC<Props>= ({rawMaterialsPurchase}) => {
  const amount  = rawMaterialsPurchase.reduce((acc, number) => {
    return acc + parseFloat(number.amount);
  }, 0);

  const quantity  = rawMaterialsPurchase.reduce((acc, number) => {
    return acc + parseFloat(number.quantity);
  }, 0);

  return (
    <>
      {/*<Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: '700px' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Material</TableCell>
                <TableCell align="left">Employee Name</TableCell>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Quantity</TableCell>
                <TableCell align="left">Amount</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {rawMaterialsPurchase &&
                rawMaterialsPurchase.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {item.raw_material_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {item.employee_full_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {dayjs(item.purchase_date).format('LL')}
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
      </Paper>*/}
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
        <tr style={{ backgroundColor: '#f2f2f2', color: 'black'}}>
          <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Material</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Employee Name</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Date</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Quantity</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Amount</th>
        </tr>
        </thead>
        <tbody>
        {rawMaterialsPurchase.map((item, index) => (
          <tr key={item.id}>
            <td style={{ border: '1px solid black', padding: '8px' }}>{index + 1}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.raw_material_name}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.employee_full_name}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{dayjs(item.purchase_date).format('LL')}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.quantity}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.amount}</td>
          </tr>
        ))}
        <tr>
          <td style={{ border: '1px solid black', padding: '8px' }}>Итог</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }} colSpan={3}></td>
          <td style={{ border: '1px solid black', padding: '8px' , textAlign: 'center', fontWeight: 'bold'}}>{quantity}</td>
          <td style={{ border: '1px solid black', padding: '8px' , textAlign: 'center', fontWeight: 'bold'}}>{amount}</td>
        </tr>
        </tbody>
      </table>
    </>
  );
};

export default ReportPurchase;