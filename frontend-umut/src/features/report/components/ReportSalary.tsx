import React from 'react';
import { SalaryI } from '../../../types';

interface Props {
  salaryData: SalaryI[];
}

const ReportSalary: React.FC<Props> = ({salaryData}) => {
  const purchase_count  = salaryData.reduce((acc, number) => {
    return acc + (number.purchase_count);
  }, 0);

  const production_count  = salaryData.reduce((acc, number) => {
    return acc + (number.production_count);
  }, 0);

  const sales_count  = salaryData.reduce((acc, number) => {
    return acc + (number.sales_count);
  }, 0);

  const salary  = salaryData.reduce((acc, number) => {
    return acc + parseFloat(number.salary);
  }, 0);

  const common_count  = salaryData.reduce((acc, number) => {
    return acc + (number.common_count);
  }, 0);

  const general  = salaryData.reduce((acc, number) => {
    return acc + parseFloat(number.general);
  }, 0);

  const bonus  = salaryData.reduce((acc, number) => {
    return acc + parseFloat(number.bonus);
  }, 0);


  return (
    <>
      {/*<TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Month</TableCell>
              <TableCell align="center">Purchase</TableCell>
              <TableCell align="center">Production</TableCell>
              <TableCell align="center">Sales</TableCell>
              <TableCell align="center">Common</TableCell>
              <TableCell align="center">Salary</TableCell>
              <TableCell align="center">Bonus</TableCell>
              <TableCell align="center">Main Salary</TableCell>
              <TableCell align="center">Issue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salaryData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.full_name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.year}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.month}
                </TableCell>
                <TableCell align="center">
                  {item.purchase_count}
                </TableCell>
                <TableCell align="center">
                  {item.production_count}
                </TableCell>
                <TableCell align="center">
                  {item.sales_count}
                </TableCell>
                <TableCell align="center">
                  {item.common_count}
                </TableCell>
                <TableCell align="center">{item.salary}</TableCell>
                <TableCell align="center">{item.bonus}</TableCell>
                <TableCell align="center">{item.general}</TableCell>
                <TableCell align="center">
                  {item.issued ? 'Yes' : 'No'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>*/}
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
        <tr style={{ backgroundColor: '#f2f2f2', color: 'black'}}>
          <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Employee</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Year</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Month</th>
          <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Purchase</th>
          <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Production</th>
          <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Sales</th>
          <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Common</th>
          <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Salary</th>
          <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Bonus</th>
          <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Main Salary</th>
          <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Issue</th>
        </tr>
        </thead>
        <tbody>
        {salaryData.map((item, index) => (
          <tr key={item.id} style={{ borderBottom: '1px solid black' }}>
            <td style={{ border: '1px solid black', padding: '8px' }}>{index + 1}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.full_name}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.year}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.month}</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.purchase_count}</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.production_count}</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.sales_count}</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.common_count}</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.salary}</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.bonus}</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.general}</td>
            <td style={{
              border: '1px solid black',
              padding: '8px',
              textAlign: 'center'
            }}>{item.issued ? 'Yes' : 'No'}</td>
          </tr>
        ))}
        <tr>
          <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Итог</td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }} colSpan={3}></td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{purchase_count}</td>
          <td style={{ border: '1px solid black', padding: '8px' , textAlign: 'center', fontWeight: 'bold'}}>{production_count}</td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{sales_count}</td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{common_count}</td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{salary}</td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{bonus}</td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }} colSpan={2}>{general}</td>
        </tr>
        </tbody>
      </table>
    </>
  );
};

export default ReportSalary;