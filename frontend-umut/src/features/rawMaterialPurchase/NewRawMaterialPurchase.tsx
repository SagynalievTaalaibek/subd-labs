import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectMaterials } from '../materials/materialSlice';
import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { selectEmployees } from '../employees/employeeSlice';
import { selectCreateRawMaterialsPurchaseLoading } from './purchaseSlice';
import RawMaterialPurchaseForm from './components/RawMaterialPurchaseForm';
import { addAmountQuantityMaterial, fetchMaterials } from '../materials/materialThunks';
import { fetchEmployees } from '../employees/employeeThunks';
import { createRawMaterialsPurchase } from './purchaseThunks';
import { fetchBudget, minusSumBudget } from '../budget/budgetThunks';
import { BUDGET_ID } from '../../constants';
import { Grid } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { selectBudget } from '../budget/budgetSlice';
import { RawMaterialPurchaseMutation } from '../../types';

const NewRawMaterialPurchase = () => {
    const navigate = useNavigate();
    const budgetData = useAppSelector(selectBudget);
    const dispatch = useAppDispatch();
    const materialsData = useAppSelector(selectMaterials);
    const employeeData = useAppSelector(selectEmployees);
    const createLoading = useAppSelector(selectCreateRawMaterialsPurchaseLoading);

    useEffect(() => {
      const fetchData = async () => {
        await dispatch(fetchMaterials());
        await dispatch(fetchEmployees());
        await dispatch(fetchBudget());
      };

      void fetchData();
    }, [dispatch]);

    const onSubmit = async (purchase: RawMaterialPurchaseMutation) => {
      const index = materialsData.findIndex(value => value.id === purchase.raw_material_id);
      let currentMaterial = null;

      if (index !== -1) {
        currentMaterial = materialsData[index];
      }

      if (currentMaterial) {
        await dispatch(addAmountQuantityMaterial({
          id: purchase.raw_material_id,
          amount: purchase.amount,
          quantity: purchase.quantity,
        }));
      }

      await dispatch(minusSumBudget({
        id: BUDGET_ID,
        budget_amount: purchase.amount,
      }));

      await dispatch(createRawMaterialsPurchase(purchase));

      navigate('/purchase');
    };

    return (
      <>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h4" sx={{margin: '10px 0', fontWeight: 'bold'}}>Create New Purchase</Typography>
          </Grid>
          <Grid item xs={6} sx={{display: 'flex', alignItems: 'center'}}>
            <AccountBalanceWalletIcon sx={{fontSize: '35px', marginRight: '5px'}}/>
            <Typography variant="h5" component="div">{budgetData && budgetData.budget_amount} KG</Typography>
          </Grid>
        </Grid>
        <RawMaterialPurchaseForm
          raw_material={materialsData}
          employees={employeeData}
          onSubmit={onSubmit}
          isLoading={createLoading}
        />
      </>
    );
  }
;

export default NewRawMaterialPurchase;