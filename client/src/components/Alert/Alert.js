import { Alert as MUIAlert, AlertTitle, Box, Button, Typography } from '@mui/material';
import './Alert.css'

const Alert = ({ alertData }) => {
  return (
    <Box className='Alert'>
      <MUIAlert severity={alertData?.severity || "error"} action={
        <Box sx={{ marginRight: '12px' }}>
          {alertData?.actions?.map((action) => {
            return <Button color="inherit" variant="outlined" size="small" onClick={action.onClick} sx={{ margin: '6px' }}>{action.name}</Button>
          })}
        </Box>
      } sx={{ padding: '16px' }}><AlertTitle sx={{ fontSize: '18px' }}>{alertData?.title || "Error"}</AlertTitle><Typography sx={{ fontSize: '16px' }}>{alertData?.message || "Unknown error"}</Typography></MUIAlert>
    </Box>
  )
};

export default Alert;