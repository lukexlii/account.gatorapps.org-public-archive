import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './Header.css';

const Header = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLoginMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLoginMenuClose = () => {
    setAnchorEl(null);
  };

  const renderLoginMenuItems = () => {
    return props.loginMenuItems?.map((item) => {
      if (item.action) return <MenuItem onClick={item.action}>{item.name}</MenuItem>;
      return <MenuItem disabled>{item.name}</MenuItem>
    })
  }

  return (
    <Fragment>
      <AppBar position="fixed" elevation="0">
        <Toolbar disableGutters sx={
          {
            'background-color': 'rgb(40, 87, 151)',
            'color': 'rgb(255, 255, 255)',
            'border-bottom': '4px solid rgb(224, 129, 46)',
            'height': '64px'
          }
        }>
          {(!props.loading && props.loggedIn) && (
            <Box aria-label="Menu" sx={{ display: 'inline-block', height: '100%' }}>
              <IconButton className={"Header__button"} size="medium" color="inherit" aria-label="menu" sx={{ 'min-width': '60px' }}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}

          <IconButton className={"Header__button"} size="medium" color="inherit" aria-label="menu" sx={{ 'min-width': '60px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43.5 29.4" height="32" width="32" alt="U F Logo"><g fill="#FFF"><path d="M31.1 24.2v-7.5h6.8v-4.9h-6.8V4.9h7.5v2.7h4.9V0H23.7v4.9h1.8v19.3h-1.8v4.9h9.1v-4.9h-1.7zM21.1 18.1V4.9h1.8V0h-9.2v4.9h1.8v11.6c0 4.9-.6 7.2-4 7.2s-4-2.3-4-7.2V4.9h1.8V0H0v4.9h1.8v13.2c0 2.9 0 5.3 1.4 7.4 1.5 2.4 4.3 3.9 8.3 3.9 7.1 0 9.6-3.7 9.6-11.3z"></path></g></svg>
          </IconButton>
          
          <Typography variant="h5" component="div" paddingLeft="10px" sx={{ flexGrow: 1 }}>
            <Typography variant="inherent" component="a" href="/" sx={
              {
                'color': 'white',
                'text-decoration': 'none',
                ':hover': {
                  'text-decoration': 'underline',
                  'transition': 'all 0.3s ease 0s'
                }
              }
            }>
              ACCOUNT.UF
            </Typography>
          </Typography>

          {(!props.loading && !props.loggedIn) && (
            <Box aria-label="Menu" marginX="8px" sx={{ display: 'inline-block', height: '100%' }}>
              <IconButton className={"Header__button"} size="medium" color="inherit" aria-label="menu" onClick={handleLoginMenuOpen} sx={{ 'width': '88px', 'padding': '6px' }}>
                <span>Log in</span>
                <ArrowDropDownIcon />
              </IconButton>
              <Menu
                  id="menu-header-login"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleLoginMenuClose}
                >
                  {renderLoginMenuItems()}
              </Menu>
            </Box>
          )}
          
          {(!props.loading && props.loggedIn) && (
            <Box aria-label="Menu" marginX="8px" sx={{ display: 'inline-block', height: '100%' }}>
              <IconButton className={"Header__button"} size="medium" paddingX="8px" color="inherit" aria-label="menu" onClick={null} sx={{ 'min-width': '60px' }}>
                <AccountCircleIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar></Toolbar>
    </Fragment>
  );
};

export default Header;