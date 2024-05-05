import React from 'react';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(LocalizedFormat);
import { RawMaterialPurchaseI } from '../../../types';

interface Props {
  rawMaterialsPurchase: RawMaterialPurchaseI[];
}

const ReportPurchase: React.FC<Props>= ({rawMaterialsPurchase}) => {
  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
      </Paper>
    </>
  );
};

export default ReportPurchase;