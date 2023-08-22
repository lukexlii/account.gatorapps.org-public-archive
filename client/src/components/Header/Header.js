import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Drawer from '@mui/material/Drawer';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/Button';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import useAuth from '../../hooks/useAuth';
import { UFLoginViaGoogle } from '../Auth/AuthFunctions';
import './Header.css';

const Header = (props) => {
  const { auth } = useAuth();

  // Login dorpdown menu
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLoginMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLoginMenuClose = () => {
    setAnchorEl(null);
  };

  const defaultLoginMenuItems = [
    { name: "Students, Faculty & Staff" },
    { name: "Sign in with GatorLink", 'action': UFLoginViaGoogle },
    { name: "Alumni & Friends" },
    { name: "Coming soon...", 'action': () => window.alert("Coming soon...") }
  ];

  const renderLoginMenuItems = () => {
    const menuItems = props.loginMenuItems ? props.loginMenuItems : defaultLoginMenuItems;
    return menuItems.map((item) => {
      if (item.action) return <MenuItem onClick={item.action}>{item.name}</MenuItem>;
      return <MenuItem disabled>{item.name}</MenuItem>
    })
  }

  // Drawers
  const [openDrawer, setOpenDrawer] = useState({
    menu: false,
    profile: false,
  });

  const toggleDrawer = (drawerName, open) => (event) => {
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
  // Menu content
  const leftMenuItems = [
    {
      heading: 'Heading 1',
      items: [
        { label: 'Item 1', route: '/1_1' },
        { label: 'Item 2', route: '/1_2' },
        {
          label: 'Item 3 (Expandable)', subItems: [
            { label: 'Subitem 1', route: '/1_3_s1' },
            { label: 'Subitem 2', route: '/1_3_s2', newTab: true },
            { label: 'Subitem 3', route: '/1_3_s3' },
          ]
        },
        { label: 'Item 4 (Opens in new tab)', route: '/1_4', newTab: true },
        {
          label: 'Item 5 (Expandable)', subItems: [
            { label: 'Subitem 1', route: '/1_5_s1' },
            { label: 'Subitem 2', route: '/1_5_s2' }
          ]
        },
        { label: 'Item 6', route: '/1_6' },
      ]
    },
    {
      heading: 'Heading 2',
      items: [
        { label: 'Item 1 (Opens in new tab)', route: '/2_1', newTab: true },
        { label: 'Item 2', route: '/2_2' },
        {
          label: 'Item 3 (Expandable)', subItems: [
            { label: 'Subitem 1', route: '/2_3_s1' },
            { label: 'Subitem 2', route: '/2_3_s2', newTab: true },
            { label: 'Subitem 2', route: '/2_3_s3' }
          ]
        },
        { label: 'Item 4', route: '/2_4' },
      ]
    },
    {
      heading: 'Heading 3',
      items: [
        { label: 'Item 1', route: '/3_1' },
        { label: 'Item 2 (Opens in new tab)', route: '/3_2', newTab: true },
        {
          label: 'Item 3 (Expandable)', subItems: [
            { label: 'Subitem 1', route: '/3_3_s1' },
            { label: 'Subitem 2', route: '/3_3_s2', newTab: true },
            { label: 'Subitem 2', route: '/3_3_s3' }
          ]
        },
        { label: 'Item 4', route: '/3_4' },
      ]
    }
  ];
  // Handle nested list expand and collapse
  const [leftMenuExpanded, setLeftMenuExpanded] = useState({});
  const handleleftMenuClick = (sectionIndex, itemIndex) => {
    const key = `${sectionIndex}-${itemIndex}`;
    setLeftMenuExpanded({
      ...leftMenuExpanded,
      [key]: !leftMenuExpanded[key],
    });
  };
  // Item styles


  // Example, to be removed
  const [menu_expandExample, menu_setExpandExample] = useState(false);
  const menu_handleExampleClick = () => {
    menu_setExpandExample(!menu_expandExample);
  };

  return (
    <Fragment>
      <AppBar position="fixed" elevation="0" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar className='Header__toolbar' disableGutters sx={
          {
            'background-color': 'rgb(40, 87, 151)',
            'color': 'rgb(255, 255, 255)',
            'border-bottom': '4px solid rgb(224, 129, 46)',
            'height': '56px'
          }
        }>
          {(!props.loading && (props.loggedIn || (props.loggedIn === undefined && auth?.accessToken))) && (
            <Fragment>
              <Tooltip title="Menu">
                <Box aria-label="Menu" sx={{ display: 'inline-block', height: '100%' }}>
                  <IconButton className={"Header__button"} size="medium" color="inherit" aria-label="menu" onClick={toggleDrawer("menu")} sx={{ 'min-width': '60px' }}>
                    <MenuIcon />
                  </IconButton>
                </Box>
              </Tooltip>
              <Drawer
                anchor="left"
                open={openDrawer["menu"]}
                onClose={toggleDrawer("menu", false)}
                sx={{ [`& .MuiDrawer-paper`]: { width: '319px', 'overflow-x': 'hidden', border: '1px solid rgba(0, 0, 0, 0.12)', 'background-color': 'rgb(250, 249, 248)' } }}
              >
                <Toolbar sx={{ 'margin-bottom': '18px' }} />
                <div>
                  {leftMenuItems.map((section, sectionIndex) => {
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
                </div>
              </Drawer>
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

          {(!props.loading && (props.loggedIn === false || (props.loggedIn === undefined && !auth?.accessToken))) && (
            <Box aria-label="Menu" marginX="8px" sx={{ display: 'inline-block', height: '100%' }}>
              <IconButton className={"Header__button"} size="medium" color="inherit" aria-label="menu" onClick={handleLoginMenuOpen} sx={{ 'width': '96px', 'padding': '6px' }}>
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
                onClose={handleLoginMenuClose}
              >
                {renderLoginMenuItems()}
              </Menu>
            </Box>
          )}

          {(!props.loading && (props.loggedIn || (props.loggedIn === undefined && auth?.accessToken))) && (
            <Tooltip title="Profile">
              <Box aria-label="Menu" marginX="8px" sx={{ display: 'inline-block', height: '100%' }}>
                <IconButton className={"Header__button"} size="medium" paddingX="8px" color="inherit" aria-label="menu" onClick={null} sx={{ 'min-width': '60px' }}>
                  <AccountCircleIcon />
                </IconButton>
              </Box>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar></Toolbar>
    </Fragment >
  );
};

export default Header;