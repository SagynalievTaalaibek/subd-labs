import React from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { ProductionI } from '../../../types';

dayjs.extend(LocalizedFormat);

interface Props {
  productionData: ProductionI[];
}

const ReportProduction: React.FC<Props> = ({productionData}) => {

  const quantity  = productionData.reduce((acc, number) => {
    return acc + parseFloat(number.quantity);
  }, 0);

  const amount  = productionData.reduce((acc, number) => {
    return acc + parseFloat(number.amount);
  }, 0);

  return (
    <>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
        <tr style={{ backgroundColor: '#f2f2f2', color: 'black'}}>
          <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Product</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Employee</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Production date</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Quantity</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Amount</th>
        </tr>
        </thead>
        <tbody>
        {productionData.map((item, index) => (
          <tr key={item.id}>
            <td style={{ border: '1px solid black', padding: '8px' }}>{index + 1}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.product_name}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.employee_full_name}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{dayjs(item.production_date).format('LL')}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.quantity}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.amount}</td>
          </tr>
        ))}
        <tr>
          <td style={{ border: '1px solid black', padding: '8px' }}>Итог</td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }} colSpan={3}></td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{quantity}</td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{amount}</td>
        </tr>
        </tbody>
      </table>
    </>
  );
};

export default ReportProduction;