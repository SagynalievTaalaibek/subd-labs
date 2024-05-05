import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(LocalizedFormat);
import TableContainer from '@mui/material/TableContainer';
import { ProductionI } from '../../../types';

interface Props {
  productionData: ProductionI[];
}

const ReportProduction: React.FC<Props> = ({productionData}) => {
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">ID</TableCell>
              <TableCell align="left">Product</TableCell>
              <TableCell align="left">Employee</TableCell>
              <TableCell align="left">Production date</TableCell>
              <TableCell align="left">Quantity</TableCell>
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
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ReportProduction;