import Typography from '@mui/material/Typography';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../user/usersSlice';
import Box from '@mui/material/Box';

const Home = () => {
  const user = useAppSelector(selectUser);

  return (
    <>
      <Box sx={{textAlign: 'center', mt: 5}}>
        <Typography variant="h2" sx={{fontWeight: 'bold'}}>Welcome back! {user?.full_name}</Typography>
        <Typography variant="h5" sx={{fontWeight: 'bold'}} component={'div'}>Your role is: <span style={{color: 'red', fontSize: '34px'}}>{user?.role}</span></Typography>
      </Box>
    </>
  );
};

export default Home;