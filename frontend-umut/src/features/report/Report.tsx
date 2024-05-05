import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { IBank, ProductionI, ProductSalesI, RawMaterialPurchaseI, SalaryI } from '../../types';
import * as XLSX from 'xlsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Grid, TextField } from '@mui/material';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { selectProductions } from '../production/productionSlice';
import { fetchProductionByDate } from '../production/productionThunks';
import ReportProduction from './components/ReportProduction';
import { selectRawMaterialsPurchase } from '../rawMaterialPurchase/purchaseSlice';
import ReportPurchase from './components/ReportPurchase';
import ReportSales from './components/ReportSales';
import { selectProductSales } from '../productSales/productSalesSlice';
import { fetchProductSalesByDate } from '../productSales/productSalesThunks';
import { fetchRawMaterialsPurchasesByDate } from '../rawMaterialPurchase/purchaseThunks';
import ReportSalary from './components/ReportSalary';
import { fetchReportSalary } from '../salary/salaryThunks';
import { selectSalary } from '../salary/salarySlice';
import { fetchBanksByDate } from '../bank/bankThunks';
import ReportBank from './components/ReportBank';
import { selectBanks } from '../bank/bankSlice';
import { selectUser } from '../user/usersSlice';


const Report = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const production = useAppSelector(selectProductions);
  const purchase = useAppSelector(selectRawMaterialsPurchase);
  const sales = useAppSelector(selectProductSales);
  const salary = useAppSelector(selectSalary);
  const bank = useAppSelector(selectBanks);
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [filename, setFilename] = useState('');

  const exportToExcel = (data: ProductionI[] | ProductSalesI[] | IBank[] | SalaryI[] | RawMaterialPurchaseI[], fileName: string) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, fileName.toLowerCase());
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const handleExport = () => {
    switch (filename) {
      case 'production':
        exportToExcel(production, filename);
        break;
      case 'product-sales':
        exportToExcel(sales, filename);
        break;
      case 'purchase':
        exportToExcel(purchase, filename);
        break;
      case 'salary':
        exportToExcel(salary, filename);
        break;
      case 'bank':
        exportToExcel(bank, filename);
        break;
      default:
        console.log('No such file');
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    switch (filename) {
      case 'production':
        dispatch(fetchProductionByDate({ startDate: dateStart, endDate: dateEnd }));
        break;
      case 'product-sales':
        dispatch(fetchProductSalesByDate({ startDate: dateStart, endDate: dateEnd }));
        break;
      case 'purchase':
        dispatch(fetchRawMaterialsPurchasesByDate({ startDate: dateStart, endDate: dateEnd }));
        break;
      case 'salary':
        dispatch(fetchReportSalary({ startDate: dateStart, endDate: dateEnd }));
        break;
      case 'bank':
        dispatch(fetchBanksByDate({ startDate: dateStart, endDate: dateEnd }));
        break;
      default:
        console.log('No such file');
    }
  };

  let table = null;

  if (filename.length > 0 && dateStart.length > 0 && dateStart.length > 0) {
    switch (filename) {
      case 'production':
        table = (<ReportProduction productionData={production} />);
        break;
      case 'purchase':
        table = (<ReportPurchase rawMaterialsPurchase={purchase} />);
        break;
      case 'product-sales':
        table = (<ReportSales productSales={sales} />);
        break;
      case 'salary':
        table = (<ReportSalary salaryData={salary} />);
        break;
      case 'bank':
        table = (<ReportBank bankData={bank} />);
        break;
      default:
        console.log('No such file');
    }
  }

  return (
    <>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>Report</Typography>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>You can export to excel file: </Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Put start and end date! </Typography>
      <Box component={'form'} onSubmit={onFormSubmit}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={3}>
            <TextField
              type="date"
              required
              id="dataStart"
              name="dataStart"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              type="date"
              required
              id="dateEnd"
              name="dateEnd"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
            />
          </Grid>
        </Grid>
        <Box>
          {user && ['director', 'admin', 'manager'].includes(user.role) && (
            <>
              <Button variant="contained" type={'submit'} sx={{ marginRight: '10px' }}
                      onClick={() => setFilename('purchase')}>
                Purchase
              </Button>
              <Button variant="contained" type={'submit'} sx={{ marginRight: '10px' }}
                      onClick={() => setFilename('product-sales')}>
                Product sales
              </Button>
            </>
          )}
          {user && ['director', 'admin', 'technologist'].includes(user.role) && (
            <Button variant="contained" type={'submit'} sx={{ marginRight: '10px' }}
                    onClick={() => setFilename('production')}>
              Production
            </Button>
          )}
          {user && ['director', 'admin', 'accountant'].includes(user.role) && (
            <>
              <Button variant="contained" type={'submit'} sx={{ marginRight: '10px' }}
                      onClick={() => setFilename('salary')}>
                Salary
              </Button>
              <Button variant="contained" type={'submit'} sx={{ marginRight: '10px' }}
                      onClick={() => setFilename('bank')}>
                Bank
              </Button>
            </>
          )}
        </Box>
      </Box>
      <Button
        variant="contained"
        onClick={handleExport}
        sx={{
          mt: 3,
          mb: 2,
          backgroundColor: 'green',
          '&:hover': {
            backgroundColor: 'darkgreen', // Цвет при наведении
          },
        }}
      >
        EXPORT TO EXCEL
      </Button>
      {table}
    </>
  );
};

export default Report;