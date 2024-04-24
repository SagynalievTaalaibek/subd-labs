import { Container, CssBaseline } from '@mui/material';
import { Route, Routes, useNavigate } from 'react-router-dom';

import AppToolbar from './components/UI/AppToolbar/AppToolbar';
import Positions from './features/positions/Positions';
import NewPositions from './features/positions/NewPositions';
import EditPositions from './features/positions/EditPositions';
import Employee from './features/employees/Employee';
import NewEmployee from './features/employees/NewEmployee';
import EditEmployee from './features/employees/EditEmployee';
import Units from './features/units/Units';
import NewUnits from './features/units/NewUnits';
import EditUnits from './features/units/EditUnits';
import Products from './features/products/Products';
import NewProduct from './features/products/NewProduct';
import EditProduct from './features/products/EditProduct';
import Materials from './features/materials/Materials';
import NewMaterials from './features/materials/NewMaterials';
import EditMaterials from './features/materials/EditMaterials';
import Ingredients from './features/ingredients/Ingredients';
import NewIngredients from './features/ingredients/NewIngredients';
import EditIngredient from './features/ingredients/EditIngredient';
import Budget from './features/budget/Budget';
import EditBudget from './features/budget/EditBudget';
import RawMaterialPurchase from './features/rawMaterialPurchase/RawMaterialPurchase';
import NewRawMaterialPurchase from './features/rawMaterialPurchase/NewRawMaterialPurchase';
import ProductSales from './features/productSales/ProductSales';
import NewProductSales from './features/productSales/NewProductSales';
import NotFound from './components/NotFound';
import Production from './features/production/Production';
import NewProduction from './features/production/NewProduction';
import Salary from './features/salary/Salary';
import EditSalary from './features/salary/EditSalary';
import Bank from './features/bank/Bank';
import NewCredit from './features/bank/NewCredit';
import PaymentItem from './features/payment/PaymentItem';
import PaymentList from './features/payment/PaymentList';
import Login from './features/user/Login';
import { useAppSelector } from './app/hooks';
import { selectUser } from './features/user/usersSlice';
import { useEffect } from 'react';
import Home from './features/home/Home';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const App = () => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <>
      <CssBaseline />
      <AppToolbar />
      <main style={{ marginTop: '10px' }}>
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/positions"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'director'].includes(user.role.toLocaleLowerCase())}>
                  <Positions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/positions/create"
              element={
                <ProtectedRoute
                  isAllowed={user && user.role.toLocaleLowerCase() === 'admin'}>
                  <NewPositions />
                </ProtectedRoute>
              }
            />
            <Route path="/positions/update/:id" element={<EditPositions />} />
            <Route
              path="/employees"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'director'].includes(user.role.toLocaleLowerCase())}>
                  <Employee />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/create"
              element={
                <ProtectedRoute
                  isAllowed={user && user.role.toLocaleLowerCase() === 'admin'}>
                  <NewEmployee />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/update/:id"
              element={
                <ProtectedRoute
                  isAllowed={user && user.role.toLocaleLowerCase() === 'admin'}>
                  <EditEmployee />
                </ProtectedRoute>
              }
            />

            <Route
              path="/units"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'director'].includes(user.role.toLocaleLowerCase())}>
                  <Units />
                </ProtectedRoute>
              }
            />
            <Route
              path="/units/create"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'director'].includes(user.role.toLocaleLowerCase())}>
                  <NewUnits />
                </ProtectedRoute>
              }
            />
            <Route
              path="/units/update/:id"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'director'].includes(user.role.toLocaleLowerCase())}>
                  <EditUnits />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'director', 'manager'].includes(user.role.toLocaleLowerCase())}>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/create"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'manager'].includes(user.role.toLocaleLowerCase())}>
                  <NewProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/update/:id"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'manager'].includes(user.role.toLocaleLowerCase())}>
                  <EditProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/materials"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'director', 'manager', 'technologist'].includes(user.role.toLocaleLowerCase())}>
                  <Materials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/materials/create"
              element={
                <ProtectedRoute isAllowed={user && ['admin',  'manager', 'technologist'].includes(user.role.toLocaleLowerCase())}>
                  <NewMaterials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/materials/update/:id"
              element={
                <ProtectedRoute isAllowed={user && ['admin',  'manager', 'technologist'].includes(user.role.toLocaleLowerCase())}>
                  <EditMaterials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ingredients"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'director', 'technologist'].includes(user.role.toLocaleLowerCase())}>
                  <Ingredients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ingredients/create"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'technologist'].includes(user.role.toLocaleLowerCase())}>
                  <NewIngredients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ingredients/update/:id"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'technologist'].includes(user.role.toLocaleLowerCase())}>
                  <EditIngredient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/budget"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'director', 'accountant'].includes(user.role.toLocaleLowerCase())}>
                  <Budget />
                </ProtectedRoute>
              }
            />
            <Route
              path="/budget/update/:id"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'accountant'].includes(user.role.toLocaleLowerCase())}>
                  <EditBudget />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchase"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'director', 'manager'].includes(user.role.toLocaleLowerCase())}>
                  <RawMaterialPurchase />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchase/create"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'manager'].includes(user.role.toLocaleLowerCase())}>
                  <NewRawMaterialPurchase />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-sales"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'director', 'manager'].includes(user.role.toLocaleLowerCase())}>
                  <ProductSales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-sales/create"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'manager'].includes(user.role.toLocaleLowerCase())}>
                  <NewProductSales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/production"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'director', 'technologist'].includes(user.role.toLocaleLowerCase())}>
                  <Production />
                </ProtectedRoute>
              }
            />
            <Route
              path="/production/create"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'technologist'].includes(user.role.toLocaleLowerCase())}>
                  <NewProduction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/salary"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'accountant'].includes(user.role.toLocaleLowerCase())}>
                  <Salary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/salary/update/:id"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'accountant'].includes(user.role.toLocaleLowerCase())}>
                  <EditSalary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bank"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'director', 'accountant'].includes(user.role.toLocaleLowerCase())}>
                  <Bank />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bank/pay/:id"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'accountant'].includes(user.role.toLocaleLowerCase())}>
                  <PaymentItem />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bank/history/:id"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'accountant', 'director'].includes(user.role.toLocaleLowerCase())}>
                  <PaymentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bank/create"
              element={
                <ProtectedRoute isAllowed={user && ['admin', 'accountant'].includes(user.role.toLocaleLowerCase())}>
                  <NewCredit />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </main>
    </>
  );
};

export default App;
