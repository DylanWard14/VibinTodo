import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
  AppBar,
  Toolbar,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTodoStore } from '../stores/todoStore';
import { useTranslation } from 'react-i18next';

function TodosPage() {
  const { t } = useTranslation();
  const { todos, addTodo, toggleCompletedStatus, removeTodo, clearCompleted } =
    useTodoStore();
  const [text, setText] = useState('');

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos],
  );

  const handleAdd = () => {
    addTodo(text);
    setText('');
  };

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          <Button component={RouterLink} to="/" color="inherit" size="small">
            {t('todos.back')}
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {t('todos.title')}
          </Typography>
          <Button
            color="inherit"
            size="small"
            disabled={completedCount === 0}
            onClick={clearCompleted}
          >
            {t('todos.clearCompleted')}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              {t('todos.addItems')}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <TextField
                value={text}
                onChange={(event) => setText(event.target.value)}
                label={t('todos.newTodoLabel')}
                variant="outlined"
                fullWidth
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleAdd();
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleAdd}
                sx={{ flex: '0 0 auto', alignSelf: 'center' }}
              >
                {t('todos.addButton')}
              </Button>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('todos.todoListTitle')}
            </Typography>

            {todos.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {t('todos.emptyState')}
              </Typography>
            ) : (
              <List disablePadding>
                {todos.map((todo) => (
                  <ListItem
                    key={todo.id}
                    divider
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label={t('todos.deleteAriaLabel')}
                        onClick={() => removeTodo(todo.id)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    }
                    sx={{ alignItems: 'center' }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Checkbox
                        edge="start"
                        checked={todo.completed}
                        onChange={() => toggleCompletedStatus(todo.id)}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={todo.text}
                      primaryTypographyProps={{
                        sx: {
                          textDecoration: todo.completed
                            ? 'line-through'
                            : 'none',
                          opacity: todo.completed ? 0.7 : 1,
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Container>
    </>
  );
}

export default TodosPage;
