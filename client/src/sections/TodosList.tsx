import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTranslation } from 'react-i18next';
import {
  useClearCompleted,
  useRemoveTodo,
  useTodos,
  useToggleTodo,
} from '../hooks/useTodos';

function TodosList() {
  const { t } = useTranslation();
  const { data: todos = [], isLoading, error } = useTodos();
  const toggleTodo = useToggleTodo();
  const removeTodo = useRemoveTodo();
  const clearCompleted = useClearCompleted();

  const completedIds = todos.filter((todo) => todo.completed).map((todo) => todo.id);

  if (isLoading) {
    return (
      <Paper elevation={3} sx={{ p: 2.5, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 2.5, borderRadius: 2 }}>
        <Typography variant="body2" color="error">
          {error.message}
        </Typography>
      </Paper>
    );
  }

  if (todos.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 2.5, borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {t('todos.emptyState')}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t('todos.todoListTitle')}
      </Typography>
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
                disabled={removeTodo.isPending && removeTodo.variables === todo.id}
              >
                {removeTodo.isPending && removeTodo.variables === todo.id ? (
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
                disabled={toggleTodo.isPending && toggleTodo.variables === todo.id}
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <Link
                  to={`/todos/${todo.id}`}
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    opacity: todo.completed ? 0.7 : 1,
                    color: 'inherit',
                  }}
                >
                  {todo.text}
                </Link>
              }
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1.5 }}>
        <Button
          size="small"
          disabled={completedIds.length === 0 || clearCompleted.isPending}
          onClick={() => clearCompleted.mutate(completedIds)}
        >
          {clearCompleted.isPending ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            t('todos.clearCompleted')
          )}
        </Button>
      </Box>
    </Paper>
  );
}

export default TodosList;
