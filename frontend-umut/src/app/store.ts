import { configureStore } from '@reduxjs/toolkit';
import { positionsReducer } from '../features/positions/positionsSlice';
import { employeesReducer } from '../features/employees/employeeSlice';
import { unitsReducer } from '../features/units/unitSlice';
import { productsReducer } from '../features/products/productsSlice';
import { materialReducer } from '../features/materials/materialSlice';
import { ingredientReducer } from '../features/ingredients/ingredientSlice';
import { budgetReducer } from '../features/budget/budgetSlice';
import { rawMaterialPurchaseReducer } from '../features/rawMaterialPurchase/purchaseSlice';
import { productSalesReducer } from '../features/productSales/productSalesSlice';
import { productionReducer } from '../features/production/productionSlice';

export const store = configureStore({
  reducer: {
    positions: positionsReducer,
    employees: employeesReducer,
    units: unitsReducer,
    products: productsReducer,
    materials: materialReducer,
    ingredients: ingredientReducer,
    budgets: budgetReducer,
    rawMaterialPurchase: rawMaterialPurchaseReducer,
    productSales: productSalesReducer,
    production: productionReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;