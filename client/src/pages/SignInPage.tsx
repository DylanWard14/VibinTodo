import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { login } from '../api/auth';

function SignInPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [fields, setFields] = useState({ email: '', password: '' });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate('/todos');
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate(fields);
  };

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          <Button component={RouterLink} to="/" color="inherit" size="small">
            {t('todos.back')}
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {t('app.name')}
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            size="small"
          >
            {t('app.register')}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
            {t('signIn.title')}
          </Typography>

          {mutation.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {mutation.error.message}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              name="email"
              type="email"
              label={t('signIn.email')}
              value={fields.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="password"
              type="password"
              label={t('signIn.password')}
              value={fields.password}
              onChange={handleChange}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                t('signIn.submit')
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default SignInPage;
