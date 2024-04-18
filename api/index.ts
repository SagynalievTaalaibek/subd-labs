import express from 'express';
import cors from 'cors';

import positionRouter from './routes/positionRouter';
import employeeRouter from './routes/employeeRouter';
import unitsOfMeasureRouter from './routes/unitsOfMeasureRouter';
import finishedProductRouter from './routes/finishedProductsRouter';
import rawMaterialsRouter from './routes/rawMaterialsRouter';
import ingredientsRouter from './routes/ingredientsRouter';
import budgetRouter from './routes/budgetRouter';
import rawMaterialsPurchaseRouter from './routes/rawMaterialsPurchaseRouter';
import productSalesRouter from './routes/productSalesRouter';
import productionRouter from './routes/productionRouter';
import salaryRouter from './routes/salaryRouter';
import bankRouter from './routes/bankRouter';

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.use('/api', positionRouter);
app.use('/api', employeeRouter);
app.use('/api', unitsOfMeasureRouter);
app.use('/api', finishedProductRouter);
app.use('/api', rawMaterialsRouter);
app.use('/api', ingredientsRouter);
app.use('/api', budgetRouter);
app.use('/api', rawMaterialsPurchaseRouter);
app.use('/api', productSalesRouter);
app.use('/api', productionRouter);
app.use('/api', salaryRouter);
app.use('/api', bankRouter);

app.listen(port, () => {
  console.log(`Server start on ${port} port!`);
});
