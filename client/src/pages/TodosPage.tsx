import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAddTodo } from '../hooks/useTodos';
import TodosList from '../sections/TodosList';

function TodosPage() {
  const { t } = useTranslation();
  const addTodo = useAddTodo();
  const [text, setText] = useState('');

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    addTodo.mutate(trimmed);
    setText('');
  };

  return (
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

        <TodosList />
      </Box>
    </Container>
  );
}

export default TodosPage;
