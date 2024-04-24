import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

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
import { salaryReducer } from '../features/salary/salarySlice';
import { creditReducer } from '../features/payment/paymentSlice';
import { bankReducer } from '../features/bank/bankSlice';
import { usersReducer } from '../features/user/usersSlice';

const usersPersistConfig = {
  key: 'umut:users',
  storage: storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  users: persistReducer(usersPersistConfig, usersReducer),
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
  salary: salaryReducer,
  bank: bankReducer,
  credit: creditReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PERSIST, REHYDRATE, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
