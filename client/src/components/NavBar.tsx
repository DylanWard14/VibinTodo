import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import ThemeToggle from './ThemeToggle';

function NavBar() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, fontWeight: 600, textDecoration: 'none', color: 'inherit' }}
        >
          {t('app.name')}
        </Typography>
        <ThemeToggle />
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button color="inherit" size="small" component={Link} to="/todos">
              {t('app.myTodos')}
            </Button>
            <AccountCircleIcon fontSize="small" />
            <Typography variant="body2">
              {t('app.hello', { firstName: user.firstName })}
            </Typography>
            <Button variant="outlined" color="inherit" size="small" onClick={clearAuth}>
              {t('app.logout')}
            </Button>
          </Box>
        ) : (
          <>
            <Button color="inherit" size="small" component={Link} to="/signin">
              {t('app.signIn')}
            </Button>
            <Button variant="contained" size="small" component={Link} to="/register">
              {t('app.register')}
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
