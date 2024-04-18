import Typography from '@mui/material/Typography';
import BankForm from './components/BankForm';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectBankCreating } from './bankSlice';
import { createNewCredit } from './bankThunks';
import { BankMutation } from '../../types';
import { useNavigate } from 'react-router-dom';

const NewCredit = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const createCreditLoading = useAppSelector(selectBankCreating);

  const onCreateNewCredit = async (bank: BankMutation) => {
    await dispatch(createNewCredit(bank))
    navigate('/bank');
  };

  return (
    <>
      <Typography variant="h4" sx={{ margin: '10px 0', fontWeight: 'bold' }}>Create Raw Material</Typography>
      <BankForm onBankSubmit={onCreateNewCredit} isLoading={createCreditLoading} />
    </>
  );
};

export default NewCredit;