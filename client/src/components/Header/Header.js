import { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUserInfo } from '../../context/authSlice';
import { AppBar, Avatar, Box, Collapse, Divider, Drawer, List, ListItemButton, ListSubheader, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Logout from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Settings from '@mui/icons-material/Settings';
import { axiosIdP } from '../../apis/backend';
import useFetchData from '../../hooks/useFetchData';
import { UFLoginViaGoogle } from '../Auth/AuthFunctions';
import Alert from '../../components/Alert/Alert';
import SkeletonGroup from '../../components/SkeletonGroup/SkeletonGroup';
import './Header.css';

const Header = ({ SignInMenuItems, loading, signedIn }) => {
  // Global context
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();

  const isSignedIn = signedIn || (signedIn === undefined && userInfo?.roles.includes(100001));

  const navigate = useNavigate();

  // Dorpdown menus
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDorpdownMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDorpdownMenuClose = () => {
    setAnchorEl(null);
  };

  // Sign in dropdown menu
  const defaultSignInMenuItems = [
    { name: "Students, Faculty & Staff" },
    { name: "Sign in with GatorLink", 'action': UFLoginViaGoogle },
    { name: "Alumni & Friends" },
    { name: "Coming soon...", 'action': () => window.alert("Coming soon...") }
  ];
  const renderSignInMenuItems = () => {
    const menuItems = SignInMenuItems ? SignInMenuItems : defaultSignInMenuItems;
    return menuItems.map((item) => {
      if (item.action) return <MenuItem onClick={item.action}>{item.name}</MenuItem>;
      return <MenuItem disabled>{item.name}</MenuItem>
    })
  }

  // User profile dropdown menu
  // Determines name to be displayed
  const userDisplayName = userInfo?.nickname
    ? userInfo?.nickname
    : userInfo?.firstName && userInfo?.lastName
      ? `${userInfo?.firstName} ${userInfo?.lastName}`
      : userInfo?.firstName
        ? userInfo?.firstName
        : userInfo?.lastName
          ? userInfo?.lastName
          : 'GatorApps User';

  // onClick account settings button
  const handleAccountSettings = () => {
    window.open("/", "_self");
    /*
      // For apps other than account:
      axiosIdP
        .get('/userAuth/getAccountSettingsUrl')
        .then((response) => {
          window.open(response?.data?.redirectUrl, "_blank");
        })
        .catch((error) => {
          console.log(error);
        });
    */
  };

  // onClick sign out button
  const handleSignOut = () => {
    axiosIdP
      .post('/userAuth/signOut', {}, {
        withCredentials: true
      })
      .then((response) => {
        //dispatch(setUserInfo(null));
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Drawers
  const [openDrawer, setOpenDrawer] = useState({
    leftMenu: false
  });

  const toggleDrawer = (drawerName, open) => (event) => {
    // Stop propagation drawers only close if clicking on app bar only and not any buttons
    event.stopPropagation();

    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    if (open === undefined) {
      setOpenDrawer({ ...openDrawer, [drawerName]: !openDrawer[drawerName] });
    } else {
      setOpenDrawer({ ...openDrawer, [drawerName]: open });
    }
  };

  // Left menu drawer
  // Initialize menu content
  const { data: leftMenuData, loading: leftMenuLoading, alert: leftMenuAlert } = useFetchData('/renderClient/getLeftMenuItems', { title: "menu items", retryButton: true });
  // Handle nested list expand and collapse
  const [leftMenuExpanded, setLeftMenuExpanded] = useState({});
  const handleleftMenuClick = (sectionIndex, itemIndex) => {
    const key = `${sectionIndex}-${itemIndex}`;
    setLeftMenuExpanded({
      ...leftMenuExpanded,
      [key]: !leftMenuExpanded[key],
    });
  };

  return (
    <Fragment>
      <AppBar position="fixed" elevation="0" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar className='Header__toolbar' disableGutters onClick={toggleDrawer("leftMenu", false)} sx={
          {
            'background-color': 'rgb(40, 87, 151)',
            'color': 'rgb(255, 255, 255)',
            'border-bottom': '4px solid rgb(224, 129, 46)',
            'height': '56px'
          }
        }>
          {(!loading && isSignedIn) && (
            <Fragment>
              <Tooltip title="Menu">
                <Box aria-label="Menu" sx={{ display: 'inline-block', height: '100%' }}>
                  <IconButton className={"Header__button"} size="medium" color="inherit" aria-label="menu" onClick={toggleDrawer("leftMenu")} sx={{ 'min-width': '60px' }}>
                    <MenuIcon />
                  </IconButton>
                </Box>
              </Tooltip>
            </Fragment>
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
              GatorApps
            </Typography>
          </Typography>

          {/* Sign in dropdown menu */}
          {(!loading && !isSignedIn) && (
            <Box aria-label="Sign in Menu" marginX="8px" sx={{ display: 'inline-block', height: '100%' }}>
              <IconButton className={"Header__button"} size="medium" color="inherit" aria-label="menu" onClick={handleDorpdownMenuOpen} sx={{ 'width': '96px', 'padding': '6px' }}>
                <span>Sign in</span>
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
                onClose={handleDorpdownMenuClose}
              >
                {renderSignInMenuItems()}
              </Menu>
            </Box>
          )}

          {/* Account dropdown menu */}
          {(!loading && isSignedIn) && (
            <Fragment>
              <Tooltip title="Account">
                <Box aria-label="Account Menu" marginX="8px" sx={{ display: 'inline-block', height: '100%' }}>
                  <IconButton className={"Header__button"} size="medium" paddingX="8px" color="inherit" aria-label="menu" onClick={handleDorpdownMenuOpen} sx={{ 'min-width': '60px' }}>
                    <AccountCircleIcon />
                  </IconButton>
                </Box>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={Boolean(anchorEl)}
                onClose={handleDorpdownMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    width: '230px',
                    borderRadius: '8px',
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 16,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                      width: 12,
                      height: 12
                    },
                    'background-color': 'rgb(255, 253.98, 252.96)'
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem disabled>
                  <Avatar>{userDisplayName.toUpperCase()[0]}</Avatar>
                  <Typography noWrap>{userDisplayName}</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleAccountSettings}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Account Settings
                </MenuItem>
                <MenuItem onClick={handleSignOut}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Sign Out
                </MenuItem>
              </Menu>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>

      {/* Left menu drawer */}
      <Drawer
        anchor="left"
        open={openDrawer["leftMenu"]}
        onClose={toggleDrawer("leftMenu", false)}
        sx={{ [`& .MuiDrawer-paper`]: { width: '319px', 'overflow-x': 'hidden', border: '1px solid rgba(0, 0, 0, 0.12)', 'background-color': 'rgb(250, 249, 248)' } }}
      >
        <Toolbar sx={{ 'margin-bottom': '18px' }} />
        {leftMenuLoading ? (
          <Box>
            <SkeletonGroup />
            <SkeletonGroup />
            <SkeletonGroup />
          </Box>
        ) : (leftMenuAlert || !leftMenuData?.leftMenuItems) ? (
          <Box sx={{ margin: '12px' }}>
            <Alert data={leftMenuAlert || undefined} style={{ titleFontSize: '16px', textFontSize: '14px' }} />
          </Box>
        ) : (
          <Box>
            {JSON.parse(leftMenuData.leftMenuItems).map((section, sectionIndex) => {
              if (section.length <= 0) return;
              return (
                <List
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader component="div" id="nested-list-subheader" sx={{ 'background-color': 'transparent', padding: '4px 0px 12px 24px' }}>
                      <Typography variant="h3" sx={{ color: 'rgb(191, 68, 24)', 'font-size': '0.938rem', 'font-weight': '700', 'letter-spacing': '0.047rem', 'line-height': '1.25rem' }}>
                        {section.heading}
                      </Typography>
                    </ListSubheader>
                  }
                  sx={{ 'padding-bottom': '30px' }}
                >
                  {section.items.map((item, itemIndex) => {
                    // Item with route
                    if (item.route) return (
                      <ListItemButton href={item.route} target={item.newTab ? '_blank' : '_self'} sx={{ padding: '12px 24px' }}>
                        <ListItemText primary={item.label} sx={{ margin: '0px 30px 0px 0px', 'max-width': '78%', [`& .MuiListItemText-primary`]: { 'font-size': '0.9375rem', 'color': 'rgb(88, 94, 94)' } }} />
                        {item.newTab && <OpenInNewIcon sx={{ color: 'rgb(88, 94, 94)', 'font-size': '14px', 'line-height': '14px', ml: '5px' }} />}
                      </ListItemButton>
                    );
                    // Expandable item with subitems
                    if (item.subItems) return (
                      <Fragment>
                        <ListItemButton onClick={() => { handleleftMenuClick(sectionIndex, itemIndex) }} sx={{ padding: '12px 24px' }}>
                          <ListItemText primary={item.label} sx={{ margin: '0px 30px 0px 0px', 'max-width': '78%', [`& .MuiListItemText-primary`]: { 'font-size': '0.9375rem', 'color': 'rgb(88, 94, 94)' } }} />
                          {leftMenuExpanded[`${sectionIndex}-${itemIndex}`] ? <ExpandLess sx={{ color: 'rgb(179, 182, 182)' }} /> : <ExpandMore sx={{ color: 'rgb(179, 182, 182)' }} />}
                        </ListItemButton>
                        <Collapse in={leftMenuExpanded[`${sectionIndex}-${itemIndex}`]} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            {item.subItems.map((subItem) => {
                              return (
                                <ListItemButton href={subItem.route} target={subItem.newTab ? '_blank' : '_self'} sx={{ padding: '12px 24px 12px 40px' }}>
                                  <ListItemText primary={subItem.label} sx={{ margin: '0px 30px 0px 0px', 'max-width': '78%', [`& .MuiListItemText-primary`]: { 'font-size': '0.9375rem', 'color': 'rgb(88, 94, 94)' } }} />
                                  {subItem.newTab && <OpenInNewIcon sx={{ color: 'rgb(88, 94, 94)', 'font-size': '14px', 'line-height': '14px', ml: '1.5px' }} />}
                                </ListItemButton>
                              )
                            })}
                          </List>
                        </Collapse>
                      </Fragment>
                    );
                    return;
                  })}
                </List>
              );
            })}
          </Box>
        )}
      </Drawer>

      {/* Space holder so pages don't have to each add spaces at top to avoid bar overlap */}
      <Toolbar></Toolbar>
    </Fragment >
  );
};

export default Header;