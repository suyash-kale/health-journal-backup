import React, { FC, ReactNode, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import MaterialContainer from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MaterialAppBar from '@mui/material/AppBar';
import MaterialDrawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SettingsIcon from '@mui/icons-material/Settings';
import { Theme, CSSObject, styled } from '@mui/material/styles';

import { Reducers } from 'store/types';
import { UserStateType } from 'store/user/types';
import { APPLICATION_NAME } from 'const/app';
import { ROUTE_PUBLIC_DEFAULT, ROUTE_PRIVATE_DEFAULT } from 'const/url';
import {
  signOut as signOutAction,
  signIn as signInAction,
} from 'store/user/actions';
import { profile as profileService } from 'services/user';
import IconMerge from 'components/common/icon-merge';

export type ContainerProps = {
  title: string;
  element: ReactNode;
  authorization?: boolean;
  publicOnly?: boolean;
};

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // ...theme.mixins.toolbar,
  minHeight: '48px ',
}));

const AppBar = styled(MaterialAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Drawer = styled(MaterialDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const Container: FC<ContainerProps> = ({
  title,
  authorization = false,
  publicOnly = false,
  element,
}) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const user = useSelector<Reducers, UserStateType>(o => o.user);

  const [open, setOpen] = React.useState(true);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const signOut = useCallback(() => {
    setAnchorEl(null);
    dispatch(signOutAction());
    navigate(ROUTE_PUBLIC_DEFAULT);
  }, [dispatch, navigate]);

  useEffect(() => {
    document.title = `${title} | ${APPLICATION_NAME}`;
  }, [title]);

  useEffect(() => {
    const token = localStorage.getItem('authorization');
    // user remembered.
    if (!user && token) {
      profileService(token)
        .then(({ entity }) =>
          dispatch(signInAction({ ...entity, authorization: token }))
        )
        .catch(() => localStorage.removeItem('authorization'));
    }
    // user not logged in & authorization is true.
    else if (!user && authorization) {
      navigate(ROUTE_PUBLIC_DEFAULT);
    }
    // user logged in & publicOnly is true.
    else if (user && !authorization && publicOnly) {
      navigate(ROUTE_PRIVATE_DEFAULT);
    }
  }, [user, authorization, publicOnly, navigate, dispatch]);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position='fixed'>
        <Toolbar variant='dense'>
          {user && (
            <IconButton
              color='inherit'
              onClick={() => setOpen(b => !b)}
              edge='start'
              sx={{
                marginRight: '26px',
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
            Health Journal
          </Typography>
          {user ? (
            <>
              <IconButton
                color='inherit'
                onClick={e => setAnchorEl(e.currentTarget)}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                sx={{ mt: '35px' }}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                keepMounted
              >
                <MenuItem onClick={signOut}>Sign out</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color='inherit' onClick={() => navigate(`/sign-in`)}>
                Sign in
              </Button>
              <Button color='inherit' onClick={() => navigate(`/sign-up`)}>
                Sign up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      {user && (
        <Drawer variant='permanent' open={open}>
          <DrawerHeader />
          <Divider />
          <List>
            <ListItem
              onClick={() => navigate('/meal')}
              selected={pathname === '/meal'}
              button
            >
              <ListItemIcon>
                <RestaurantIcon />
              </ListItemIcon>
              <ListItemText primary='Meal journal' />
            </ListItem>
            <Divider />
            <ListItem
              onClick={() => navigate('/meal/category')}
              selected={pathname === '/meal/category'}
              button
            >
              <ListItemIcon>
                <IconMerge Primary={RestaurantIcon} Secondary={SettingsIcon} />
              </ListItemIcon>
              <ListItemText primary='Meal category' />
            </ListItem>
          </List>
        </Drawer>
      )}
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <MaterialContainer>
          <Grid container spacing={2} justifyContent='center'>
            {authorization && user && element}
            {!authorization && element}
          </Grid>
        </MaterialContainer>
      </Box>
    </Box>
  );
};

export default Container;
