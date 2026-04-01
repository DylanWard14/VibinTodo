import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import {
  useAddTodo,
  useClearCompleted,
  useRemoveTodo,
  useTodos,
  useToggleTodo,
} from '../hooks/useTodos';

function TodosPage() {
  const { t } = useTranslation();
  const { data: todos = [], isLoading, error } = useTodos();
  const addTodo = useAddTodo();
  const toggleTodo = useToggleTodo();
  const removeTodo = useRemoveTodo();
  const clearCompleted = useClearCompleted();
  const user = useAuthStore((state) => state.user);
  const [text, setText] = useState('');

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos],
  );

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    addTodo.mutate(trimmed);
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
            disabled={completedCount === 0 || clearCompleted.isPending}
            onClick={() =>
              clearCompleted.mutate(
                todos.filter((t) => t.completed).map((t) => t.id),
              )
            }
          >
            {clearCompleted.isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              t('todos.clearCompleted')
            )}
          </Button>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountCircleIcon fontSize="small" />
              <Typography variant="body2">
                {t('app.hello', { firstName: user.firstName })}
              </Typography>
            </Box>
          )}
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
                disabled={addTodo.isPending}
                sx={{ flex: '0 0 auto', alignSelf: 'center' }}
              >
                {addTodo.isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  t('todos.addButton')
                )}
              </Button>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('todos.todoListTitle')}
            </Typography>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : error ? (
              <Typography variant="body2" color="error">
                {error.message}
              </Typography>
            ) : todos.length === 0 ? (
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
                        onClick={() => removeTodo.mutate(todo.id)}
                        disabled={
                          removeTodo.isPending &&
                          removeTodo.variables === todo.id
                        }
                      >
                        {removeTodo.isPending &&
                        removeTodo.variables === todo.id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <DeleteOutlineIcon />
                        )}
                      </IconButton>
                    }
                    sx={{ alignItems: 'center' }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Checkbox
                        edge="start"
                        checked={todo.completed}
                        onChange={() => toggleTodo.mutate(todo.id)}
                        disabled={
                          toggleTodo.isPending &&
                          toggleTodo.variables === todo.id
                        }
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
