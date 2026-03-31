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

function LandingPage() {
  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Todo
          </Typography>
          <Button color="inherit" size="small">
            Sign in
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Stay on top of your day.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              A simple, focused todo app to capture tasks, clear your mind, and
              keep moving forward.
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
              label="Add a new task"
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
              Get started
            </Button>
          </Box>

          <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Today&apos;s tasks
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
                    inputProps={{ 'aria-label': 'Completed example todo' }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Review today's priorities"
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
                    inputProps={{ 'aria-label': 'Example todo' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Add your first real todo" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={false}
                    disableRipple
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon color="success" />}
                    inputProps={{ 'aria-label': 'Example todo' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Organize tasks into categories" />
              </ListItem>
            </List>
          </Paper>
        </Box>
      </Container>
    </>
  );
}

export default LandingPage;
