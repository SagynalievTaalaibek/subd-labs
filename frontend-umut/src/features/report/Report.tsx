import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


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

  const exportToPDF = () => {
    const input = document.getElementById('report-container');
    if (!input) return;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('report.pdf');
    });
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

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    setDateEnd(formattedDate);
  }, []);

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
        onClick={exportToPDF}
        sx={{
          mt: 3,
          mb: 2,
          mr: 2,
          backgroundColor: 'red',
          '&:hover': {
            backgroundColor: 'darkred',
          },
        }}
      >
        EXPORT TO PDF
      </Button>
      <Box id="report-container" sx={{ padding: '15px' }}>
        {dateStart.length > 0 && dateEnd.length > 0 && (
          <Typography variant={'h4'} sx={{
            margin: '10px 0',
            fontWeight: 'bold',
          }}>{filename.toUpperCase()} Date {dateStart} - {dateEnd}</Typography>
        )}
        {table}
        {filename.length > 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Typography variant={'h5'} sx={{
                marginTop: '150px',
                fontWeight: 'bold',
              }}>{user?.position_name.toUpperCase()} </Typography>
              <Typography variant={'h5'} sx={{ marginTop: '150px', fontWeight: 'bold' }}>{user?.full_name}</Typography>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default Report;