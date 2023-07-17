import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
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
                  'margin': '0px',
                  'font-size': '1.875rem',
                  'font-weight': '300',
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
              <Skeleton width="80%" height={30} />
              <Skeleton width="80%" height={30} />
              <Skeleton width="80%" height={30} />
            </Paper>
          </Container>
        </Box>
      </main>
      <Footer/>
    </div>
  );
}

export default GenericPage;