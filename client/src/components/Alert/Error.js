import { Alert, AlertTitle, Box, Button, Container, Typography } from '@mui/material';
import './Error.css'

const Error = ({ error, marginTop = '0px' }) => {
  return (
    <Box>
      <Container maxWidth="lg" sx={{ marginTop: marginTop }}>
        <Alert severity="error" action={
          <Box sx={{ marginRight: '12px' }}>
            {error.actions.map((action) => {
              return <Button color="inherit" variant="outlined" size="small" onClick={action.onClick} sx={{ margin: '6px' }}>{action.name}</Button>
            })}
          </Box>
        } sx={{ padding: '16px' }}><AlertTitle sx={{ fontSize: '18px' }}>{error.title}</AlertTitle><Typography sx={{ fontSize: '16px' }}>{error.message}</Typography></Alert>
      </Container>
    </Box>
  )
};

export default Error;