import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function LandingPage() {
  const { t } = useTranslation();

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {t('app.name')}
          </Typography>
          <Button color="inherit" size="small">
            {t('app.signIn')}
          </Button>
          <Button
            variant="contained"
            size="small"
            component={Link}
            to="/register"
          >
            {t('app.register')}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              {t('landing.headline')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('landing.subheadline')}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <TextField
              label={t('landing.addNewTaskLabel')}
              variant="outlined"
              size="medium"
              sx={{ flex: '1 1 260px' }}
            />

            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to="/todos"
            >
              {t('landing.getStarted')}
            </Button>
          </Box>

          <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t('landing.todaysTasks')}
            </Typography>
            <List disablePadding>
              <ListItem>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked
                    disableRipple
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon color="success" />}
                    inputProps={{
                      'aria-label': t('landing.example.completedAriaLabel'),
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={t('landing.example.reviewPriorities')}
                  sx={{ textDecoration: 'line-through', opacity: 0.7 }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={false}
                    disableRipple
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon color="success" />}
                    inputProps={{
                      'aria-label': t('landing.example.todoAriaLabel'),
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary={t('landing.example.addFirstTodo')} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={false}
                    disableRipple
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon color="success" />}
                    inputProps={{
                      'aria-label': t('landing.example.todoAriaLabel'),
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={t('landing.example.organizeCategories')}
                />
              </ListItem>
            </List>
          </Paper>
        </Box>
      </Container>
    </>
  );
}

export default LandingPage;
