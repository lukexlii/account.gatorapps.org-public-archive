import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SkeletonGroup from '../../components/SkeletonGroup/SkeletonGroup';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useAuth from '../../hooks/useAuth';

const GenericPage = () => {
  const { auth } = useAuth();

  return (
    <div className='Student'>
      <Header loggedIn={auth?.accessToken}/>
      <main>
        <Box>
          <Container maxWidth="lg">
            <Box marginY="24px">
              <Typography variant="h1" sx={
                {
                  'font-size': '1.875rem'
                }
              }>Page Title</Typography>
            </Box>
          </Container>
          <Container maxWidth="lg">
            <Paper variant='outlined' sx={
              {
                'min-height': '75vh',
                'text-align': 'center'
              }
            }>
              <SkeletonGroup/>
              <SkeletonGroup/>
              <SkeletonGroup/>
            </Paper>
          </Container>
        </Box>
      </main>
      <Footer/>
    </div>
  );
}

export default GenericPage;