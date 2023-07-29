import { Alert as MUIAlert, AlertTitle, Box, Button, Typography } from '@mui/material';
import './Alert.css'

const Alert = ({ severity, error }) => {
  return (
    <Box className='Alert'>
      <MUIAlert severity={severity} action={
        <Box sx={{ marginRight: '12px' }}>
          {error.actions.map((action) => {
            return <Button color="inherit" variant="outlined" size="small" onClick={action.onClick} sx={{ margin: '6px' }}>{action.name}</Button>
          })}
        </Box>
      } sx={{ padding: '16px' }}><AlertTitle sx={{ fontSize: '18px' }}>{error.title}</AlertTitle><Typography sx={{ fontSize: '16px' }}>{error.message}</Typography></MUIAlert>
    </Box>
  )
};

export default Alert;