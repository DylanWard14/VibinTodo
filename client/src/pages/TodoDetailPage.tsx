import { useParams } from 'react-router-dom';
import {
  Box,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTodo } from '../hooks/useTodos';

function TodoDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: todo, isLoading, error } = useTodo(id!);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error.message}</Typography>
      ) : !todo ? (
        <Typography>{t('todoDetail.notFound')}</Typography>
      ) : (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {todo.text}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {t('todoDetail.status')}:
              </Typography>
              <Chip
                label={todo.completed ? t('todoDetail.completed') : t('todoDetail.incomplete')}
                color={todo.completed ? 'success' : 'default'}
                size="small"
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('todoDetail.created')}:
              </Typography>
              <Typography variant="body1">
                {new Date(todo.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default TodoDetailPage;
