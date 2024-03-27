import { Container, CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

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

const App = () => {
  return (
    <>
      <CssBaseline />
      <AppToolbar />
      <main style={{ marginTop: '10px' }}>
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={<Positions />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/positions/create" element={<NewPositions />} />
            <Route path="/positions/update/:id" element={<EditPositions />} />
            <Route path="/employees" element={<Employee />} />
            <Route path="/employees/create" element={<NewEmployee />} />
            <Route path="/employees/update/:id" element={<EditEmployee />} />
            <Route path="/units" element={<Units />} />
            <Route path="/units/create" element={<NewUnits />} />
            <Route path="/units/update/:id" element={<EditUnits />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/create" element={<NewProduct />} />
            <Route path="/products/update/:id" element={<EditProduct />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/materials/create" element={<NewMaterials />} />
            <Route path="/materials/update/:id" element={<EditMaterials />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/ingredients/create" element={<NewIngredients />} />
            <Route
              path="/ingredients/update/:id"
              element={<EditIngredient />}
            />
            <Route path="/budget" element={<Budget />} />
            <Route path="/budget/update/:id" element={<EditBudget />} />
            <Route path="/purchase" element={<RawMaterialPurchase />} />
            <Route
              path="/purchase/create"
              element={<NewRawMaterialPurchase />}
            />
            <Route path="/product-sales" element={<ProductSales />} />
            <Route path="/product-sales/create" element={<NewProductSales />} />
            <Route path="/production" element={<Production />} />
            <Route path="/production/create" element={<NewProduction />} />
            <Route path="/salary" element={<Salary />} />
            <Route path="/salary/update/:id" element={<EditSalary />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </main>
    </>
  );
};

export default App;
