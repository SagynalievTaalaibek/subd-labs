import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Icecream, Logout } from '@mui/icons-material';
import { styled } from '@mui/material';
import { pages } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/user/usersSlice';
import { logout } from '../../../features/user/usersThunks';

const Link = styled(NavLink)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit',
  },
});

const ResponsiveAppBar = () => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        {user && (
          <Toolbar>
            <Icecream
              sx={{
                display: { xs: 'none', md: 'none', lg: 'flex' },
                mr: 1,
                fontSize: '30px',
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'none', lg: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              UMUT
            </Typography>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'flex', md: 'flex', lg: 'none' },
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'block', lg: 'none' },
                }}
              >
                {pages.map((page) => {
                  if (page.allowed.includes(user.role.toLocaleLowerCase())) {
                    return (
                      <MenuItem key={page.id} onClick={handleCloseNavMenu}>
                        <Typography
                          textAlign="center"
                          component={Link}
                          to={`/${page.name.toLocaleLowerCase()}`}
                          sx={{ textDecoration: 'none', textWrap: 'nowrap' }}
                        >
                          {page.name}
                        </Typography>
                      </MenuItem>
                    );
                  }
                })}
              </Menu>
            </Box>
            <Icecream
              sx={{
                display: { xs: 'flex', md: 'flex', lg: 'none' },
                mr: 1,
                fontSize: '30px',
              }}
            />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'flex', lg: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              UMUT
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'none', lg: 'flex' },
              }}
            >
              {pages.map((page) => {
                  if (page.allowed.includes(user.role.toLocaleLowerCase())) {
                    return (
                      <Button
                        key={page.id}
                        onClick={handleCloseNavMenu}
                        component={Link}
                        to={`/${page.name.toLocaleLowerCase()}`}
                        sx={{
                          my: 2,
                          color: 'white',
                          display: 'block',
                          fontWeight: '600',
                          textWrap: 'nowrap',
                        }}
                      >
                        {page.name}
                      </Button>
                    );
                  }
                },
              )}
            </Box>

            {user && (
              <IconButton onClick={handleLogout}>
                <Logout />
              </IconButton>
            )}
          </Toolbar>
        )}
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
